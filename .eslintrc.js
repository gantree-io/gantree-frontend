module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "standard", "prettier"],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {},
  globals: {
    _env: true, // NOTE: directly related to substitution performed by rollup plugin "replace" in rollup.config.js
  },
}
