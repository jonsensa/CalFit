/* global __dirname */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

function loadModule(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

const { calculateGoalTarget, hasGoal } = loadModule('src/types/userProfile.ts');
const stats = {
  age: 25,
  heightCm: 175,
  weightKg: 70,
  sex: 'male',
  activityLevel: 'moderate',
  bmi: 22.9,
  maintenanceCalories: 2500,
};

for (const [goal, expected] of [
  ['loseWeight', 2000],
  ['gainWeight', 2800],
  ['justTrack', 2500],
]) {
  test(`${goal}: target, buffer, and storage round-trip`, async () => {
    const target = calculateGoalTarget(2500, goal);
    assert.equal(target.goal, goal);
    assert.equal(target.dailyTarget, expected);
    assert.equal(target.bufferRange.min, expected - 100);
    assert.equal(target.bufferRange.max, expected + 100);
    let stored;
    const storage = loadModule('src/storage/userProfileStorage.ts', {
      '@react-native-async-storage/async-storage': {
        setItem: async (key, value) => {
          assert.equal(key, 'userProfile');
          stored = value;
        },
        getItem: async (key) => {
          assert.equal(key, 'userProfile');
          return stored;
        },
      },
    });
    const profile = { ...stats, ...target };
    await storage.saveUserProfile(profile);
    const restored = await storage.loadUserProfile();
    assert.equal(JSON.stringify(restored), JSON.stringify(profile));
    assert.equal(hasGoal(restored), true);
  });
}

test('legacy and incomplete profiles need goal selection', () => {
  assert.equal(hasGoal(stats), false);
  assert.equal(hasGoal({ ...stats, goal: 'justTrack' }), false);
  assert.equal(
    hasGoal({ ...stats, ...calculateGoalTarget(2500, 'justTrack'), goal: 'unknown' }),
    false,
  );
});

test('save failure is propagated so onboarding can retry', async () => {
  const storage = loadModule('src/storage/userProfileStorage.ts', {
    '@react-native-async-storage/async-storage': {
      setItem: async () => {
        throw new Error('Storage unavailable');
      },
    },
  });
  await assert.rejects(
    storage.saveUserProfile({ ...stats, ...calculateGoalTarget(2500, 'justTrack') }),
    /Storage unavailable/,
  );
});
