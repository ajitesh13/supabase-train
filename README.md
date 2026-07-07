# supabase-train

Dummy Supabase Edge Functions demonstrating DB read/write patterns against the `logs` table.

Project ref: `rjvnmwmhfkgisnvkqphz`

## Functions

**Group 1** (1 write + 3 reads):
- `group1-write` — inserts a row
- `group1-read-a` — selects latest 5 rows
- `group1-read-b` — returns row count
- `group1-read-c` — selects the single latest row

**Group 2** (1 write + 1 read):
- `group2-write` — inserts a row
- `group2-read` — selects latest 10 rows

## Schema

```sql
create table logs (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz default now()
);
```

## Deploy

```
supabase link --project-ref rjvnmwmhfkgisnvkqphz
supabase db push
supabase functions deploy <function-name> --no-verify-jwt
```
