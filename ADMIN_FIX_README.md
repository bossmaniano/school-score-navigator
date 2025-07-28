# 🔧 Admin Login Fix

## Quick Summary

The admin credentials (`admin@schoolms.edu` / `AdminSchool2024!`) and headteacher credentials (`headteacher@schoolms.edu` / `HeadTeacher2024!`) are not working due to:

1. **Database RLS policy issues** - Infinite recursion in Row Level Security
2. **Missing user records** - Admin users don't exist in the database

## 🚀 Quick Fix Options

### Option 1: Manual Fix (Recommended - No setup required)

1. **Fix RLS Policies**: Run `fix-rls-policies.sql` in Supabase Dashboard
2. **Create Users**: Manually create admin users in Supabase Auth
3. **Create Profiles**: Add corresponding records to profiles table

📖 **Detailed Instructions**: See `ADMIN_LOGIN_SOLUTION.md`

### Option 2: Automated Script

```bash
# Get your service role key from Supabase dashboard
export SUPABASE_SERVICE_KEY="your_service_key_here"

# Run the fix script
npm run fix-admin-login
```

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt
- **SQL Editor**: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/sql
- **Auth Users**: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/auth/users
- **API Settings**: https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/settings/api

## 📋 Final Credentials

After fix is applied:

**Administrator**: `admin@schoolms.edu` / `AdminSchool2024!`  
**Head Teacher**: `headteacher@schoolms.edu` / `HeadTeacher2024!`  
**Login URL**: http://localhost:5173/admin

---

⚠️ **Change these default passwords after first login!**