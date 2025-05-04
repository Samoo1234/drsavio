/*
  # Adiciona tabela para informações de contato

  1. Nova Tabela
    - `contact_info`: Armazena informações de contato da clínica
      - `id` (serial, primary key)
      - `address` (text, endereço completo)
      - `phone1` (text, telefone principal)
      - `phone2` (text, telefone secundário)
      - `email` (text, email de contato)
      - `business_hours` (text, horário de funcionamento)
      - `saturday_hours` (text, horário de sábado)
      - `created_at` (timestamptz, data de criação)

  2. Segurança
    - Habilita RLS
    - Adiciona políticas para leitura pública e edição administrativa
*/

CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  phone1 TEXT NOT NULL,
  phone2 TEXT NOT NULL,
  email TEXT NOT NULL,
  business_hours TEXT NOT NULL,
  saturday_hours TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access to contact info"
  ON contact_info
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage contact info"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default data
INSERT INTO contact_info (
  address,
  phone1,
  phone2,
  email,
  business_hours,
  saturday_hours
) VALUES (
  'Av. Paulista, 1000, Sala 501
Bela Vista, São Paulo - SP',
  '(11) 3456-7890',
  '(11) 98765-4321',
  'contato@drsaviodocarmo.com.br',
  'Segunda a Sexta: 8h às 18h',
  'Sábado: 8h às 12h'
);