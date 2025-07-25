// Utility function to properly serialize and log error objects
export function logError(context: string, error: any) {
  // Create a serializable error object
  const errorInfo = {
    message: error?.message || 'Unknown error',
    name: error?.name,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    stack: error?.stack,
    status: error?.status,
    statusText: error?.statusText
  };

  // Log each property separately to avoid [object Object]
  console.group(`❌ ${context} Error:`);
  console.error('Message:', errorInfo.message);
  if (errorInfo.code) console.error('Code:', errorInfo.code);
  if (errorInfo.details) console.error('Details:', errorInfo.details);
  if (errorInfo.hint) console.error('Hint:', errorInfo.hint);
  if (errorInfo.status) console.error('Status:', errorInfo.status);
  if (errorInfo.statusText) console.error('Status Text:', errorInfo.statusText);

  // Try to stringify the full error object
  try {
    const serialized = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
    console.error('Full Error Object:', serialized);
  } catch (stringifyError) {
    console.error('Raw Error Object:', error);
  }

  console.groupEnd();
}

// Utility function to format Supabase errors specifically
export function logSupabaseError(context: string, error: any) {
  console.group(`🔴 ${context} - Supabase Error:`);
  console.error('Message:', error?.message || 'Unknown Supabase error');
  if (error?.code) console.error('Error Code:', error.code);
  if (error?.details) console.error('Details:', error.details);
  if (error?.hint) console.error('Hint:', error.hint);
  if (error?.status) console.error('HTTP Status:', error.status);
  if (error?.statusText) console.error('Status Text:', error.statusText);

  // Additional Supabase-specific properties
  if (error?.message?.includes('JWT')) {
    console.error('🔑 This appears to be an authentication/JWT error');
  }
  if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
    console.error('🗄️ This appears to be a missing table error');
  }

  console.groupEnd();
}

// Check if error is likely due to missing tables
export function isMissingTableError(error: any): boolean {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code || '';
  
  return (
    code === 'PGRST116' || 
    message.includes('relation') && message.includes('does not exist') ||
    message.includes('table') && message.includes('does not exist') ||
    message.includes('permission denied for table')
  );
}
