import {
  Flex,
  Popover,
  Button,
  Group,
  Divider,
  Grid,
  Avatar,
  Tooltip,
  Modal,
  Box,
  TextInput,
  ActionIcon,
  rem,
} from "@mantine/core";
import {
  IconArrowRight,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react";
import React, { useState } from "react";
import Image from "next/image";
import LoadingCategorySkeleton from "./components/LoadingCategorySkeleton";
import { useDisclosure } from "@mantine/hooks";
import ModalItems from "./components/modalItems";
import { useGetGraphicsQuery } from "@/_redux/services/graphicApi";
import { CPU } from "@/_redux/services/cpuApi";
import { POWER } from "@/_redux/services/powerApi";
import AmdOrNvidiaFilter from "../filters/AmdOrNvidiaFilter";
import CategoryLayout from "./CategoryLayout";
import { theme } from "../../../theme";
import { getCpusByIds, getPowersByIds } from "@/_data/productCatalog";
const GraphicCardCategory = () => {
  const [value, setValue] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchSubmit, setSearchSubmit] = useState<string>("");
  const {
    isSuccess,
    data = [],
    error,
    isLoading,
  } = useGetGraphicsQuery({ manufacturer: value, search: searchSubmit });
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<CPU[] | POWER[]>();
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalType, setModalType] = useState<"cpus" | "powers">();

  const openModal = (ids: number[], name: string, type: "cpus" | "powers") => {
    open();
    if (type === "cpus") {
      setModalData(getCpusByIds(ids));
    } else {
      setModalData(getPowersByIds(ids));
    }
    setModalTitle(name);
    setModalType(type);
  };

  return (
    <>
      <Flex wrap={"wrap"} my={"md"} justify={"space-between"}>
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

        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button
              variant="outline"
              styles={{ section: { marginLeft: "5px" } }}
              radius={"xl"}
              color="gray"
              leftSection={<IconChevronDown size={16} />}
              px="xl"
            >
              سازنده پردازنده گرافیکی
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <AmdOrNvidiaFilter value={value} setValue={setValue} />
          </Popover.Dropdown>
        </Popover>
      </Flex>

      <Divider color="#d2d2d269" mb={"md"} />

      {isLoading ? (
        <>
          <LoadingCategorySkeleton />
        </>
      ) : (
        ""
      )}
      <Grid pb="md" mb="xl">
        {data &&
          data.map((data) => (
            <CategoryLayout
              type={"graphics"}
              key={data.id}
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
                      label="cpu مطابق"
                    >
                      <Avatar
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(data.cpus, data.name, "cpus");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Image
                          alt="graphic card"
                          width={20}
                          height={20}
                          src={"/svg/cpu.svg"}
                        />
                      </Avatar>
                    </Tooltip>
                    <Tooltip
                      styles={{ tooltip: { fontSize: "12px" } }}
                      position="bottom"
                      label="پاورهای مطابق"
                    >
                      <Avatar
                        onClick={() =>
                          openModal(data.powers, data.name, "powers")
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <Image
                          alt="graphic card"
                          width={20}
                          height={25}
                          src={"/svg/power.svg"}
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
          title={` لیست ${modalType === "powers" ? "پاور" : " cpu"}های مطابق با ${modalTitle}`}
          type={modalType}
          items={modalData}
        />
      </Modal>
    </>
  );
};

export default GraphicCardCategory;
