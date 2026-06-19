import { toastManager } from "@/components/ui/toast";

export function showSuccessToast(title: string, description?: string) {
  toastManager.add({
    type: "success",
    title,
    description,
  });
}

export function showErrorToast(title: string, description?: string | null) {
  toastManager.add({
    type: "error",
    title,
    description: description ?? undefined,
  });
}
