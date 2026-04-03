import { createContext, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { YStack, Label, Text, XStack, useTheme } from "tamagui";

type FormFieldContextValue = {
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  id: string;
};

const FormFieldContext = createContext<FormFieldContextValue>({ id: "" });

export const useFormField = () => useContext(FormFieldContext);

type FormFieldProps = FormFieldContextValue & {
  children: React.ReactNode;
};

export function FormField({
  id,
  isInvalid,
  isRequired,
  isDisabled,
  children,
}: FormFieldProps) {
  return (
    <FormFieldContext.Provider
      value={{ id, isInvalid, isRequired, isDisabled }}
    >
      <YStack gap="$1" opacity={isDisabled ? 0.5 : 1}>
        {children}
      </YStack>
    </FormFieldContext.Provider>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  const { id, isRequired, isInvalid } = useFormField();
  return (
    <XStack gap="$1" alignItems="center">
      <Label
        htmlFor={id}
        color={isInvalid ? "$red10" : "$color"}
        fontWeight="500"
      >
        {children}
      </Label>
      {isRequired && (
        <Text color="$red10" fontSize="$3">
          *
        </Text>
      )}
    </XStack>
  );
}

export function FormErrorMessage({ children }: { children: React.ReactNode }) {
  const { isInvalid } = useFormField();
  const theme = useTheme();
  if (!isInvalid) return null;
  return (
    <XStack gap="$1" alignItems="center">
      <Ionicons name="warning-outline" size={14} color={theme.red10.val} />
      <Text color="$red10" fontSize="$2">
        {children}
      </Text>
    </XStack>
  );
}

export function FormHelperText({ children }: { children: React.ReactNode }) {
  const { isInvalid } = useFormField();
  if (isInvalid) return null;
  return (
    <Text color="$colorSecondary" fontSize="$2">
      {children}
    </Text>
  );
}
