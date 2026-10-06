const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
});

// Paragon resolves the hoisted react-intl 10 (ESM). The app's IntlProvider comes from
// @edx/frontend-platform, which resolves its own react-intl 6. Jest then fails to parse
// v10, and the two copies do not share context. Resolve react-intl the same way the
// platform package does so tests and the provider use one copy. The app bundle is unchanged.
const platformDir = path.dirname(require.resolve('@edx/frontend-platform/package.json'));
config.moduleNameMapper = {
  ...config.moduleNameMapper,
  '^react-intl$': require.resolve('react-intl', { paths: [platformDir] }),
};

module.exports = config;
