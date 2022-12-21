import React from "react";
import { Button, Modal as NBModal, Text } from "native-base";

type ModalProps = {
  body: string;
  header: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onConfirm: () => void;
};

export default function Modal({
  body,
  header,
  isOpen,
  setIsOpen,
  onConfirm,
}: ModalProps) {
  return (
    <NBModal isOpen={isOpen} onClose={setIsOpen} size="sm">
      <NBModal.Content>
        <NBModal.CloseButton />
        <NBModal.Header>{header}</NBModal.Header>
        <NBModal.Body>
          <Text>{body}</Text>
        </NBModal.Body>
        <NBModal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                onConfirm();
                setIsOpen(false);
              }}
            >
              Confirm
            </Button>
          </Button.Group>
        </NBModal.Footer>
      </NBModal.Content>
    </NBModal>
  );
}
