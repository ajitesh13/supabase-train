create table logs (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz default now()
);
