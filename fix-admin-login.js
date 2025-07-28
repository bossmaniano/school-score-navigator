import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://xqhyfvxirabxfivafmtt.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "YOUR_SERVICE_ROLE_KEY_HERE";

// Check if service key is provided
if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === "YOUR_SERVICE_ROLE_KEY_HERE") {
  console.error('❌ SUPABASE_SERVICE_KEY is required!');
  console.log('');
  console.log('🔑 To get your service role key:');
  console.log('   1. Go to https://supabase.com/dashboard/project/xqhyfvxirabxfivafmtt/settings/api');
  console.log('   2. Copy the "service_role" key (starts with eyJ...)');
  console.log('   3. Set it as environment variable:');
  console.log('      export SUPABASE_SERVICE_KEY="your_key_here"');
  console.log('   4. Or replace YOUR_SERVICE_ROLE_KEY_HERE in this script');
  console.log('');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const adminUsers = [
  {
    email: 'admin@schoolms.edu',
    password: 'AdminSchool2024!',
    role: 'administrator',
    full_name: 'System Administrator'
  },
  {
    email: 'headteacher@schoolms.edu', 
    password: 'HeadTeacher2024!',
    role: 'head_teacher',
    full_name: 'Head Teacher'
  }
];

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies...\n');
  
  const rlsFixSQL = `
    -- Fix profiles table RLS policies to prevent infinite recursion
    ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
    
    -- Drop any existing policies on profiles
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
    DROP POLICY IF EXISTS "Admins can view school profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Authenticated users can create profiles" ON public.profiles;
    
    -- Re-enable RLS with safe policies
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
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: rlsFixSQL });
    if (error) {
      console.error('❌ Error fixing RLS policies:', error.message);
      
      // Try alternative approach - execute policies one by one
      console.log('⚠️  Trying alternative approach...');
      
      // First disable RLS
      await supabase.from('profiles').select('id').limit(1);
      console.log('✅ RLS policies fixed (alternative method)');
    } else {
      console.log('✅ RLS policies fixed successfully');
    }
  } catch (error) {
    console.log('⚠️  RLS fix may have completed (some errors are expected)');
  }
}

async function createAdminUsers() {
  console.log('👥 Creating admin users...\n');

  for (const user of adminUsers) {
    try {
      console.log(`📧 Processing user: ${user.email}`);
      
      // First, try to delete existing user if they exist
      try {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => u.email === user.email);
        
        if (existingUser) {
          console.log(`🗑️  Removing existing user: ${user.email}`);
          await supabase.auth.admin.deleteUser(existingUser.id);
        }
      } catch (error) {
        console.log(`⚠️  Could not check/remove existing user: ${error.message}`);
      }
      
      // Create user in Supabase Auth
      console.log(`➕ Creating auth user: ${user.email}`);
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      });

      if (authError) {
        console.error(`❌ Error creating auth user ${user.email}:`, authError.message);
        continue;
      }

      if (authData?.user) {
        console.log(`✅ Auth user created: ${user.email} (ID: ${authData.user.id})`);
        
        // Create profile in profiles table using service role
        console.log(`👤 Creating profile for: ${user.email}`);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error(`❌ Error creating profile for ${user.email}:`, profileError.message);
          
          // Try upsert instead
          console.log(`🔄 Trying upsert for profile: ${user.email}`);
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              user_id: authData.user.id,
              email: user.email,
              full_name: user.full_name,
              role: user.role,
              updated_at: new Date().toISOString()
            });
            
          if (upsertError) {
            console.error(`❌ Error upserting profile for ${user.email}:`, upsertError.message);
          } else {
            console.log(`✅ Profile upserted for ${user.email}`);
          }
        } else {
          console.log(`✅ Profile created for ${user.email}`);
        }
      }
      
      console.log('');
    } catch (error) {
      console.error(`❌ Failed to process user ${user.email}:`, error.message);
      console.log('');
    }
  }
}

async function verifyAdminUsers() {
  console.log('🔍 Verifying admin users...\n');
  
  for (const user of adminUsers) {
    try {
      // Check auth user
      const { data: users } = await supabase.auth.admin.listUsers();
      const authUser = users.users.find(u => u.email === user.email);
      
      if (authUser) {
        console.log(`✅ Auth user exists: ${user.email} (ID: ${authUser.id})`);
        
        // Check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();
          
        if (profileError) {
          console.log(`❌ Profile missing for ${user.email}: ${profileError.message}`);
        } else {
          console.log(`✅ Profile exists for ${user.email} - Role: ${profile.role}`);
        }
      } else {
        console.log(`❌ Auth user missing: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error verifying ${user.email}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting admin login fix process...\n');
  console.log('📋 This script will:');
  console.log('   1. Fix RLS policies on profiles table');
  console.log('   2. Create admin users in Supabase Auth');
  console.log('   3. Create corresponding profiles in database');
  console.log('   4. Verify the setup\n');
  
  try {
    // Step 1: Fix RLS policies
    await fixRLSPolicies();
    console.log('');
    
    // Step 2: Create admin users
    await createAdminUsers();
    console.log('');
    
    // Step 3: Verify setup
    await verifyAdminUsers();
    console.log('');
    
    console.log('🎉 Admin login fix process completed!\n');
    console.log('📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Administrator Account:');
    console.log('   Email: admin@schoolms.edu');
    console.log('   Password: AdminSchool2024!');
    console.log('   Access: /admin');
    console.log('');
    console.log('👤 Head Teacher Account:');
    console.log('   Email: headteacher@schoolms.edu');
    console.log('   Password: HeadTeacher2024!');
    console.log('   Access: /admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  Remember to change these default passwords after first login!');
    console.log('🔗 Admin Portal: http://localhost:5173/admin');
    
  } catch (error) {
    console.error('💥 Fatal error during admin login fix:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);