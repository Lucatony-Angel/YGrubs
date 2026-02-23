import { useState } from "react";
import "./App.css";
import { colleges, restaurants } from "./data/restaurants";
import { generateBestCombo } from "./Lib/reccomend";

type College = (typeof colleges)[number];
const MAX_RADIUS_MILES = 1.3;

type SearchResult = {
  restaurant: string;
  distance: number;
  walkMinutes: number;
  address: string;
  comboTemplate: string;
  comboName: string;
  comboPrice: number;
  valueScore: number;
};

function milesToWalkMinutes(distanceMiles: number): number {
  // Approximate walking speed: 3 mph
  return Math.max(1, Math.round((distanceMiles / 3) * 60));
}

function formatTemplate(template: string): string {
  return template
    .split("+")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" + ");
}

function getScoreTier(score: number): "score-bad" | "score-medium" | "score-good" {
  if (score < 3.3) {
    return "score-bad";
  }
  if (score <= 4.2) {
    return "score-medium";
  }
  return "score-good";
}

const crestOutlineCount = 140;

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
        if (distance > MAX_RADIUS_MILES) {
          return null;
        }

        const bestCombo = generateBestCombo(restaurant.menuItems, numericBudget);
        if (!bestCombo) {
          return null;
        }

        return {
          restaurant: restaurant.name,
          distance,
          walkMinutes: milesToWalkMinutes(distance),
          address: restaurant.address,
          comboTemplate: formatTemplate(bestCombo.template),
          comboName: bestCombo.itemNames.join(" + "),
          comboPrice: bestCombo.totalPrice,
          valueScore: bestCombo.score,
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
    <div className="app-shell">
      <div className="crest-wall" aria-hidden="true">
        {Array.from({ length: crestOutlineCount }).map((_, index) => (
          <span key={`crest-${index}`} className="crest-icon" />
        ))}
      </div>

      <header className="top-banner">
        <div className="top-banner-inner">
          <h1>YGrubs</h1>
          <p>Find pickup meals near your residential college within budget.</p>
        </div>
      </header>

      <main className="page">
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
                    <p className="result-address">{result.address}</p>
                    <p className="result-combo">{result.comboName}</p>
                    <p className="result-template">{result.comboTemplate}</p>
                    <p className="result-meta">
                      <span>${result.comboPrice.toFixed(2)}</span>
                      <span>{result.distance.toFixed(1)} mi</span>
                      <span>~{result.walkMinutes} min walk</span>
                      <span className={`score-badge ${getScoreTier(result.valueScore)}`}>
                        Score {result.valueScore.toFixed(2)}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
