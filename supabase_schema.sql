-- Tabla de chats
create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null default 'Chat 1',
  created_at timestamp with time zone default now(),
  unique (user_id, name)
);

-- Tabla de mensajes
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade not null,
  sender text not null check (sender in ('user', 'lautaro')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- Limitar a 3 chats por usuario (en lógica de app, no SQL, para flexibilidad) 