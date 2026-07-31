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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import {
  useGetCpusQuery,
  useRemoveCpuMutation,
} from "@/_redux/services/cpuApi";
import Image from "next/image";

const ClientCpu = () => {
  const [loadingSession, setLoadingSession] = useState(false);
  const session = useSession();
  const {
    isSuccess,
    data = [],
    error,
  } = useGetCpusQuery({}, { skip: !loadingSession });
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCpuID, setSelectedCpuID] = useState<number>();
  const [removeCpu, response] = useRemoveCpuMutation();

  useEffect(() => {
    setLoadingSession(!!session.data);
  }, [session.data]);
  const openModalRemove = (id: number) => {
    setSelectedCpuID(id);
    open();
  };
  const handleRemoveCpu = () => {
    removeCpu(selectedCpuID);
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
      <Table.Td>{element.manufacturer}</Table.Td>
      <Table.Td>{element.integrated_graphic}</Table.Td>
      <Table.Td>{element.cpu_socket}</Table.Td>
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

          <ActionIcon variant="light" size="md" aria-label="edit">
            <IconEdit style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </ActionIcon.Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack>
        <Flex justify={"space-between"} align={"center"}>
          <Text mt={"sm"} mb={"md"} fw={"bold"} fz={"lg"}>
            لیست cpu
          </Text>
          <Link href="/dashboard/cpu/add">
            <Button variant={"outline"}>افزودن</Button>
          </Link>
        </Flex>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>عنوان</Table.Th>
              <Table.Th>برند</Table.Th>
              <Table.Th>گرافیک مجتمع</Table.Th>
              <Table.Th>سوکت</Table.Th>
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
          title="آیا از حذف این cpu مطمئن هستید"
        />
        <Flex mt={"lg"} justify={"flex-end"}>
          <Button ml={"md"} variant={"light"} onClick={close}>
            خیر
          </Button>
          <Button
            bg={"tomato"}
            color={"white"}
            variant={"light"}
            onClick={handleRemoveCpu}
          >
            بله
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default ClientCpu;
