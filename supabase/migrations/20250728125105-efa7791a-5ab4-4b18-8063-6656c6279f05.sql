-- Fix database function security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    NEW.email,
    'student'::user_role
  );
  RETURN NEW;
END;
$$;

-- Add missing RLS policies for assessments table
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view assessments" 
ON public.assessments 
FOR SELECT 
USING (school_id IN (
  SELECT profiles.school_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid()
));

CREATE POLICY "Teachers and admins can manage assessments" 
ON public.assessments 
FOR ALL 
USING (school_id IN (
  SELECT profiles.school_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['administrator'::user_role, 'head_teacher'::user_role, 'class_teacher'::user_role, 'subject_teacher'::user_role])
));

-- Add missing RLS policies for grades table
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own grades" 
ON public.grades 
FOR SELECT 
USING (student_id IN (
  SELECT students.id 
  FROM students 
  JOIN profiles ON students.profile_id = profiles.id 
  WHERE profiles.user_id = auth.uid()
));

CREATE POLICY "Teachers can view grades in their school" 
ON public.grades 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM students 
  JOIN classes ON students.class_id = classes.id 
  JOIN profiles ON profiles.school_id = classes.school_id 
  WHERE students.id = grades.student_id 
  AND profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['administrator'::user_role, 'head_teacher'::user_role, 'class_teacher'::user_role, 'subject_teacher'::user_role])
));

CREATE POLICY "Teachers can manage grades" 
ON public.grades 
FOR ALL 
USING (EXISTS (
  SELECT 1 
  FROM students 
  JOIN classes ON students.class_id = classes.id 
  JOIN profiles ON profiles.school_id = classes.school_id 
  WHERE students.id = grades.student_id 
  AND profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['administrator'::user_role, 'head_teacher'::user_role, 'class_teacher'::user_role, 'subject_teacher'::user_role])
));

-- Add missing RLS policies for comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Class members can view comments" 
ON public.comments 
FOR SELECT 
USING (class_id IN (
  SELECT students.class_id 
  FROM students 
  JOIN profiles ON students.profile_id = profiles.id 
  WHERE profiles.user_id = auth.uid()
) OR class_id IN (
  SELECT classes.id 
  FROM classes 
  JOIN profiles ON profiles.school_id = classes.school_id 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['administrator'::user_role, 'head_teacher'::user_role, 'class_teacher'::user_role, 'subject_teacher'::user_role])
));

CREATE POLICY "Users can create comments in their class" 
ON public.comments 
FOR INSERT 
WITH CHECK (class_id IN (
  SELECT students.class_id 
  FROM students 
  JOIN profiles ON students.profile_id = profiles.id 
  WHERE profiles.user_id = auth.uid()
) OR class_id IN (
  SELECT classes.id 
  FROM classes 
  JOIN profiles ON profiles.school_id = classes.school_id 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['administrator'::user_role, 'head_teacher'::user_role, 'class_teacher'::user_role, 'subject_teacher'::user_role])
) AND author_id = auth.uid());

CREATE POLICY "Teachers can manage comments" 
ON public.comments 
FOR ALL 
USING (class_id IN (
  SELECT classes.id 
  FROM classes 
  JOIN profiles ON profiles.school_id = classes.school_id 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['administrator'::user_role, 'head_teacher'::user_role, 'class_teacher'::user_role])
));

-- Add missing RLS policies for subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view subjects" 
ON public.subjects 
FOR SELECT 
USING (school_id IN (
  SELECT profiles.school_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid()
));

CREATE POLICY "Administrators can manage subjects" 
ON public.subjects 
FOR ALL 
USING (school_id IN (
  SELECT profiles.school_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['administrator'::user_role, 'head_teacher'::user_role])
));