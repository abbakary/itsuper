import { supabase } from '../lib/supabase';

/**
 * Sync all auth.users to user_profiles table
 * This fixes the issue where users exist in auth but not in user_profiles
 */
export async function syncAuthUsersToProfiles() {
  try {
    console.log('🔄 Starting user sync...');

    // Call the sync function we created in the database
    const { data, error } = await supabase.rpc('sync_auth_users_to_profiles');

    if (error) {
      console.error('❌ Sync function error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ User sync completed successfully');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Exception during user sync:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if current user has a profile, create one if missing
 */
export async function ensureCurrentUserProfile() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'No authenticated user' };
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('🔧 Creating missing profile for current user');
      
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || 'User',
          role: user.user_metadata?.role || 'user',
          office_name: user.user_metadata?.office_name || 'SuperDoll Office',
          department: user.user_metadata?.department || 'General',
          is_active: true
        });

      if (insertError) {
        console.error('❌ Failed to create profile:', insertError);
        return { success: false, error: insertError.message };
      }

      console.log('✅ Profile created for current user');
      return { success: true };
    }

    if (profileError) {
      console.error('❌ Error checking profile:', profileError);
      return { success: false, error: profileError.message };
    }

    console.log('✅ User profile already exists');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Exception ensuring user profile:', error);
    return { success: false, error: error.message };
  }
}
