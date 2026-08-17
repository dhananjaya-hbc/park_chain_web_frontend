export interface FileValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Validates a KYB document upload file.
 * Allowed formats: PDF, JPG, PNG
 * Maximum size: 5 MB
 */
export function validateKYBDocument(file: File): FileValidationResult {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const allowedExtensions = ['.png', '.jpg', '.jpeg'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

  const fileMime = file.type ? file.type.toLowerCase() : '';
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  // Validate actual file type / MIME type where possible, falling back to extension check
  const hasValidMime = allowedMimeTypes.includes(fileMime);
  const hasValidExtension = allowedExtensions.includes(fileExtension);

  if (!hasValidMime && !hasValidExtension) {
    return {
      isValid: false,
      error: 'Please upload a JPG or PNG file.',
    };
  }

  // Validate file size is <= 5 MB
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: 'File size must be 5 MB or less.',
    };
  }

  return {
    isValid: true,
    error: '',
  };
}
