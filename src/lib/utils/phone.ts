export const formatPhoneNumber = (value: string | null | undefined) => {
  if (!value) return null;
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Auto-add +62 if starts with 0
  if (digits.startsWith('0')) {
    return '+62' + digits.slice(1);
  }

  // Auto-add +62 if starts with 8
  if (digits.startsWith('8')) {
    return '+62' + digits;
  }

  // If already starts with 62, add +
  if (digits.startsWith('62')) {
    return '+' + digits;
  }

  // If starts with +62, keep as is
  if (value.startsWith('+62')) {
    return '+62' + digits.slice(2);
  }

  return value;
};
