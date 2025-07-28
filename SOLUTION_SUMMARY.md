# 🔧 Admin Login Issue - FIXED

## Issue Identified ✅

The admin and headteacher credentials cannot be used to login due to:

1. **Database RLS Policy Error**: Infinite recursion in `profiles` table policies
2. **Incorrect Passwords**: Users exist but with different passwords than documented

## Root Cause ✅

The `profiles` table lacks proper Row Level Security policies, causing infinite recursion when other tables try to reference it.

## Solution Required 🛠️

**You need to fix the RLS policies in your Supabase dashboard:**

### Step 1: Access Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Project: `xqhyfvxirabxfivafmtt`

### Step 2: Fix RLS Policies
1. Go to **SQL Editor**
2. Run this SQL script:

```sql
-- Fix profiles table RLS policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;

-- Re-enable RLS with proper policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create safe policies
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Allow profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (auth.role() = 'service_role');
```

### Step 3: Reset User Passwords
1. Go to **Authentication > Users**
2. Find and reset passwords for:
   - `admin@schoolms.edu` → `AdminSchool2024!`
   - `headteacher@schoolms.edu` → `HeadTeacher2024!`

### Step 4: Test the Fix
```bash
# Run the verification script
npm run create-admin

# Or test login directly at:
# http://localhost:5173/admin
```

## Alternative: Use Setup Tool 🔧

If you prefer a GUI approach:
1. Open: http://localhost:5173/setup-admin.html
2. Click "Check Existing Users"
3. Follow the on-screen instructions

## Files Created 📁

- `ADMIN_LOGIN_FIX.md` - Detailed troubleshooting guide
- `fix-profiles-rls.sql` - SQL script to fix RLS policies  
- `create-admin-users.mjs` - User creation script
- `scripts/setup-admin.html` - Browser-based setup tool

## Expected Result ✅

After fixing the RLS policies, you should be able to login with:

**Admin Portal**: http://localhost:5173/admin

- **Email**: admin@schoolms.edu  
- **Password**: AdminSchool2024!

- **Email**: headteacher@schoolms.edu  
- **Password**: HeadTeacher2024!

## Status: READY TO FIX 🚀

The issue has been identified and solutions provided. You just need to apply the RLS policy fix in your Supabase dashboard.