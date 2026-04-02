import React from "react";
import { AlertDialog, Button, XStack } from "tamagui";
import { Labels, TestIds } from "../../constants";

type ModalProps = {
  body: string;
  header: string;
  isOpen: boolean;
  testId: string;
  setIsOpen: (value: boolean) => void;
  onConfirm: () => void;
};

function SnowAlgaeModal({
  body,
  header,
  isOpen,
  testId,
  setIsOpen,
  onConfirm,
}: ModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Portal>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore too complex union type */}
        <AlertDialog.Overlay />
        <AlertDialog.Content testID={testId}>
          <AlertDialog.Title>{header}</AlertDialog.Title>
          <AlertDialog.Description>{body}</AlertDialog.Description>
          <XStack justifyContent="flex-end" gap="$2" marginTop="$4">
            <AlertDialog.Cancel asChild>
              <Button chromeless testID={TestIds.Modal.NoButton}>
                {Labels.Modal.Cancel}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild onPress={onConfirm}>
              <Button testID={TestIds.Modal.ConfirmButton}>
                {Labels.Modal.Confirm}
              </Button>
            </AlertDialog.Action>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}

export { SnowAlgaeModal as Modal };
