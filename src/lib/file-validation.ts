export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const FILE_VALIDATION = {
  MAX_SIZE: 350 * 1024, // 350KB
  ALLOWED_TYPES: {
    DOCUMENT: [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ],
    IMAGE: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ],
  },
  ALLOWED_EXTENSIONS: {
    DOCUMENT: [".pdf", ".jpg", ".jpeg", ".png"],
    IMAGE: [".jpg", ".jpeg", ".png", ".webp"],
  },
} as const;

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

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
  if (file.type !== "" && !allowedTypes.includes(file.type)) {
    const extensions = allowedExtensions.join(", ").toUpperCase();
    return {
      isValid: false,
      error: `Format file tidak didukung. Hanya file ${extensions} yang diperbolehkan.`,
    };
  }
  
  return { isValid: true };
}

export function validateDocumentFile(
  file: File,
  maxSize: number = FILE_VALIDATION.MAX_SIZE
): FileValidationResult {
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
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

export function validateImageFile(
  file: File,
  maxSize: number = FILE_VALIDATION.MAX_SIZE
): FileValidationResult {
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

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

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? `.${parts.at(-1)?.toLowerCase()}` : "";
}

export function isDocumentFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (FILE_VALIDATION.ALLOWED_EXTENSIONS.DOCUMENT as readonly string[]).includes(extension);
}

export function isImageFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (FILE_VALIDATION.ALLOWED_EXTENSIONS.IMAGE as readonly string[]).includes(extension);
}
