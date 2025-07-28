# 🔧 Admin Login Fix Guide

## Problem Summary

The admin and headteacher credentials documented in `ADMIN_CREDENTIALS.md` cannot be used to login because:

1. **RLS Policy Issue**: The `profiles` table has infinite recursion in its Row Level Security policies
2. **Missing Users**: The admin users exist in Supabase Auth but with incorrect/different passwords
3. **Profile Creation**: The database trigger to create profiles may be failing due to RLS issues

## 🚨 Root Cause

The main issue is in the database migration file `supabase/migrations/20250728125105-efa7791a-5ab4-4b18-8063-6656c6279f05.sql`:

- Other tables reference `profiles` in their RLS policies
- But `profiles` table itself has no RLS policies defined
- This creates infinite recursion when trying to access profiles

## 🛠️ Solutions (Choose One)

### Solution 1: Fix RLS Policies in Supabase Dashboard (Recommended)

1. **Access Supabase Dashboard**:
   - Go to https://supabase.com/dashboard
   - Navigate to your project: `xqhyfvxirabxfivafmtt`

2. **Open SQL Editor**:
   - Go to SQL Editor in the left sidebar
   - Create a new query

3. **Run the Fix Script**:
   ```sql
   -- Fix profiles table RLS policies
   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
   
   -- Drop any existing policies
   DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
   DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
   DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
   
   -- Re-enable RLS with proper policies
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
   
   -- Allow profile creation during registration
   CREATE POLICY "Allow profile creation" 
   ON public.profiles 
   FOR INSERT 
   WITH CHECK (user_id = auth.uid());
   
   -- Allow service role to manage all profiles
   CREATE POLICY "Service role can manage all profiles" 
   ON public.profiles 
   FOR ALL 
   USING (auth.role() = 'service_role');
   ```

4. **Reset User Passwords**:
   - Go to Authentication > Users in Supabase dashboard
   - Find `admin@schoolms.edu` and `headteacher@schoolms.edu`
   - Click on each user and reset their password to:
     - `admin@schoolms.edu`: `AdminSchool2024!`
     - `headteacher@schoolms.edu`: `HeadTeacher2024!`

### Solution 2: Use the Admin Setup HTML Tool

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the setup tool**:
   - Navigate to: http://localhost:5173/setup-admin.html
   - Click "Check Existing Users" to verify current status
   - Click "Create Admin Users" to attempt automatic creation

### Solution 3: Manual User Creation in Supabase Dashboard

1. **Delete existing problematic users**:
   - Go to Authentication > Users
   - Delete `admin@schoolms.edu` and `headteacher@schoolms.edu` if they exist

2. **Create new users**:
   - Click "Add User"
   - Email: `admin@schoolms.edu`
   - Password: `AdminSchool2024!`
   - Auto Confirm User: ✅
   - Repeat for headteacher

3. **Manually create profiles**:
   - Go to Table Editor > profiles
   - Insert new rows:
     ```
     user_id: [copy from auth.users table]
     email: admin@schoolms.edu
     full_name: System Administrator
     role: administrator
     ```

## 🔍 Verification Steps

After applying any solution:

1. **Test the login**:
   ```bash
   npm run create-admin
   ```

2. **Try logging in**:
   - Go to http://localhost:5173/admin
   - Use credentials:
     - Email: `admin@schoolms.edu`
     - Password: `AdminSchool2024!`

3. **Check profile creation**:
   - After successful login, verify the user has the correct role
   - Check that admin dashboard loads properly

## 📋 Current Status

✅ **Working**: Supabase connection and auth system  
❌ **Broken**: RLS policies causing infinite recursion  
❌ **Broken**: Admin user passwords don't match documentation  
⚠️ **Partial**: Users exist but credentials are wrong  

## 🔐 Credentials (After Fix)

**Administrator Account:**
- Email: `admin@schoolms.edu`
- Password: `AdminSchool2024!`
- Role: `administrator`

**Head Teacher Account:**
- Email: `headteacher@schoolms.edu`
- Password: `HeadTeacher2024!`
- Role: `head_teacher`

## 🚀 Quick Fix Command

If you have Supabase CLI access:

```bash
# Apply the RLS fix
supabase db reset
# Or run the fix script directly
psql -f fix-profiles-rls.sql
```

## 📞 Support

If none of these solutions work:

1. Check the Supabase project logs for detailed error messages
2. Verify the database connection is working
3. Ensure all migrations have been applied
4. Contact the development team with specific error messages

---

**Last Updated**: Current session  
**Priority**: High - Blocks admin access to the system