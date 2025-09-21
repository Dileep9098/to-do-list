import { toast } from "sonner";

export const showSuccessMessage = (message) => {
    toast.success(message || "Operation successful!", {
        duration: 4000,
    });
}
export const showErrorMessage = (message) => {
    toast.error(message || "Something went wrong. Please try again.", {
        duration: 4000,
    });
}
