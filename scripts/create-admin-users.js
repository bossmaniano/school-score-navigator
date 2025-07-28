import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://xqhyfvxirabxfivafmtt.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // This needs to be set as environment variable

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Please set the service role key from your Supabase dashboard');
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

async function createAdminUsers() {
  console.log('🚀 Starting admin user creation process...\n');

  for (const user of adminUsers) {
    try {
      console.log(`📧 Creating user: ${user.email}`);
      
      // Create user in Supabase Auth
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
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  User ${user.email} already exists, updating profile...`);
          
          // Try to find existing user and update their profile
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers.users.find(u => u.email === user.email);
          
          if (existingUser) {
            // Update the profile in the profiles table
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                user_id: existingUser.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
              });

            if (profileError) {
              console.error(`❌ Error updating profile for ${user.email}:`, profileError.message);
            } else {
              console.log(`✅ Profile updated for ${user.email}`);
            }
          }
          continue;
        } else {
          throw authError;
        }
      }

      if (authData?.user) {
        console.log(`✅ Auth user created: ${user.email} (ID: ${authData.user.id})`);
        
        // Create/update profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
          });

        if (profileError) {
          console.error(`❌ Error creating profile for ${user.email}:`, profileError.message);
        } else {
          console.log(`✅ Profile created for ${user.email}`);
        }
      }
      
      console.log('');
    } catch (error) {
      console.error(`❌ Failed to create user ${user.email}:`, error.message);
      console.log('');
    }
  }

  console.log('🎉 Admin user creation process completed!');
  console.log('\n📋 Summary:');
  console.log('- Admin Portal URL: /admin');
  console.log('- Admin Email: admin@schoolms.edu');
  console.log('- Admin Password: AdminSchool2024!');
  console.log('- Head Teacher Email: headteacher@schoolms.edu');
  console.log('- Head Teacher Password: HeadTeacher2024!');
  console.log('\n⚠️  Remember to change these default passwords after first login!');
}

// Run the script
createAdminUsers().catch(console.error);