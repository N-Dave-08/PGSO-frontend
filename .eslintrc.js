module.exports = {
    extends: "next/core-web-vitals",
    rules: {
        // Add specific rules here
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