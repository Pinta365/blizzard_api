---
title: Character statistics
description: What base and effective mean, and why effective can be lower than base.
---

*Last checked 2026-11-09.*

`characterStatistics` returns the primary stats as `{ base, effective }`. Tested by comparing the API with the in-game character sheet.

## base and effective

They are the numbers of the in-game stat tooltip, e.g. `Strength 44 (48 +32 −36)`:

- **`base`** is the white number: `48`.
- **`effective`** is the total: base plus bonuses (gear, talents, buffs), minus penalties (debuffs): `44`.

The API returns only those two, not the bonuses and penalties apart. The values are a snapshot from the character's last logout, with whatever was active then.

## When effective is lower than base

**Debuffs at logout.** Resurrection Sickness takes 75% of `base`, rounded up, from each primary stat, and leaves gear bonuses alone. Stats with little gear on them drop below `base`.

To detect it, sum each stat from the items in `characterEquipments()` and compute `penalty = base + gear − effective`. If the penalty equals `ceil(base × 0.75)` on all five primary stats, the character logged out with Resurrection Sickness. Talents and buffs can shift this by a point or two.

| Stat | base | gear | effective | penalty | ceil(base × 0.75) |
| :- | -: | -: | -: | -: | -: |
| Strength | 32 | 14 | 22 | 24 | 24 |
| Agility | 37 | 27 | 36 | 28 | 28 |
| Stamina | 35 | 35 | 43 | 27 | 27 |
| Intellect | 51 | 2 | 14 | 39 | 39 |
| Spirit | 47 | 7 | 18 | 36 | 36 |

**Negative stats on gear**, e.g. an item with −3 Strength. That affects only the stats involved, and `base + gear` alone explains it.

In general, `effective − base − gear` is what buffs, talents and debuffs added or removed at logout. The API doesn't say which ones were active.
