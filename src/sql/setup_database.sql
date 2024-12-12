-- Remover tabelas existentes se necessário
drop table if exists notes;
drop table if exists devotionals;

-- Criar tabela de devocionais
create table devotionals (
  id bigint primary key generated always as identity,
  day int not null,
  title varchar not null,
  verse_text text not null,
  verse_reference varchar not null,
  verse_book varchar not null,
  verse_chapter varchar not null,
  verse_number varchar not null,
  devotional_text text not null,
  practical_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_day unique (day),
  constraint day_range check (day >= 1 and day <= 366)
);

create index devotionals_day_idx on devotionals(day);

-- Criar tabela de notas
create table notes (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id),
  devotional_day int not null references devotionals(day),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index notes_user_id_idx on notes(user_id);
create index notes_devotional_day_idx on notes(devotional_day);

-- Criar função para atualizar o updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Criar trigger para atualizar updated_at
create trigger update_notes_updated_at
  before update on notes
  for each row
  execute function update_updated_at_column();

-- Configurar RLS (Row Level Security)
alter table notes enable row level security;

-- Criar políticas de segurança
create policy "Usuários podem ver suas próprias notas"
  on notes for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir suas próprias notas"
  on notes for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias notas"
  on notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias notas"
  on notes for delete
  using (auth.uid() = user_id);

-- Inserir devocionais iniciais
insert into devotionals (
  day,
  title,
  verse_text,
  verse_reference,
  verse_book,
  verse_chapter,
  verse_number,
  devotional_text,
  practical_text
) values
(347, 'Começando com Propósito',
  'Antes de formar você no ventre, eu o escolhi; antes de você nascer, eu o separei.',
  'Jeremias 1:5',
  'JR',
  '1',
  '5',
  'Deus criou você intencionalmente. Nada em sua vida é fruto do acaso. Antes mesmo de você nascer, Ele já havia planejado sua existência e dado a você dons e talentos únicos para cumprir um propósito.',
  'Reserve cinco minutos hoje para orar e perguntar a Deus: "Qual é o propósito que o Senhor tem para mim?"'
),
(348, 'O Poder da Gratidão',
  'Deem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus.',
  '1 Tessalonicenses 5:18',
  '1TS',
  '5',
  '18',
  'A gratidão tem o poder de transformar nossa perspectiva sobre a vida. Mesmo nos momentos difíceis, podemos encontrar razões para agradecer.',
  'Faça uma lista de 5 coisas pelas quais você é grato hoje.'
),
(349, 'Força na Fraqueza',
  'Minha graça é suficiente para você, pois o meu poder se aperfeiçoa na fraqueza.',
  '2 Coríntios 12:9',
  '2CO',
  '12',
  '9',
  'Nossas fraquezas não são obstáculos para Deus, mas oportunidades para Ele demonstrar Seu poder.',
  'Identifique uma área de fraqueza em sua vida e ore pedindo a Deus que demonstre Seu poder através dela.'
),
(350, 'Paz em Meio à Tempestade',
  'Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá.',
  'João 14:27',
  'JO',
  '14',
  '27',
  'A paz que Jesus oferece é diferente da paz do mundo. Ela não depende das circunstâncias externas.',
  'Dedique 10 minutos hoje para meditar neste versículo e pedir a Deus Sua paz sobrenatural.'
),
(351, 'Renovação Diária',
  'As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim.',
  'Lamentações 3:22-23',
  'LM',
  '3',
  '22-23',
  'Cada manhã é uma nova oportunidade de experimentar a misericórdia de Deus.',
  'Ao acordar amanhã, agradeça a Deus por três novas misericórdias que você vê em sua vida.'
);