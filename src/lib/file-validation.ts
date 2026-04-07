/**
 * File Validation Utilities
 * Reusable validation functions for file uploads
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// Validation constants
export const FILE_VALIDATION = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_TYPES: {
    DOCUMENT: [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ],
    IMAGE: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ],
    PAYMENT_PROOF: [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ],
  },
  ALLOWED_EXTENSIONS: {
    DOCUMENT: [".pdf", ".doc", ".docx"],
    IMAGE: [".jpg", ".jpeg", ".png", ".webp"],
    PAYMENT_PROOF: [".pdf", ".jpg", ".jpeg", ".png", ".webp"],
  },
} as const;

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Validate file size
 */
export function validateFileSize(
  file: File,
  maxSize: number = FILE_VALIDATION.MAX_SIZE
): FileValidationResult {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File terlalu besar. Maksimum ukuran file adalah ${formatFileSize(maxSize)}.`,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate file type/extension
 */
export function validateFileType(
  file: File,
  allowedTypes: readonly string[],
  allowedExtensions: readonly string[]
): FileValidationResult {
  const fileName = file.name.toLowerCase();
  
  // Check extension
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    const extensions = allowedExtensions.join(", ").toUpperCase();
    return {
      isValid: false,
      error: `Format file tidak didukung. Hanya file ${extensions} yang diperbolehkan.`,
    };
  }
  
  // Check MIME type (additional validation)
  // Note: Some browsers might not set the correct MIME type, so we rely more on extension
  if (file.type !== "" && !allowedTypes.includes(file.type)) {
    const extensions = allowedExtensions.join(", ").toUpperCase();
    return {
      isValid: false,
      error: `Format file tidak didukung. Hanya file ${extensions} yang diperbolehkan.`,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate document file (PDF, DOC, DOCX)
 */
export function validateDocumentFile(
  file: File,
  maxSize: number = FILE_VALIDATION.MAX_SIZE
): FileValidationResult {
  // Validate size
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  // Validate type
  const typeValidation = validateFileType(
    file,
    FILE_VALIDATION.ALLOWED_TYPES.DOCUMENT,
    FILE_VALIDATION.ALLOWED_EXTENSIONS.DOCUMENT
  );
  if (!typeValidation.isValid) {
    return typeValidation;
  }
  
  return { isValid: true };
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSize: number = FILE_VALIDATION.MAX_SIZE
): FileValidationResult {
  // Validate size
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  // Validate type
  const typeValidation = validateFileType(
    file,
    FILE_VALIDATION.ALLOWED_TYPES.IMAGE,
    FILE_VALIDATION.ALLOWED_EXTENSIONS.IMAGE
  );
  if (!typeValidation.isValid) {
    return typeValidation;
  }
  
  return { isValid: true };
}

/**
 * Validate payment proof file (PDF or image)
 */
export function validatePaymentProofFile(
  file: File,
  maxSize: number = FILE_VALIDATION.MAX_SIZE
): FileValidationResult {
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  const typeValidation = validateFileType(
    file,
    FILE_VALIDATION.ALLOWED_TYPES.PAYMENT_PROOF,
    FILE_VALIDATION.ALLOWED_EXTENSIONS.PAYMENT_PROOF
  );
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  return { isValid: true };
}

/**
 * Get file extension
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  const extension = parts.at(-1);
  return parts.length > 1 && extension ? `.${extension.toLowerCase()}` : "";
}

/**
 * Check if file is a document
 */
export function isDocumentFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (FILE_VALIDATION.ALLOWED_EXTENSIONS.DOCUMENT as readonly string[]).includes(extension);
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (FILE_VALIDATION.ALLOWED_EXTENSIONS.IMAGE as readonly string[]).includes(extension);
}
