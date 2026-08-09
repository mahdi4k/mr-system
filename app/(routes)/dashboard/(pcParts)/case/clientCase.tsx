"use client";
import React, { useEffect, useState } from "react";
import {
  Text,
  Table,
  Stack,
  Flex,
  Button,
  ActionIcon,
  rem,
  Modal,
  Alert,
} from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import Image from "next/image";
import {
  useGetCasesQuery,
  useRemoveCaseMutation,
} from "@/_redux/services/caseApi";

const ClientCase = () => {
  const { isSuccess, data = [], error } = useGetCasesQuery({});
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCaseID, setSelectedCaseID] = useState<number>();
  const [removeCase, response] = useRemoveCaseMutation();

  const openModalRemove = (id: number) => {
    setSelectedCaseID(id);
    open();
  };
  const handleRemoveCase = () => {
    removeCase(selectedCaseID);
    if (isSuccess) {
      notifications.show({
        color: "green",
        title: "با موفقیت حذف شد",
        message: "",
        classNames: notifClasses,
      });
      close();
    }
  };

  const rows = data?.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        <Flex align={"end"}>
          {element.image && (
            <Image
              alt={element.name}
              width={30}
              height={30}
              src={`${element.image}`}
            />
          )}
          <Text fz={"sm"} mr={"xs"}>
            {element.name}
          </Text>
        </Flex>
      </Table.Td>
      <Table.Td>{element.brand}</Table.Td>
      <Table.Td>{element.form} </Table.Td>
      <Table.Td>{element.max_total_fan}</Table.Td>
      <Table.Td>
        <ActionIcon.Group>
          <ActionIcon
            onClick={() => openModalRemove(element.id)}
            ml={"sm"}
            variant="light"
            size="md"
            aria-label="remove"
          >
            <IconTrash style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>

          <Link href={`/dashboard/case/edit/${element.id}`}>
            <ActionIcon variant="light" size="md" aria-label="edit">
              <IconEdit style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Link>
        </ActionIcon.Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack>
        <Flex justify={"space-between"} align={"center"}>
          <Text mt={"sm"} mb={"md"} fw={"bold"} fz={"lg"}>
            لیست case
          </Text>
          <Link href="/dashboard/case/add">
            <Button variant={"outline"}>افزودن</Button>
          </Link>
        </Flex>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>نام</Table.Th>
              <Table.Th>برند</Table.Th>
              <Table.Th>age</Table.Th>
              <Table.Th>read</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Stack>
      <Modal opened={opened} onClose={close}>
        <Alert
          variant="light"
          color="red"
          title="آیا از حذف این case مطمئن هستید"
        />
        <Flex mt={"lg"} justify={"flex-end"}>
          <Button ml={"md"} variant={"light"} onClick={close}>
            خیر
          </Button>
          <Button
            bg={"tomato"}
            color={"white"}
            variant={"light"}
            onClick={handleRemoveCase}
          >
            بله
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default ClientCase;
