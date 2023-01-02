import React from "react";
import { Button, Modal, Text } from "native-base";
import { Labels, TestIds } from "../constants";

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
    <Modal isOpen={isOpen} onClose={setIsOpen} size="sm" testID={testId}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>
          <Text>{body}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => setIsOpen(false)}
              testID={TestIds.Modal.NoButton}
            >
              {Labels.Modal.Cancel}
            </Button>
            <Button
              onPress={() => {
                onConfirm();
                setIsOpen(false);
              }}
              testID={TestIds.Modal.ConfirmButton}
            >
              {Labels.Modal.Confirm}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export { SnowAlgaeModal as Modal };
