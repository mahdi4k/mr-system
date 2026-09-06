import {
  Flex,
  Popover,
  Button,
  Card,
  Group,
  Badge,
  Text,
  Divider,
  Stack,
  Grid,
  Avatar,
  Tooltip,
  Modal,
  Box,
  ActionIcon,
  rem,
  TextInput,
} from "@mantine/core";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import Image from "next/image";
import LoadingCategorySkeleton from "./components/LoadingCategorySkeleton";
import { useDisclosure } from "@mantine/hooks";
import ModalItems from "./components/modalItems";
import { useGetFansQuery } from "@/_redux/services/fanApi";
import PowerModularFilter from "../filters/PowerModularFilter";
import CategoryLayout from "./CategoryLayout";
import { CPU } from "@/_redux/services/cpuApi";
import { theme } from "../../../theme";
import { getCpusByIds } from "@/_data/productCatalog";

const FanCategory = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchSubmit, setSearchSubmit] = useState<string>("");

  const {
    isSuccess,
    data = [],
    error,
    isLoading,
  } = useGetFansQuery({ search: searchSubmit });
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<CPU[]>();
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalType, setModalType] = useState<"cpus">();

  const openModal = (ids: number[], name: string, type: "cpus") => {
    open();
    setModalData(getCpusByIds(ids));
    setModalTitle(name);
    setModalType(type);
  };

  return (
    <>
      <Flex my={"md"} justify={"space-between"}>
        <TextInput
          mt={"2px"}
          radius="xl"
          w={{ base: 210, sm: 260 }}
          onKeyDown={(e) =>
            e.key === "Enter" ? setSearchSubmit(searchValue) : ""
          }
          size="sm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="جستجو در نتایج"
          rightSectionWidth={42}
          rightSection={
            <ActionIcon
              onClick={() => setSearchSubmit(searchValue)}
              size={32}
              radius="xl"
              color={theme.primaryColor}
              variant="light"
            >
              <IconSearch
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          }
        />
      </Flex>
      <Divider color="#d2d2d269" mb={"md"} />

      {isLoading ? (
        <>
          <LoadingCategorySkeleton />
        </>
      ) : (
        ""
      )}
      <Grid pb="md" mb={"xl"}>
        {data &&
          data.map((data) => (
            <CategoryLayout
              key={data.id}
              type={"fans"}
              data={data}
              children={
                <Box
                  pos={"absolute"}
                  left={0}
                  right={0}
                  bottom={"2px"}
                  component="div"
                >
                  <Divider color="#d2d2d269" mb={"4px"} />

                  <Group align="center" justify="center">
                    <Tooltip
                      styles={{ tooltip: { fontSize: "12px" } }}
                      position="bottom"
                      label="cpu های مطابق"
                    >
                      <Avatar
                        onClick={() => openModal(data.cpus, data.name, "cpus")}
                        style={{ cursor: "pointer" }}
                      >
                        <Image
                          alt="rigora cpu"
                          width={20}
                          height={20}
                          src={"/svg/cpu.svg"}
                        />
                      </Avatar>
                    </Tooltip>
                  </Group>
                </Box>
              }
            />
          ))}
      </Grid>

      <Modal opened={opened} size={"1300px"} onClose={close}>
        <ModalItems
          title={`لیست cpu های مطابق با ${modalTitle}`}
          type={modalType}
          items={modalData}
        />
      </Modal>
    </>
  );
};

export default FanCategory;
