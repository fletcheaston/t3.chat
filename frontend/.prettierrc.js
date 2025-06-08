/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    useTabs: false,
    tabWidth: 4,
    singleAttributePerLine: true,
    trailingComma: "es5",
    singleQuote: false,
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    printWidth: 100,
    importOrder: ["^react$", "<THIRD_PARTY_MODULES>", "@/.*", "^[./]"],
};

export default config;
