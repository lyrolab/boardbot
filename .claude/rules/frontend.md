---
description: 
globs: **/frontend/**
alwaysApply: false
---
## Project
- Frontend is in `/packages/frontend` folder. When typing commands, cd into the folder before.
- Organized in feature folders (modules), then types (components, queries, types, entrypoints, store, etc.)

## React Query and OpenAPI
- The command to generate OpenAPI client is `npm run generate-api-clients`.
- You need to create a wrapper hook in modules/xxx/queries/entityName.ts (example: useCreateBoard).
- No need to add try/catch wrappers, all errors are already handled globally by React Query.

## @MUI
- We use MUI.

## Forms
- Use React hook form to create forms, even the simplest.
- Always create a Zod schema for forms.
