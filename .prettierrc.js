module.exports = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  singleQuote: false,
  trailingComma: "all",
  arrowParens: "always",
  useTabs: false,
  importOrder: [
    "^[a-z]",            // Matches all third-party libraries that start with lowercase (node modules)
    "^@[a-z]",            // Matches scoped packages like @react-navigation/native
    "^@/",
    "<LIB_ALIAS_END>",
    "^\\./", // Relative imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
