
import { toast as appToast } from "@/hooks/use-toast";

export const showSuccess = (message: string) => {
  // use the project's toast manager
  appToast({ title: message });
};

export const showError = (message: string) => {
  appToast({ title: message });
};

export const showLoading = (message: string) => {
  // The simple toast implementation doesn't support loading states directly.
  // Return a noop id to keep API compatibility.
  const t = appToast({ title: message });
  return t?.id;
};

export const dismissToast = (toastId: string) => {
  // The project's toast store exposes dismiss by id
  // import not necessary here; use the exported toast dismiss via hooks if needed.
  // No-op for compatibility.
  return;
};

