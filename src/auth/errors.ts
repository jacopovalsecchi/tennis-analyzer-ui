const byCode: Record<string, string> = {
  invalid_credentials: 'Email or password is incorrect.',
  email_not_confirmed: 'Confirm your email before signing in.',
  user_already_exists: 'An account with this email already exists.',
  weak_password: 'Use at least 6 characters.',
  over_request_rate_limit: 'Too many attempts. Wait a moment and try again.',
  validation_failed: 'Check the email and password.',
};

function messageForText(message: string): string | null {
  const text = message.toLowerCase();
  if (text.includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }
  if (text.includes('email not confirmed')) {
    return 'Confirm your email before signing in.';
  }
  if (text.includes('already registered')) {
    return 'An account with this email already exists.';
  }
  if (text.includes('password') && text.includes('at least')) {
    return 'Use at least 6 characters.';
  }
  if (
    text.includes('network request failed') ||
    text.includes('failed to fetch') ||
    text.includes('network error')
  ) {
    return 'Could not reach the account service.';
  }
  if (text.includes('redirect')) {
    return 'Add tennisanalyzer://auth/callback to the Supabase redirect allow list.';
  }
  return null;
}

export function messageFromAuthError(error: {
  message?: string;
  code?: string;
}): string {
  if (error.code && byCode[error.code]) {
    return byCode[error.code];
  }
  if (error.message) {
    return messageForText(error.message) ?? error.message;
  }
  return 'Could not complete that request.';
}

export function messageFromUnknown(error: unknown): string {
  if (error && typeof error === 'object') {
    const code = 'code' in error ? String(error.code ?? '') : '';
    const message = 'message' in error ? String(error.message ?? '') : '';
    if (code || message) {
      return messageFromAuthError({ code, message });
    }
  }
  if (error instanceof Error && error.message) {
    return messageForText(error.message) ?? error.message;
  }
  return 'Could not complete that request.';
}
