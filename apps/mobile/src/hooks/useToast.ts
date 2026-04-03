import { useContext } from "react";
import { ToastContext } from "../components/feedback";

function useAlgaeToast() {
  return useContext(ToastContext);
}

export { useAlgaeToast as useToast };