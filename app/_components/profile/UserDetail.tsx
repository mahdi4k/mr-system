"use client";

import { ActionIcon, Box, Card, Flex, SimpleGrid, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import NameEdit from "./edit/NameEdit";
import { useDisclosure } from "@mantine/hooks";
import EmailEdit from "./edit/EmailEdit";

export interface UserResponse {
  message: string;
  userData: UserData;
}

interface UserData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const UserDetail = () => {
  const [userData, setUserData] = useState<UserResponse>();
  const [error, setError] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEmail, { open: openEmail, close: closeEmail }] =
    useDisclosure(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Assuming userData is in the response
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong");
      }
    } catch (error) {
      // setError(error.message || 'An error occurred');
    }
  };
  // useEffect(() => {
  //     if (!token) {
  //         router.replace('/'); // Use `replace` to avoid adding to history
  //     } else {
  //         setLoading(false); // Set loading to false once the token is confirmed
  //     }
  // }, [token, router]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Card mb={"xl"} shadow="sm">
      <SimpleGrid p={"lg"} verticalSpacing="xl" cols={2}>
        <Flex
          justify={"space-between"}
          style={{ borderLeft: "1px solid var(--mantine-color-gray-4)" }}
          pl={"lg"}
        >
          <Flex direction={"column"}>
            <Text fz={"xs"} c={"dimmed"}>
              نام{" "}
            </Text>
            <Text mt={"md"}>{userData?.userData?.name || "---"}</Text>
          </Flex>
          <ActionIcon onClick={open} variant="subtle">
            <IconEdit size={20} />
          </ActionIcon>
        </Flex>

        <Flex justify={"space-between"} pr={"xs"}>
          <Flex direction={"column"}>
            <Text fz={"xs"} c={"dimmed"}>
              ایمیل
            </Text>
            <Text mt={"md"}>{userData?.userData?.email || "---"}</Text>
          </Flex>
          <ActionIcon onClick={openEmail} variant="subtle">
            <IconEdit size={20} />
          </ActionIcon>
        </Flex>
        <Flex
          justify={"space-between"}
          style={{ borderLeft: "1px solid var(--mantine-color-gray-4)" }}
          pl={"lg"}
        >
          <Flex direction={"column"}>
            <Text fz={"xs"} c={"dimmed"}>
              شماره موبایل
            </Text>
            <Text mt={"md"}>{userData?.userData?.phone || "---"}</Text>
          </Flex>
          {/* <ActionIcon variant='subtle'>
                        <IconEdit size={20} />
                    </ActionIcon> */}
        </Flex>
        <NameEdit fetchUserData={fetchUserData} close={close} opened={opened} />
        <EmailEdit
          fetchUserData={fetchUserData}
          close={closeEmail}
          opened={openedEmail}
        />
      </SimpleGrid>
    </Card>
  );
};

export default UserDetail;
