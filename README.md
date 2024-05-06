# UWA Orthodontics App

supabaseClient.js needs to be created in src/ 
It is removed for privacy reasons
This branch only contains database connection directly to supabase, no prisma

>[Figma UI Design](https://www.figma.com/file/EXY0lfLzYuVew2JNaDxLPs/UWA-Orthodontics-Client-Application%EF%BC%88mobile%EF%BC%89?type=design&node-id=0%3A1&mode=design&t=TVZXbkhZlsytTzkw-1)

## Getting Started

1. Install [Node.js](https://nodejs.org/en/download/).
2. Install the dependencies
   ```
   npm install
   ```
3. Duplicate the `.env.example` file as `.env` and fill in the values.
4. Run the development server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000 with your browser.

### Querying the database

A simple database query is written in `/src/query-script.ts`. To execute this query and see the results in terminal, run:

```
npx tsx ./src/query-script.ts
```

For more information on querying the database with Prisma, checkout https://www.prisma.io/docs/orm/prisma-client/queries.

## Prisma

### Development

When you make changes to the database schema (`/prisma/schema.prisma`), you should sync the Prisma client with it. Run:

```
npx prisma db push
```

### Migration

When you are happy with the schema and everything works, run:

```
npm run prisma:migrate
```

### Studio

To view the data and play around with it, run:

```
npm run prisma:studio
```
