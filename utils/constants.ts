import { ServiceProgress } from '../types';

export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5001/api';
export const WHATSAPP_NUMBER = process.env.VITE_WHATSAPP_NUMBER || '+55 95 98765-4321';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILES_UPLOAD = 10;

export const REFRESH_INTERVAL = 30000; // 30 segundos

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

export const DEBOUNCE_DELAY = 300; // ms

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `Arquivo muito grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB.` };
  }

  return { valid: true };
}

export function getServiceColor(service: ServiceProgress): string {
  if (service.isEmergency) return 'border-emergency-red bg-emergency-red/5';
  if (service.value >= 75) return 'border-green-500 bg-green-50';
  if (service.value >= 50) return 'border-blue-500 bg-blue-50';
  if (service.value >= 25) return 'border-yellow-500 bg-yellow-50';
  return 'border-red-500 bg-red-50';
}
