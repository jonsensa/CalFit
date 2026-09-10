# calorie-tracker

Iteration 0: Expo, React Native, TypeScript, and two blank React Navigation screens.

## Run on your phone

1. Install Node.js LTS and Expo Go on your phone.
2. Run `npm install` in this directory after cloning.
3. Run `npx expo start`.
4. Connect your computer and phone to the same Wi-Fi and scan the terminal QR code
   with Expo Go (Android) or the Camera app (iOS).

The app opens to a blank white Onboarding screen. Home is registered for future
navigation; there are intentionally no buttons or forms yet.

On Windows, if the PowerShell npm/npx launcher reports a missing `npm-cli.js`, use
`npm.cmd install` and `npx.cmd expo start` instead.

## Checks

```sh
npm run typecheck
npm run lint
npm run format:check
```

Run `npm run format` to apply formatting.

See [architecture.md](architecture.md) for the small file structure.
