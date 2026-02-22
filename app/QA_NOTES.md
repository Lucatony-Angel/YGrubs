# QA Notes (MVP)

Date: 2026-02-22

## Scope
- Validate recommendation behavior across budgets.
- Confirm result volume and ordering are stable.
- Capture representative outputs for demo prep.

## Test Setup
- Tested colleges:
  - `Berkeley`
  - `Branford`
  - `Trumbull`
  - `Benjamin Franklin`
- Tested budgets:
  - `$8`
  - `$12`
  - `$15`
  - `$20`

## Repro Command
Run from repo root:

```bash
cd app && npx tsc src/data/restaurants.ts src/Lib/reccomend.ts --outDir /tmp/ygrubs-qa --module commonjs --target ES2020 --esModuleInterop --skipLibCheck
```

Then run the QA script (same one used in this pass) to print ranked outputs by college and budget.

## Result Volume Matrix
Average results per tested college:

| Budget | Avg results |
|---|---:|
| $8 | 4.0 |
| $12 | 7.0 |
| $15 | 9.0 |
| $20 | 10.0 |

## Representative Output Snapshots

### Berkeley
- `$8`: Good Nature Market (Broadway) -> `$6.00` (`main`)
- `$12`: Good Nature Market (Broadway) -> `$11.00` (`main`)
- `$15`: Good Nature Market (Broadway) -> `$11.00` (`main`)
- `$20`: Good Nature Market (Broadway) -> `$11.00` (`main`)

### Branford
- `$8`: Atticus Cafe Downtown -> `$6.50` (`main`)
- `$12`: Atticus Cafe Downtown -> `$12.00` (`main+drink`)
- `$15`: Atticus Cafe Downtown -> `$14.75` (`main+drink`)
- `$20`: Atticus Cafe Downtown -> `$19.45` (`main+side+drink`)

## Notes
- Sorting behavior is stable:
  - Primary: distance ascending.
  - Tiebreak: score descending.
- Combo templates are showing as expected:
  - `main`, `main+side`, `main+drink`, `main+side+drink`.
- At lower budgets, only restaurants with lower-priced mains appear.
- At higher budgets, 3-item templates appear more often.
