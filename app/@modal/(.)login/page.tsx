"use client";

import { Dialog, Input, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import LoginModalContent from '@/_components/loginModal/LoginModal';

import React from "react";

const LoginModal = () => {
  const router = useRouter();
  const [openedModal, { open: openModalLogin, close: closeModal }] = useDisclosure(true);
  const handleClose = () => {
    closeModal();  // Close the modal
    router.back() // Navigate back to the root page
  };

  return (
    <Modal opened={openedModal} onClose={handleClose} title="ورود / ثبت نام" >
      <LoginModalContent close={closeModal} />
    </Modal>

  );
};

export default LoginModal;
