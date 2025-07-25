// Utility function to properly log error objects
export function logError(context: string, error: any) {
  console.error(`${context}:`, {
    message: error?.message || 'Unknown error',
    name: error?.name,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    stack: error?.stack,
    full_error: JSON.stringify(error, null, 2)
  });
}

// Utility function to format Supabase errors specifically
export function logSupabaseError(context: string, error: any) {
  console.error(`${context} - Supabase Error:`, {
    message: error?.message || 'Unknown Supabase error',
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    status: error?.status,
    statusText: error?.statusText,
    full_error: JSON.stringify(error, null, 2)
  });
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
