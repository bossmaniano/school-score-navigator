-- Fix profiles table RLS policies to prevent infinite recursion
-- Run this script in your Supabase SQL editor: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/sql

-- Step 1: Disable RLS temporarily to break any infinite recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view school profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Step 3: Re-enable RLS with safe policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create safe RLS policies that don't cause infinite recursion

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

-- Allow profile creation during user registration
CREATE POLICY "Allow profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow service role to manage all profiles (needed for admin scripts)
CREATE POLICY "Service role can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (auth.role() = 'service_role');

-- Allow authenticated users to create profiles (for registration flow)
CREATE POLICY "Authenticated users can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Verify the policies are created correctly
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles' 
ORDER BY policyname;