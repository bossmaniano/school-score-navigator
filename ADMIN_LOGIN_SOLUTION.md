# 🔧 Admin Login Solution Guide

## Problem Summary

The admin and headteacher credentials cannot be used to login due to two main issues:

1. **RLS Policy Infinite Recursion**: The `profiles` table has Row Level Security policies that reference itself, causing authentication failures
2. **Missing Admin Users**: The admin users don't exist in both Supabase Auth and the profiles table

## 🚀 Quick Fix (Recommended)

### Step 1: Fix RLS Policies in Supabase Dashboard

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/sql

2. **Copy and run the RLS fix script**:
   ```sql
   -- Fix profiles table RLS policies to prevent infinite recursion
   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
   
   -- Drop all existing policies on profiles table
   DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
   DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
   DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
   DROP POLICY IF EXISTS "Admins can view school profiles" ON public.profiles;
   DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
   DROP POLICY IF EXISTS "Authenticated users can create profiles" ON public.profiles;
   
   -- Re-enable RLS with safe policies
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   
   -- Users can view their own profile
   CREATE POLICY "Users can view own profile" 
   ON public.profiles FOR SELECT 
   USING (user_id = auth.uid());
   
   -- Users can update their own profile
   CREATE POLICY "Users can update own profile" 
   ON public.profiles FOR UPDATE 
   USING (user_id = auth.uid());
   
   -- Allow profile creation during user registration
   CREATE POLICY "Allow profile creation" 
   ON public.profiles FOR INSERT 
   WITH CHECK (user_id = auth.uid());
   
   -- Allow service role to manage all profiles
   CREATE POLICY "Service role can manage all profiles" 
   ON public.profiles FOR ALL 
   USING (auth.role() = 'service_role');
   
   -- Allow authenticated users to create profiles
   CREATE POLICY "Authenticated users can create profiles" 
   ON public.profiles FOR INSERT 
   WITH CHECK (auth.role() = 'authenticated');
   ```

### Step 2: Create Admin Users Manually

1. **Go to Authentication > Users**:
   - Navigate to: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/auth/users

2. **Delete existing problematic users** (if any):
   - Look for `admin@schoolms.edu` and `headteacher@schoolms.edu`
   - Delete them if they exist

3. **Create Administrator User**:
   - Click "Add User"
   - Email: `admin@schoolms.edu`
   - Password: `AdminSchool2024!`
   - ✅ Check "Auto Confirm User"
   - Click "Create User"

4. **Create Head Teacher User**:
   - Click "Add User"
   - Email: `headteacher@schoolms.edu`
   - Password: `HeadTeacher2024!`
   - ✅ Check "Auto Confirm User"
   - Click "Create User"

### Step 3: Create Profiles for Admin Users

1. **Go to Table Editor > profiles**:
   - Navigate to: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/editor

2. **Insert Administrator Profile**:
   - Click "Insert" > "Insert row"
   - Copy the `user_id` from the admin user you just created in Authentication > Users
   - Fill in:
     ```
     user_id: [paste the UUID from auth.users]
     email: admin@schoolms.edu
     full_name: System Administrator
     role: administrator
     ```
   - Click "Save"

3. **Insert Head Teacher Profile**:
   - Click "Insert" > "Insert row"
   - Copy the `user_id` from the headteacher user you created
   - Fill in:
     ```
     user_id: [paste the UUID from auth.users]
     email: headteacher@schoolms.edu
     full_name: Head Teacher
     role: head_teacher
     ```
   - Click "Save"

## 🤖 Alternative: Automated Fix Script

If you prefer to use the automated script:

### Step 1: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/settings/api
2. Copy the "service_role" key (starts with `eyJ...`)

### Step 2: Run the Fix Script

```bash
# Set the service role key as environment variable
export SUPABASE_SERVICE_KEY="your_service_role_key_here"

# Install dependencies if needed
npm install @supabase/supabase-js

# Run the fix script
node fix-admin-login.js
```

## 🧪 Testing the Fix

After applying either solution:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test admin login**:
   - Go to: http://localhost:5173/admin
   - Use credentials:
     - **Email**: `admin@schoolms.edu`
     - **Password**: `AdminSchool2024!`

3. **Test head teacher login**:
   - Use credentials:
     - **Email**: `headteacher@schoolms.edu`
     - **Password**: `HeadTeacher2024!`

## 📋 Final Credentials

After the fix is complete, you can use these credentials:

### 👤 Administrator Account
```
Email: admin@schoolms.edu
Password: AdminSchool2024!
Role: administrator
Access: Full system control
Portal: /admin
```

### 👤 Head Teacher Account
```
Email: headteacher@schoolms.edu
Password: HeadTeacher2024!
Role: head_teacher
Access: School-level administration
Portal: /admin
```

## 🔐 Security Notes

⚠️ **IMPORTANT**: 
- These are default credentials for initial setup
- **Change passwords immediately after first login**
- Use strong, unique passwords in production
- Monitor login attempts and access logs
- The service role key provides full database access - keep it secure

## 🔍 Troubleshooting

### If login still fails:

1. **Check browser console** for error messages
2. **Verify RLS policies** were applied correctly:
   ```sql
   SELECT policyname, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'profiles';
   ```
3. **Check user exists** in both auth.users and profiles tables
4. **Verify profile role** matches expected value (`administrator` or `head_teacher`)

### Common Issues:

- **"User not found"**: User doesn't exist in auth.users table
- **"Profile not found"**: User exists in auth but not in profiles table
- **"Access denied"**: User exists but role is incorrect
- **"Infinite recursion"**: RLS policies still have circular references

## 📞 Support

If you continue to have issues:

1. Check the Supabase project logs for detailed error messages
2. Verify all migrations have been applied
3. Ensure the database connection is working
4. Contact technical support with specific error messages

---

**Last Updated**: Current session  
**Priority**: High - Critical for admin access  
**Status**: ✅ Ready to implement