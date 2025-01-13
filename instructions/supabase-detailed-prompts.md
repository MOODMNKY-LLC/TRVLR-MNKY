
# Supabase AI Prompting: Comprehensive, Detailed Document

## How to Use

1. **Copy** this entire document into your repository (e.g., `supabase-ai-prompts.md` or `.cursorrules`).
2. **Include** the file in your IDE conversations:
   - **GitHub Copilot**: `#<filename>`
   - **Cursor**: `@Files`
   - **Zed**: `/file`
3. **Reference** the relevant sections as needed for:
   - Next.js + Supabase Auth setup
   - RLS (Row Level Security) policy creation
   - PostgreSQL function creation
   - Supabase migrations
   - General PostgreSQL style guidelines

---

## 1. **Bootstrap Next.js App with Supabase Auth** 
*(Prompt: “API Prompt: Bootstrap Next.js app with Supabase Auth”)*

> **Original Prompt Sections**:  
> - Create a Next.js app that uses App Router with Supabase Auth.  
> - Follow Supabase's guidelines for using the `@supabase/ssr` package and Server-Side Auth.  
> - Required utility functions (client-side & server-side, using `cookies`).  
> - Example cookie usage snippet.  
> - Middleware with `updateSession` function.  

### How to use

- Copy the prompt to a file in your repo.
- Use the “include file” feature from your AI tool to include the prompt when chatting with your AI assistant.

### Prompt Details

\`\`\`ts
# Bootstrap Next.js app with Supabase Auth

Create a Next.js app that uses App Router with Supabase Auth.

Follow Supabase's guidelines for using the `@supabase/ssr` package and Server-Side Auth. Specifically, there should be:

- A utility function to create a client on the client side
- A utility function create a client on the server side, using the Next.js `cookies` API to access the cookies. Use the latest version of the API, where `cookies` must be awaited.
- A utility function to handle refreshing the user session in middleware.

## Working with cookies

Use the latest version of `@supabase/ssr`, where cookie options are defined with the `getAll` and `setAll` functions, like so:

const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
\`\`\`

No other cookie options should be provided.

## Middleware

The middleware should use the following `updateSession` function:

\`\`\`ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
\`\`\`

---

## 2. **Database: Create RLS Policies** 
*(Prompt: “API Prompt: Database: Create RLS policies”)*

> **Original Prompt Sections**:
> - Must generate valid SQL for RLS policies using `CREATE POLICY` or `ALTER POLICY`.
> - Detailed instructions on `USING` vs. `WITH CHECK`, handling of `anon` and `authenticated` roles, naming policies, etc.
> - Performance tips around `(select auth.uid())`.

### How to use

- Copy the prompt to a file in your repo.
- Use the “include file” feature from your AI tool to include the prompt.

### Prompt Details

\`\`\`sql
# Database: Create RLS policies

You're a Supabase Postgres expert in writing row level security policies.

CREATE POLICY "My descriptive policy." ON books FOR INSERT to authenticated USING ( (select auth.uid()) = author_id ) WITH ( true );
\`\`\`

(Additional details truncated for brevity.)

---

## 3. **Database: Create Functions** 
*(Prompt: “API Prompt: Database: Create functions”)*

> **Original Prompt Sections**:
> - Best practices for writing PostgreSQL functions in a Supabase context.
> - Security guidelines, `search_path` usage, explicit typing, immutability, example triggers, etc.

\`\`\`sql
# Database: Create functions

CREATE OR REPLACE FUNCTION ...
SECURITY INVOKER;
SET SEARCH_PATH = '';
...
\`\`\`

---

## 4. **Database: Create Migration** 
*(Prompt: “API Prompt: Database: Create migration”)*

> **Original Prompt Sections**:
> - Creating migration files in `supabase/migrations/` folder, using naming convention `YYYYMMDDHHmmss_description.sql`.
> - Must enable RLS on newly created tables. 
> - Thorough comments, usage of Supabase CLI, best practices.

### How to use

- Copy the prompt to a file in your repo.

\`\`\`sql
# Database: Create migration

20240906123045_create_profiles.sql

CREATE TABLE public.profiles ...
\`\`\`

---

## 5. **Postgres SQL Style Guide** 
*(Prompt: “API Prompt: Postgres SQL Style Guide”)*

> **Original Prompt Sections**:
> - Lowercase SQL keywords, snake_case names, prefer plurals for tables, singular for columns, indentation, etc.

\`\`\`sql
# Postgres SQL Style Guide

select
  employees.employee_name,
  departments.department_name
from
  employees
join
  departments ...
\`\`\`

---

## Putting It All Together

When you include this **unified document** in your `.cursorrules` file, your AI assistant will have access to all instructions for:

1. **Bootstrapping Next.js + Supabase Auth**
2. **Creating RLS Policies**
3. **Creating PostgreSQL Functions**
4. **Writing Supabase Migrations**
5. **Following the Postgres SQL Style Guide**

---

**End of Comprehensive Document**
