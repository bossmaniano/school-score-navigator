-- Fix profiles table RLS policies
-- The issue is that other tables reference profiles but profiles itself has no policies

-- First, disable RLS on profiles temporarily to break the recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies on profiles (if any)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create safe policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

-- Allow inserting profiles (needed for user registration)
CREATE POLICY "Allow profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Administrators can view all profiles in their school
CREATE POLICY "Admins can view school profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles admin_profile 
    WHERE admin_profile.user_id = auth.uid() 
    AND admin_profile.role = 'administrator'::user_role
    AND (admin_profile.school_id = profiles.school_id OR admin_profile.school_id IS NULL)
  )
);

-- Allow service role to manage all profiles (for admin scripts)
CREATE POLICY "Service role can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (auth.role() = 'service_role');

-- Allow authenticated users to insert profiles (for registration)
CREATE POLICY "Authenticated users can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');