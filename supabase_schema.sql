-- Tabla de chats
create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null default 'Chat 1',
  state_order integer not null default 0,
  created_at timestamp with time zone default now(),
  unique (user_id, name),
  constraint initial_state_first check (state_order = 0 or state_order > 0)
);

-- Create index for state ordering
create index if not exists idx_chats_state_order on chats(state_order);

-- Tabla de mensajes
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade not null,
  sender text not null check (sender in ('user', 'lautaro')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- Trigger function to ensure proper state ordering
create or replace function ensure_initial_state()
returns trigger as $$
begin
  if new.state_order = 0 then
    -- If this is the initial state, ensure no other initial state exists
    if exists (select 1 from chats where user_id = new.user_id and state_order = 0) then
      raise exception 'Initial state already exists for this user';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger
drop trigger if exists check_initial_state on chats;
create trigger check_initial_state
before insert on chats
for each row
execute function ensure_initial_state();

-- Limitar a 3 chats por usuario (en lógica de app, no SQL, para flexibilidad) 