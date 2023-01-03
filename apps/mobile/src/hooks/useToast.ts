import { useToast } from "native-base";

function useAlgaeToast() {
  const toast = useToast();

  return {
    show: (component: JSX.Element) => {
      toast.show({
        placement: "top",
        duration: 2000,
        render: () => component,
      });
    },
  };
}

export { useAlgaeToast as useToast };
