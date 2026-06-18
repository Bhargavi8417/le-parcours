-- ============================================================
-- France Student Relocation Hub — Full Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE service_stage AS ENUM ('pre_arrival', 'post_arrival', 'settlement', 'miscellaneous');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE journey_stage AS ENUM ('application', 'campus_france', 'visa', 'arrival', 'settlement');
CREATE TYPE stage_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE inquiry_status AS ENUM ('new', 'read', 'replied');
CREATE TYPE accommodation_type AS ENUM ('studio', 'shared_room', 'apartment', 'residence', 'homestay');

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (mirrors auth.users)
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  role         user_role NOT NULL DEFAULT 'student',
  phone        TEXT,
  nationality  TEXT,
  university   TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  title_fr         TEXT NOT NULL,
  description      TEXT NOT NULL,
  description_fr   TEXT NOT NULL,
  stage            service_stage NOT NULL,
  category         TEXT NOT NULL,
  price            NUMERIC,
  duration_minutes INTEGER,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id      UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  status          booking_status NOT NULL DEFAULT 'pending',
  scheduled_at    TIMESTAMPTZ,
  notes           TEXT,
  admin_notes     TEXT,
  flight_number   TEXT,
  pickup_location TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Journey progress (one row per student)
CREATE TABLE journey_progress (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_stage         journey_stage NOT NULL DEFAULT 'application',
  application_status    stage_status NOT NULL DEFAULT 'not_started',
  campus_france_status  stage_status NOT NULL DEFAULT 'not_started',
  visa_status           stage_status NOT NULL DEFAULT 'not_started',
  arrival_status        stage_status NOT NULL DEFAULT 'not_started',
  settlement_status     stage_status NOT NULL DEFAULT 'not_started',
  stage_notes           JSONB,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Document checklist templates (predefined per stage)
CREATE TABLE document_templates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage       journey_stage NOT NULL,
  name        TEXT NOT NULL,
  name_fr     TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Student document state (per student, per template)
CREATE TABLE student_documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  file_url    TEXT,
  file_name   TEXT,
  uploaded_at TIMESTAMPTZ,
  UNIQUE(student_id, template_id)
);

-- Inquiries / contact form
CREATE TABLE inquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      inquiry_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge base articles
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  title_fr        TEXT NOT NULL,
  content         TEXT NOT NULL,
  content_fr      TEXT NOT NULL,
  stage           service_stage,
  category        TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  cover_image_url TEXT,
  author_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodation locations
CREATE TABLE locations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  name_fr        TEXT NOT NULL,
  description    TEXT,
  description_fr TEXT,
  city           TEXT NOT NULL DEFAULT 'Paris',
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodations
CREATE TABLE accommodations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id     UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  title_fr        TEXT,
  description     TEXT,
  description_fr  TEXT,
  type            accommodation_type NOT NULL,
  price_per_month NUMERIC,
  is_available    BOOLEAN NOT NULL DEFAULT TRUE,
  available_from  DATE,
  address         TEXT,
  amenities       TEXT[],
  cover_image_url TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodation photo gallery
CREATE TABLE accommodation_images (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  image_url        TEXT NOT NULL,
  caption          TEXT,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodation inquiries
CREATE TABLE accommodation_inquiries (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  student_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  message          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS — auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_journey_progress_updated_at
  BEFORE UPDATE ON journey_progress FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_accommodations_updated_at
  BEFORE UPDATE ON accommodations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- TRIGGER — auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER — auto-create journey_progress on profile creation
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO journey_progress (student_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile();

-- ============================================================
-- HELPER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE services              ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries             ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_inquiries ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Own profile readable" ON profiles FOR SELECT USING (auth.uid() = id OR get_user_role() = 'admin');
CREATE POLICY "Own profile writable" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (get_user_role() = 'admin');

-- services (public read, admin write)
CREATE POLICY "Active services public" ON services FOR SELECT USING (is_active = TRUE OR get_user_role() = 'admin');
CREATE POLICY "Admin manages services" ON services FOR ALL USING (get_user_role() = 'admin');

-- bookings
CREATE POLICY "Students see own bookings" ON bookings FOR SELECT USING (student_id = auth.uid() OR get_user_role() = 'admin');
CREATE POLICY "Students create bookings" ON bookings FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students update own bookings" ON bookings FOR UPDATE USING (student_id = auth.uid() AND get_user_role() != 'admin');
CREATE POLICY "Admin manages bookings" ON bookings FOR ALL USING (get_user_role() = 'admin');

-- journey_progress
CREATE POLICY "Students see own journey" ON journey_progress FOR SELECT USING (student_id = auth.uid() OR get_user_role() = 'admin');
CREATE POLICY "Admin manages journey" ON journey_progress FOR ALL USING (get_user_role() = 'admin');

-- document_templates (public read)
CREATE POLICY "Templates public read" ON document_templates FOR SELECT USING (TRUE);
CREATE POLICY "Admin manages templates" ON document_templates FOR ALL USING (get_user_role() = 'admin');

-- student_documents
CREATE POLICY "Students see own docs" ON student_documents FOR SELECT USING (student_id = auth.uid() OR get_user_role() = 'admin');
CREATE POLICY "Students manage own docs" ON student_documents FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Admin manages docs" ON student_documents FOR ALL USING (get_user_role() = 'admin');

-- inquiries
CREATE POLICY "Students see own inquiries" ON inquiries FOR SELECT USING (student_id = auth.uid() OR get_user_role() = 'admin');
CREATE POLICY "Anyone can submit inquiry" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin manages inquiries" ON inquiries FOR ALL USING (get_user_role() = 'admin');

-- articles (published public, admin all)
CREATE POLICY "Published articles public" ON articles FOR SELECT USING (is_published = TRUE OR get_user_role() = 'admin');
CREATE POLICY "Admin manages articles" ON articles FOR ALL USING (get_user_role() = 'admin');

-- locations (active public, admin all)
CREATE POLICY "Active locations public" ON locations FOR SELECT USING (is_active = TRUE OR get_user_role() = 'admin');
CREATE POLICY "Admin manages locations" ON locations FOR ALL USING (get_user_role() = 'admin');

-- accommodations (available public, admin all)
CREATE POLICY "Accommodations public read" ON accommodations FOR SELECT USING (TRUE);
CREATE POLICY "Admin manages accommodations" ON accommodations FOR ALL USING (get_user_role() = 'admin');

-- accommodation_images (public read, admin write)
CREATE POLICY "Accommodation images public" ON accommodation_images FOR SELECT USING (TRUE);
CREATE POLICY "Admin manages images" ON accommodation_images FOR ALL USING (get_user_role() = 'admin');

-- accommodation_inquiries
CREATE POLICY "Anyone can submit accom inquiry" ON accommodation_inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin sees all accom inquiries" ON accommodation_inquiries FOR SELECT USING (get_user_role() = 'admin');
CREATE POLICY "Students see own accom inquiries" ON accommodation_inquiries FOR SELECT USING (student_id = auth.uid());

-- ============================================================
-- STORAGE BUCKETS (run separately in Supabase dashboard or via API)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('accommodations', 'accommodations', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- ============================================================
-- SEED DATA — Document Templates
-- ============================================================
INSERT INTO document_templates (stage, name, name_fr, description, is_required, sort_order) VALUES
  -- Application stage
  ('application', 'Valid Passport', 'Passeport valide', 'Must be valid for at least 6 months beyond your intended stay', TRUE, 1),
  ('application', 'Academic Transcripts', 'Relevés de notes', 'Official transcripts from previous institutions', TRUE, 2),
  ('application', 'Diplomas / Certificates', 'Diplômes / Certificats', 'Certified copies of your degrees', TRUE, 3),
  ('application', 'Statement of Purpose', 'Lettre de motivation', 'In French or English as required by the institution', TRUE, 4),
  ('application', 'Language Proficiency Certificate', 'Attestation de niveau de langue', 'DELF/DALF for French, IELTS/TOEFL for English-taught programs', FALSE, 5),
  -- Campus France stage
  ('campus_france', 'Campus France Account', 'Compte Campus France', 'Create account on campusfrance.org', TRUE, 1),
  ('campus_france', 'Campus France Application Form', 'Formulaire de demande Campus France', 'Complete the online application form', TRUE, 2),
  ('campus_france', 'Campus France Interview Confirmation', 'Confirmation entretien Campus France', 'Appointment letter from Campus France', TRUE, 3),
  ('campus_france', 'Proof of Accepted University Offer', 'Preuve d''acceptation universitaire', 'Official acceptance letter from French institution', TRUE, 4),
  -- Visa stage
  ('visa', 'Visa Application Form', 'Formulaire de demande de visa', 'Long-stay student visa (VLS-TS) application', TRUE, 1),
  ('visa', 'VFS Appointment Confirmation', 'Confirmation de rendez-vous VFS', 'Appointment letter for visa drop-off', TRUE, 2),
  ('visa', 'Proof of Accommodation in France', 'Justificatif de logement en France', 'University residence or rental agreement', TRUE, 3),
  ('visa', 'Proof of Financial Resources', 'Justificatif de ressources financières', 'Bank statements showing sufficient funds', TRUE, 4),
  ('visa', 'Travel Insurance', 'Assurance voyage', 'Covering the duration of your stay', TRUE, 5),
  ('visa', 'Passport Photos', 'Photos d''identité', '2 recent biometric photos', TRUE, 6),
  -- Arrival stage
  ('arrival', 'OFII Validation', 'Validation OFII', 'Validate your visa online at ofii.fr within 3 months of arrival', TRUE, 1),
  ('arrival', 'University Enrollment Certificate', 'Certificat de scolarité', 'Official enrollment certificate from your university', TRUE, 2),
  ('arrival', 'French Address Proof', 'Justificatif de domicile français', 'Utility bill or rental contract in France', TRUE, 3),
  -- Settlement stage
  ('settlement', 'CAF Application', 'Demande CAF', 'Housing aid application (Aide au Logement)', FALSE, 1),
  ('settlement', 'French Bank Account', 'Compte bancaire français', 'Open a local bank account', TRUE, 2),
  ('settlement', 'Carte Vitale Application', 'Demande de Carte Vitale', 'Register with Ameli for health insurance', TRUE, 3),
  ('settlement', 'Navigo Pass', 'Carte Navigo', 'Paris public transport card', FALSE, 4),
  ('settlement', 'French SIM Card', 'Carte SIM française', 'Mobile phone subscription', FALSE, 5);

-- ============================================================
-- SEED DATA — Services
-- ============================================================
INSERT INTO services (title, title_fr, description, description_fr, stage, category, price, duration_minutes, sort_order) VALUES
  ('University Application Support', 'Aide à la candidature universitaire', 'Guidance through the French university application process, including institution selection, document preparation, and submission.', 'Accompagnement dans le processus de candidature aux universités françaises, incluant la sélection d''établissements, la préparation des documents et la soumission.', 'pre_arrival', 'University Application', 150, 120, 1),
  ('Campus France Guidance', 'Accompagnement Campus France', 'Step-by-step assistance with your Campus France account setup, application form, and interview preparation.', 'Assistance étape par étape pour la création de votre compte Campus France, le formulaire de candidature et la préparation à l''entretien.', 'pre_arrival', 'Campus France', 100, 90, 2),
  ('Visa Support & VFS Appointment', 'Aide visa & rendez-vous VFS', 'Complete visa application preparation including document checklist, VFS appointment guidance, and submission support.', 'Préparation complète de la demande de visa incluant la liste des documents, l''accompagnement pour le rendez-vous VFS et le soutien à la soumission.', 'pre_arrival', 'Visa Support', 120, 90, 3),
  ('Airport Pickup', 'Transfert aéroport', 'Private airport pickup service on your arrival day. We meet you at the terminal and transport you safely to your accommodation.', 'Service de transfert aéroport privé le jour de votre arrivée. Nous vous accueillons au terminal et vous transportons en toute sécurité jusqu''à votre hébergement.', 'post_arrival', 'Airport Transfer', 80, 180, 4),
  ('Arrival Documentation Guidance', 'Guide des démarches à l''arrivée', 'Help navigating your first administrative steps in France: OFII validation, university enrollment, and residence registration.', 'Aide pour vos premières démarches administratives en France: validation OFII, inscription universitaire et enregistrement de domicile.', 'post_arrival', 'Documentation', 75, 60, 5),
  ('City Orientation Tour', 'Visite d''orientation de la ville', 'A guided tour of your neighbourhood and key student areas: campus, metro lines, supermarkets, pharmacies, and student services.', 'Une visite guidée de votre quartier et des zones étudiantes clés: campus, lignes de métro, supermarchés, pharmacies et services étudiants.', 'post_arrival', 'City Guide', 60, 120, 6),
  ('Navigo Pass Setup', 'Obtention de la carte Navigo', 'Assistance obtaining and setting up your Navigo transit card, including student discount application.', 'Assistance pour obtenir et configurer votre carte Navigo, y compris la demande de réduction étudiant.', 'settlement', 'Transportation', 30, 30, 7),
  ('Carte Vitale Registration', 'Inscription Carte Vitale', 'Support registering with the French health system (Ameli) and obtaining your Carte Vitale health insurance card.', 'Soutien pour vous inscrire au système de santé français (Ameli) et obtenir votre carte Vitale.', 'settlement', 'Healthcare', 40, 45, 8),
  ('Bank Account Opening', 'Ouverture de compte bancaire', 'Guidance and accompaniment to open a French bank account, including document preparation and branch visit.', 'Accompagnement pour ouvrir un compte bancaire français, incluant la préparation des documents et la visite en agence.', 'settlement', 'Banking', 50, 60, 9),
  ('SIM Card & Mobile Plan', 'Carte SIM & forfait mobile', 'Help choosing and activating the best mobile plan for international students in France.', 'Aide pour choisir et activer le meilleur forfait mobile pour les étudiants internationaux en France.', 'settlement', 'Mobile', 20, 30, 10),
  ('Accommodation Search', 'Recherche de logement', 'Personalised accommodation search assistance including platform guidance, application writing, and landlord communication.', 'Aide personnalisée à la recherche de logement incluant l''orientation sur les plateformes, la rédaction de candidatures et la communication avec les propriétaires.', 'settlement', 'Housing', 100, 90, 11),
  ('One-Off Consultation', 'Consultation ponctuelle', 'A flexible 1-hour consultation for any question or task not covered by our standard services.', 'Une consultation flexible d''une heure pour toute question ou tâche non couverte par nos services standard.', 'miscellaneous', 'Consultation', 60, 60, 12);

-- ============================================================
-- SEED DATA — Locations
-- ============================================================
INSERT INTO locations (name, name_fr, description, description_fr, city, sort_order) VALUES
  ('Latin Quarter (5th)', 'Quartier Latin (5e)', 'The heart of student Paris — surrounded by top universities, bookshops, and cafés. Close to Sorbonne and UPMC.', 'Le cœur du Paris étudiant — entouré des meilleures universités, librairies et cafés. Proche de la Sorbonne et de l''UPMC.', 'Paris', 1),
  ('Montparnasse (14th)', 'Montparnasse (14e)', 'Well-connected neighbourhood with excellent metro and RER links. Affordable and popular with international students.', 'Quartier bien desservi avec d''excellentes liaisons métro et RER. Abordable et populaire auprès des étudiants internationaux.', 'Paris', 2),
  ('Belleville / Ménilmontant (20th)', 'Belleville / Ménilmontant (20e)', 'Vibrant, multicultural district with a creative atmosphere and very affordable rents.', 'Quartier vibrant et multiculturel avec une atmosphère créative et des loyers très abordables.', 'Paris', 3),
  ('Cité Internationale Universitaire', 'Cité Internationale Universitaire', 'Dedicated student campus in the 14th with residences from over 40 countries. Great community for international students.', 'Campus étudiant dédié dans le 14e avec des résidences de plus de 40 pays. Excellente communauté pour les étudiants internationaux.', 'Paris', 4),
  ('Saint-Denis / La Plaine', 'Saint-Denis / La Plaine', 'Just north of Paris, affordable and well connected by metro line 13 and RER D. Close to Paris 8 and Paris 13.', 'Juste au nord de Paris, abordable et bien desservi par le métro ligne 13 et le RER D. Proche de Paris 8 et Paris 13.', 'Paris', 5);

-- ============================================================
-- TO PROMOTE A USER TO ADMIN — run this after the user signs up:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
-- ============================================================
