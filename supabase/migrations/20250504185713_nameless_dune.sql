/*
  # Adicionar tabela de contatos

  1. Nova Tabela
    - `contacts`
      - `id` (uuid, chave primária)
      - `name` (text, nome do contato)
      - `email` (text, email do contato)
      - `phone` (text, telefone do contato)
      - `message` (text, mensagem)
      - `created_at` (timestamptz, data de criação)

  2. Segurança
    - Habilitar RLS na tabela
    - Adicionar políticas para inserção anônima
    - Adicionar políticas para leitura autenticada
*/

-- Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow anonymous users to insert contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);