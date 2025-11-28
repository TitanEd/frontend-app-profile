// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

module.exports = {
  ...createConfig('eslint'),
  rules: {
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/button-has-type': 'off',
    'max-len': 'off',
    'react/no-unused-prop-types': 'off',
    'global-require': 'off',
    'react/no-array-index-key': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
  },
};
