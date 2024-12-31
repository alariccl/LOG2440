import globals from "globals";
import pluginJs from "@eslint/js";
import jestPlugin from "eslint-plugin-jest"
import cypressPlugin from "eslint-plugin-cypress";

export default [
  { languageOptions: { globals: { ...globals.browser, ...jestPlugin.environments.globals.globals, ...cypressPlugin.environments.globals.globals } } },
  pluginJs.configs.recommended,
  {
    rules: {
      "comma-style": ["error", "last"],
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "max-len": [
        "error",
        {
          "code": 120,
          "comments": 130,
          "ignoreStrings": true,
          "ignoreUrls": true,
          "ignoreTemplateLiterals": true
        }
      ],
      "max-lines": ["error", 400],
      "no-magic-numbers": ["error", { "ignore": [0, 1, 2, 3, 100, -1], "ignoreDefaultValues": true }],
      "no-mixed-spaces-and-tabs": "error",
      "no-multi-spaces": "error",
      "no-multi-str": "error",
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
      "no-obj-calls": "error",
      "no-octal": "error",
      "no-octal-escape": "error",
      "no-redeclare": ["error", { "builtinGlobals": false }],
      "no-regex-spaces": "error",
      "no-return-assign": ["error", "except-parens"],
      "no-self-assign": ["error", { "props": true }],
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-this-before-super": "error",
      "no-throw-literal": "error",
      "no-trailing-spaces": "error",
      "no-unexpected-multiline": "error",
      "no-unmodified-loop-condition": "error",
      "no-unneeded-ternary": ["error", { "defaultAssignment": false }],
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "no-unused-expressions": [
        "error",
        {
          "allowShortCircuit": true,
          "allowTernary": true,
          "allowTaggedTemplates": true
        }
      ],
      "no-unused-vars": [
        "error",
        {
          "args": "none",
          "caughtErrors": "none",
          "ignoreRestSiblings": true,
          "vars": "all"
        }
      ],
      "no-var": "error",
      "prefer-const": ["error", { "destructuring": "all" }],
      "semi": "error",
      "semi-spacing": ["error", { "before": false, "after": true }],
      "template-curly-spacing": ["error", "never"],
      "template-tag-spacing": ["error", "never"],
    }
  },
  {
    ignores: ['eslint.config.js', 'jest/*.spec.js'],
  }
];