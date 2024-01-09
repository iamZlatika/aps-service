// eslint-disable-next-line no-undef
module.exports = {
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es2021: true,
  },
  extends: [
    // "eslint:recommended",
    // "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "prefer-const": 0,
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
};
