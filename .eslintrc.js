module.exports = {
    extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        // Add any other specific rules here
    },
    overrides: [
        {
            // Disable no-unused-vars for specific files
            files: [
                "./src/components/forms/login-form.tsx",
                "./src/components/modals/login-modal.tsx",
                "./src/components/modals/request-details.tsx",
                "./src/components/sidebars/user-sidebar.tsx",
                "./src/lib/api/axios.ts",
                "./src/lib/utils/encryption.ts"
            ],
            rules: {
                "@typescript-eslint/no-unused-vars": "off"
            }
        }
    ]
} 