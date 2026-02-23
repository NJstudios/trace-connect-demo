# Trace Connect — DECA Demo Website (Mock)

This is a **UI demo** (not a real CAD/BIM generator) built for DECA judging.

## What it shows
- Projects dashboard
- New project wizard: **Projects → New Project → Blueprint/Template → Generate**
- Generated outputs:
  - 3D model viewer (mock BIM-style massing)
  - Schedule (WBS + timeline)
  - Materials list (BOM / takeoff)
  - Risk flags
  - Export / integration buttons (mock)

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:5173

## Notes
- All data is stored in `localStorage` and can be reset in the Projects page.
- The 3D model uses `@react-three/fiber` + `drei` and simple parametric geometry for speed.

