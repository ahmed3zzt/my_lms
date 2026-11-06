-- ==============================================================================
-- Ahmed Ezz Personal Educational Platform - Database Schema
-- Compatible with Supabase PostgreSQL (100% Free Tier)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Single Admin / Author)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Ahmed Ezz',
    title TEXT NOT NULL DEFAULT 'Backend Software Engineer',
    bio TEXT NOT NULL DEFAULT 'Backend Software Engineer passionate about backend development, Linux, databases, distributed systems, clean architecture, and teaching programming through practical examples.',
    avatar_url TEXT,
    github_url TEXT DEFAULT 'https://github.com',
    linkedin_url TEXT DEFAULT 'https://linkedin.com',
    portfolio_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- ------------------------------------------------------------------------------
-- 3. Courses Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);

-- ------------------------------------------------------------------------------
-- 4. Lessons Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content_markdown TEXT NOT NULL DEFAULT '',
    cover_image_url TEXT,
    youtube_url TEXT,
    github_repo_url TEXT,
    reading_time_minutes INT NOT NULL DEFAULT 5,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON public.lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON public.lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_sort ON public.lessons(course_id, sort_order);

-- ------------------------------------------------------------------------------
-- 5. Tags Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);

-- ------------------------------------------------------------------------------
-- 6. Lesson Tags (Many-to-Many)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_tags (
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (lesson_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_tags_tag ON public.lesson_tags(tag_id);

-- ------------------------------------------------------------------------------
-- 7. Attachments Table (Downloadable files, PDFs, ZIPs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'application/octet-stream',
    file_size BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_attachments_lesson_id ON public.attachments(lesson_id);

-- ------------------------------------------------------------------------------
-- 8. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view, Admin can update
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Admin can update profile."
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Public can view, Admin full access
CREATE POLICY "Categories viewable by everyone"
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories"
    ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Courses: Public can view published, Admin full access
CREATE POLICY "Public can view published courses"
    ON public.courses FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin can manage courses"
    ON public.courses FOR ALL USING (auth.role() = 'authenticated');

-- Lessons: Public can view published in published courses, Admin full access
CREATE POLICY "Public can view published lessons"
    ON public.lessons FOR SELECT USING (
        is_published = true OR auth.role() = 'authenticated'
    );

CREATE POLICY "Admin can manage lessons"
    ON public.lessons FOR ALL USING (auth.role() = 'authenticated');

-- Tags: Public can view, Admin can manage
CREATE POLICY "Tags viewable by everyone"
    ON public.tags FOR SELECT USING (true);

CREATE POLICY "Admin can manage tags"
    ON public.tags FOR ALL USING (auth.role() = 'authenticated');

-- Lesson Tags: Public can view, Admin can manage
CREATE POLICY "Lesson tags viewable by everyone"
    ON public.lesson_tags FOR SELECT USING (true);

CREATE POLICY "Admin can manage lesson tags"
    ON public.lesson_tags FOR ALL USING (auth.role() = 'authenticated');

-- Attachments: Public can view for published lessons, Admin can manage
CREATE POLICY "Attachments viewable by everyone for published lessons"
    ON public.attachments FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lessons
            WHERE lessons.id = attachments.lesson_id AND (lessons.is_published = true OR auth.role() = 'authenticated')
        )
    );

CREATE POLICY "Admin can manage attachments"
    ON public.attachments FOR ALL USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 9. Storage Buckets Setup (Supabase Storage)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('lesson-images', 'lesson-images', true),
    ('lesson-files', 'lesson-files', true),
    ('course-covers', 'course-covers', true),
    ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Public read, Authenticated admin write
CREATE POLICY "Public Access to lesson-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'lesson-images');

CREATE POLICY "Admin Upload to lesson-images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'lesson-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access to lesson-files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'lesson-files');

CREATE POLICY "Admin Upload to lesson-files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'lesson-files' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access to course-covers"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'course-covers');

CREATE POLICY "Admin Upload to course-covers"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'course-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access to profile-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-images');

CREATE POLICY "Admin Upload to profile-images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
