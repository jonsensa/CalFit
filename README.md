# calorie-tracker

Iteration 2: stats entry, goal selection, and saved daily calorie targets.

## Run on your phone

1. Install Node.js LTS and Expo Go on your phone.
2. Run `npm install` in this directory after cloning.
3. Run `npx expo start`.
4. Connect your computer and phone to the same Wi-Fi and scan the terminal QR code
   with Expo Go (Android) or the Camera app (iOS).

Enter your stats, then choose Lose weight (maintenance − 500), Gain weight
(maintenance + 300), or Just track (maintenance). Home shows the daily target,
its ±100-calorie range, BMI, and maintenance calories. The profile is saved locally
and restored on reopening. Profiles saved before goal selection was added open
at the goal step with their existing stats preserved.

On Windows, if the PowerShell npm/npx launcher reports a missing `npm-cli.js`, use
`npm.cmd install` and `npx.cmd expo start` instead.

## Checks

```sh
npm run typecheck
npm run lint
npm run format:check
node --test tests/userProfile.test.cjs
```

Run `npm run format` to apply formatting.

See [architecture.md](architecture.md) for the small file structure.
