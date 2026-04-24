# NotiRest Backend Implementation Plan

Add complete backend logic, integrating Supabase (for database/auth) and Notion (for database interaction).

## User Review Required

> [!WARNING]  
> We need to install `@notionhq/client` and `@supabase/ssr` to securely handle Next.js server-side operations and Notion API interactions. Please let me know if you approve running `npm install @notionhq/client @supabase/ssr @supabase/supabase-js`.

> [!IMPORTANT]  
> Because the app requires Supabase tables to store connections and API keys, I will provide a SQL snippet (`setup.sql`) that you should run in your Supabase SQL Editor.

## Proposed Changes

### Setup and Environment

#### [NEW] \`.env.local\`
- I will populate your `.env.local` with the provided Supabase and Notion credentials.

#### [NEW] \`supabase.sql\`
- A script to run in your Supabase SQL Editor to create `connections` and `api_keys` tables, along with Row Level Security (RLS) policies.

#### [NEW] \`lib/supabase-server.ts\`
- Server-side Supabase client using `@supabase/ssr` for secure API route session handling.

---

### API Routes

#### [NEW] \`app/api/auth/notion/callback/route.ts\`
- Handles the Notion OAuth callback.
- Exchanges the `code` for an access token (and workspace info).
- Saves the workspace token in a securely encrypted format or directly to a user-associated `notion_workspaces` table in Supabase.

#### [NEW] \`app/api/connections/route.ts\`
- **GET**: Fetch all active Notion database connections for the logged-in user.
- **POST**: Create a new connection mapping a custom `slug` to a Notion `databaseId`.

#### [NEW] \`app/api/connections/[id]/route.ts\`
- **DELETE**: Remove an endpoint connection.

#### [NEW] \`app/api/keys/route.ts\`
- **GET**: List all generated API keys (showing only prefix/preview) for the user.
- **POST**: Generate a secure 32-character API key. Hash the full key and save the hash + preview to Supabase. Return the full key once to the client.

#### [NEW] \`app/api/keys/[id]/route.ts\`
- **DELETE**: Revoke/delete a specific API key.

#### [NEW] \`app/api/[endpoint]/route.ts\`
- **GET, POST, PATCH, DELETE**: Dynamic route for end-users to interact with the Notion database.
- It will read the `x-api-key` header, hash it, and verify it against Supabase.
- If valid, look up the endpoint by `[endpoint]` slug.
- Construct and send the corresponding operation to Notion API using `@notionhq/client`.

---

### Dashboard UI Integration

#### [MODIFY] \`app/dashboard/page.tsx\`
- Remove `localStorage` logic. 
- Use `useEffect` to fetch live data from `/api/connections` and `/api/keys` to populate stats.

#### [MODIFY] \`app/dashboard/endpoints/page.tsx\`
- Remove `localStorage`. 
- Hook the "Create Endpoint" and "Delete" buttons to call `POST /api/connections` and `DELETE /api/connections/[id]`.

#### [MODIFY] \`app/dashboard/api-keys/page.tsx\`
- Remove `localStorage`. 
- Refactor the generator to call `POST /api/keys` and render the received full key on success.
- Hook up "Delete Key" to `DELETE /api/keys/[id]`.

## Open Questions
- Do you want the Notion tokens to be encrypted in the database, or is plain text fine for this project?
- Should we restrict Notion OAuth to purely read/write on selected pages, or do you have a specific OAuth permission scope set up already? (It usually depends on Notion integration settings).

## Verification Plan
### Automated Tests
- Build verification via `npm run build` once completely coded.

### Manual Verification
- We'll simulate generating an API Key from the frontend.
- We'll simulate creating an Endpoint from the frontend.
- Provide a `curl` example using the generated `x-api-key` over `GET /api/[slug]` to hit Notion DB.
