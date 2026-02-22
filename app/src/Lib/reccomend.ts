import type { MenuItem } from "../data/restaurants";

type ComboTemplate = "main+side+drink" | "main+drink" | "main+side" | "main";

type ComboCandidate = {
  items: MenuItem[];
  template: ComboTemplate;
  totalPrice: number;
  score: number;
};

export type GeneratedCombo = {
  itemNames: string[];
  totalPrice: number;
  score: number;
  template: ComboTemplate;
};

const TEMPLATE_WEIGHT: Record<ComboTemplate, number> = {
  "main+side+drink": 4,
  "main+drink": 3,
  "main+side": 3,
  main: 2,
};

function totalPrice(items: MenuItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function averageRating(items: MenuItem[]): number {
  if (items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + (item.rating ?? 0), 0) / items.length;
}

function buildCandidate(items: MenuItem[], template: ComboTemplate, budget: number): ComboCandidate {
  const price = totalPrice(items);
  const budgetFit = Math.min(price / budget, 1); // closer to budget is better
  const rating = averageRating(items);
  const score = TEMPLATE_WEIGHT[template] + budgetFit + rating;

  return {
    items,
    template,
    totalPrice: price,
    score,
  };
}

function selectBest(candidates: ComboCandidate[]): ComboCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  return [...candidates].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.totalPrice !== a.totalPrice) {
      return b.totalPrice - a.totalPrice;
    }
    return a.items.length - b.items.length;
  })[0];
}

export function generateBestCombo(menuItems: MenuItem[], budget: number): GeneratedCombo | null {
  if (!Number.isFinite(budget) || budget <= 0) {
    return null;
  }

  const mains = menuItems.filter((item) => item.category === "main");
  const sides = menuItems.filter((item) => item.category === "side");
  const drinks = menuItems.filter((item) => item.category === "drink");

  const candidates: ComboCandidate[] = [];

  for (const main of mains) {
    if (main.price <= budget) {
      candidates.push(buildCandidate([main], "main", budget));
    }
  }

  for (const main of mains) {
    for (const side of sides) {
      const items = [main, side];
      if (totalPrice(items) <= budget) {
        candidates.push(buildCandidate(items, "main+side", budget));
      }
    }
  }

  for (const main of mains) {
    for (const drink of drinks) {
      const items = [main, drink];
      if (totalPrice(items) <= budget) {
        candidates.push(buildCandidate(items, "main+drink", budget));
      }
    }
  }

  for (const main of mains) {
    for (const side of sides) {
      for (const drink of drinks) {
        const items = [main, side, drink];
        if (totalPrice(items) <= budget) {
          candidates.push(buildCandidate(items, "main+side+drink", budget));
        }
      }
    }
  }

  const best = selectBest(candidates);
  if (!best) {
    return null;
  }

  return {
    itemNames: best.items.map((item) => item.name),
    totalPrice: Number(best.totalPrice.toFixed(2)),
    score: Number(best.score.toFixed(2)),
    template: best.template,
  };
}
