/*
  # Adiciona tabela para estatísticas do médico

  1. Nova Tabela
    - `stats`: Armazena números e estatísticas do médico
      - `id` (serial, primary key)
      - `title` (text, título da estatística)
      - `value` (text, valor numérico com sufixo)
      - `created_at` (timestamptz, data de criação)

  2. Segurança
    - Habilita RLS
    - Adiciona políticas para leitura pública e edição administrativa
*/

CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access to stats"
  ON stats
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage stats"
  ON stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default data
INSERT INTO stats (title, value) VALUES 
  ('Anos de experiência', '15+'),
  ('Pacientes atendidos', '5000+'),
  ('Cirurgias realizadas', '3000+');