import { useState } from "react";
import "./App.css";
import { colleges, restaurants } from "./data/restaurants";

type College = (typeof colleges)[number];

type SearchResult = {
  restaurant: string;
  distance: number;
  walkMinutes: number;
  address: string;
  comboName: string;
  comboPrice: number;
  valueScore: number;
};

function milesToWalkMinutes(distanceMiles: number): number {
  // Approximate walking speed: 3 mph
  return Math.max(1, Math.round((distanceMiles / 3) * 60));
}


function App() {
  const [college, setCollege] = useState<College>(colleges[0]);
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericBudget = Number(budget);

    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      setError("Enter a valid budget greater than $0.");
      setResults([]);
      setHasSearched(true);
      return;
    }

    setError("");

    const rankedResults = restaurants
      .map((restaurant): SearchResult | null => {
        const distance = restaurant.distances[college];
        if (distance === undefined) {
          return null;
        }

        const affordableCombos = restaurant.combos.filter((combo) => combo.price <= numericBudget);
        if (affordableCombos.length === 0) {
          return null;
        }

        const bestCombo = [...affordableCombos].sort((a, b) => {
          if (b.valueScore !== a.valueScore) {
            return b.valueScore - a.valueScore;
          }
          return a.price - b.price;
        })[0];

        return {
          restaurant: restaurant.name,
          distance,
          walkMinutes: milesToWalkMinutes(distance),
          address: restaurant.address,
          comboName: bestCombo.name,
          comboPrice: bestCombo.price,
          valueScore: bestCombo.valueScore,
        };
      })
      .filter((result): result is SearchResult => result !== null)
      .sort((a, b) => {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
        return b.valueScore - a.valueScore;
      });

    setResults(rankedResults);
    setHasSearched(true);
  };

  return (
    <main className="page">
      <h1>YGrubs</h1>
      <p>Find pickup meals near your residential college within budget.</p>

      <form onSubmit={onSubmit} className="card">
        <label>
          Residential College
          <select value={college} onChange={(e) => setCollege(e.target.value as College)}>
            {colleges.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Budget ($)
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="12.00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </label>

        <button type="submit">Find Food</button>
      </form>

      {error && <p className="error">{error}</p>}

      {hasSearched && !error && (
        <section className="results">
          <h2>Results</h2>
          {results.length === 0 ? (
            <p>No combos found under your budget. Try increasing it.</p>
          ) : (
            <ul>
              {results.map((result) => (
                <li key={result.restaurant}>
                  <h3>{result.restaurant}</h3>
                  <p>{result.comboName}</p>
                  <p>
                    ${result.comboPrice.toFixed(2)} • {result.distance.toFixed(1)} mi • ~{result.walkMinutes} min walk • Value {result.valueScore}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
