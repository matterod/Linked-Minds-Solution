---
description: How to deploy the Linked Minds web app to Firebase Hosting
---

# Deploy to Firebase Hosting

// turbo-all

1. Build the production bundle:
```bash
npm run build
```

2. Deploy to Firebase Hosting:
```bash
npx firebase-tools deploy --only hosting --project esp32rinconada
```

> **Note**: Make sure you have a valid `.env` file with all required variables before building.
> The build will embed the env vars at compile time.
