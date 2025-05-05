/*
  # Initial schema setup for Dr. Sávio do Carmo Ophthalmology Website

  1. New Tables
    - `services`: Stores ophthalmology services offered
      - `id` (serial, primary key)
      - `title` (text, service name)
      - `description` (text, service description)
      - `icon` (text, icon identifier)
      - `created_at` (timestamptz, creation timestamp)
    
    - `testimonials`: Stores patient testimonials
      - `id` (serial, primary key)
      - `name` (text, patient name)
      - `testimonial` (text, testimonial content)
      - `rating` (int, 1-5 star rating)
      - `avatar_url` (text, optional profile image URL)
      - `created_at` (timestamptz, creation timestamp)
    
    - `hero_content`: Stores hero banner content
      - `id` (serial, primary key)
      - `title` (text, hero title)
      - `subtitle` (text, hero subtitle)
      - `image_url` (text, background image URL)
      - `cta_text` (text, call-to-action button text)
      - `created_at` (timestamptz, creation timestamp)
    
    - `about`: Stores about section content
      - `id` (serial, primary key)
      - `title` (text, doctor name/title)
      - `content` (text, doctor bio)
      - `image_url` (text, doctor photo URL)
      - `created_at` (timestamptz, creation timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
*/

-- Create Services Table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Hero Content Table
CREATE TABLE IF NOT EXISTS hero_content (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create About Table
CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Create Policies for Services
CREATE POLICY "Allow authenticated users to read services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read services"
  ON services
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (true);

-- Create Policies for Testimonials
CREATE POLICY "Allow authenticated users to read testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read testimonials"
  ON testimonials
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Create Policies for Hero Content
CREATE POLICY "Allow authenticated users to read hero content"
  ON hero_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read hero content"
  ON hero_content
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to insert hero content"
  ON hero_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hero content"
  ON hero_content
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete hero content"
  ON hero_content
  FOR DELETE
  TO authenticated
  USING (true);

-- Create Policies for About
CREATE POLICY "Allow authenticated users to read about"
  ON about
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read about"
  ON about
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to insert about"
  ON about
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update about"
  ON about
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete about"
  ON about
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default data for Services
INSERT INTO services (title, description, icon, created_at)
VALUES 
  ('Exames de vista', 'Avaliação completa da saúde ocular e diagnóstico preciso utilizando equipamentos de última geração.', 'eye', NOW()),
  ('Tratamento de glaucoma', 'Acompanhamento especializado e tratamentos avançados para controle eficaz do glaucoma.', 'shield', NOW()),
  ('Cirurgia de catarata', 'Procedimentos cirúrgicos modernos com técnicas minimamente invasivas e rápida recuperação.', 'glasses', NOW()),
  ('Oftalmopediatria', 'Cuidados específicos para a saúde ocular de crianças em ambiente acolhedor e adaptado.', 'bar-chart', NOW());

-- Insert default data for Testimonials
INSERT INTO testimonials (name, testimonial, rating, avatar_url, created_at)
VALUES 
  ('Mariana Santos', 'Minha experiência com o Dr. Sávio foi excelente! Ele é muito atencioso, explica tudo detalhadamente e o tratamento que recebi para meu glaucoma está funcionando perfeitamente.', 5, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', NOW()),
  ('Carlos Oliveira', 'Realizei cirurgia de catarata com o Dr. Sávio e fiquei impressionado com a qualidade do atendimento e o resultado. Minha visão melhorou significativamente logo nos primeiros dias após o procedimento.', 5, 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', NOW()),
  ('Isabela Martins', 'Levo minha filha de 7 anos ao Dr. Sávio há 3 anos. Ele tem um jeito especial com crianças e consegue fazer os exames de forma tranquila. Recomendo a todos os pais!', 5, 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', NOW());

-- Insert default data for Hero Content
INSERT INTO hero_content (title, subtitle, image_url, cta_text, created_at)
VALUES 
  ('Cuidados oftalmológicos de excelência', 'Tratamentos modernos e atendimento humanizado para a saúde dos seus olhos', 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260', 'Agende sua consulta', NOW());

-- Insert default data for About
INSERT INTO about (title, content, image_url, created_at)
VALUES 
  ('Dr. Sávio do Carmo', 'Com mais de 15 anos de experiência na área de Oftalmologia, Dr. Sávio do Carmo é especialista em tratamentos avançados para diversas patologias oculares. Formado pela Universidade Federal do Rio de Janeiro (UFRJ), com residência no Hospital Oftalmológico de São Paulo e diversos cursos de especialização no Brasil e exterior.

O Dr. Sávio do Carmo possui vasta experiência em cirurgias de catarata, glaucoma e procedimentos refrativo. Seu compromisso é oferecer o melhor tratamento personalizado, combinando tecnologia de ponta com atendimento humanizado para garantir a saúde ocular e qualidade de vida de seus pacientes.', 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260', NOW());