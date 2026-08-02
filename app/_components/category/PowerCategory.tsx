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
import AmdOrIntelFilter from "../filters/AmdOrIntelFilter";
import Image from "next/image";
import LoadingCategorySkeleton from "./components/LoadingCategorySkeleton";
import { useDisclosure } from "@mantine/hooks";
import ModalItems from "./components/modalItems";
import { useGetPowersQuery } from "@/_redux/services/powerApi";
import { Graphic } from "@/_redux/services/graphicApi";
import classes from "./category.module.css";
import Link from "next/link";
import CardPartPrice from "../shared/CardPartPrice";
import PowerModularFilter from "../filters/PowerModularFilter";
import CategoryLayout from "./CategoryLayout";
import PowerStandardFilter from "../filters/PowerStandardFilter";
import { theme } from "../../../theme";
import { getGraphicsByIds } from "@/_data/productCatalog";

const PowerCategory = () => {
  const [value, setValue] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchSubmit, setSearchSubmit] = useState<string>("");
  const [StandardSelected, setStandardSelected] = useState<string[]>([]);
  const {
    isSuccess,
    data = [],
    error,
    isLoading,
  } = useGetPowersQuery({
    modular: value,
    eighty_plus: StandardSelected,
    search: searchSubmit,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<Graphic[]>();
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalType, setModalType] = useState<"graphics">();

  const openModal = (ids: number[], name: string, type: "graphics") => {
    open();
    setModalData(getGraphicsByIds(ids));
    setModalTitle(name);
    setModalType(type);
  };

  return (
    <>
      <Flex my={"md"} wrap={"wrap"} justify={"space-between"}>
        <TextInput
          mt={"2px"}
          mb={{ base: "lg", lg: "0" }}
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
        <Box>
          <Popover width={250} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button
                ml={"lg"}
                variant="outline"
                styles={{ section: { marginLeft: "5px" } }}
                radius={"xl"}
                color="gray"
                leftSection={<IconChevronDown size={16} />}
                px="xl"
              >
                {" "}
                استاندارد
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <PowerStandardFilter
                value={StandardSelected}
                setValue={setStandardSelected}
              />
            </Popover.Dropdown>
          </Popover>

          <Popover width={350} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button
                variant="outline"
                styles={{ section: { marginLeft: "5px" } }}
                radius={"xl"}
                color="gray"
                leftSection={<IconChevronDown size={16} />}
                px="xl"
              >
                نوع کابل کشی
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <PowerModularFilter value={value} setValue={setValue} />
            </Popover.Dropdown>
          </Popover>
        </Box>
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
              type={"powers"}
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
                      label="کارت گرافیک‌های مطابق"
                    >
                      <Avatar
                        onClick={() =>
                          openModal(data.graphics, data.name, "graphics")
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <Image
                          alt="graphic card"
                          width={20}
                          height={20}
                          src={"/svg/graphic.svg"}
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
          title={`لیست کارت گرافیک‌های مطابق با ${modalTitle}`}
          type={modalType}
          items={modalData}
        />
      </Modal>
    </>
  );
};

export default PowerCategory;
