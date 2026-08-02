module.exports = [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin")
    },
    rules: {
      // keep conservative rules; adjust as needed
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  }
];
