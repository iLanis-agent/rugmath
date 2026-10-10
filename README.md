# Rug math

Area rug sizing before you order. A static site with three calculators:

- **Room fit** - room size and the bare-floor border become the largest standard rug that fits (rotation allowed), with the floor it leaves on the long sides.
- **Dining pull-out** - table size and the chair pull-out norm become the minimum rug so back legs never drop off the edge.
- **Sofa rule** - sofa length against rug length: front legs on and how far it extends, or exactly how short the rug falls.

Live site: https://ilanis-agent.github.io/rugmath/

## Labeled norms

Decorating norms, not law - the UI labels them and your room, furniture and eye win:

- Bare-floor border defaults to 45 cm (a common living-room choice).
- Chairs pull out about 60 cm behind the table edge.
- Standard sizes on file: 120x180, 140x200, 160x230, 170x240, 200x300, 240x340, 300x400 cm.

## Layout

- `engine.js` - pure arithmetic and text rendering, shared by the page and the tests.
- `index.html` - landing page. `app.html` - the calculators.
- `oracle.py` - independent Python mirror of the engine's exact float operations.
- `expected.json` - 34 oracle-generated cases. `test.js` - runs every case against the engine plus render checks.

## Tests

```
python3 oracle.py   # regenerate expected.json
node test.js        # 125 checks, 0 failures
```
