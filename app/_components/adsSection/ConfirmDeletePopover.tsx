import { Popover, ActionIcon, Button, Text, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

const ConfirmDeletePopover = ({
  productId,
  onDelete,
}: {
  productId: string;
  onDelete: (id: string) => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Popover
      opened={opened}
      onClose={close}
      width={200}
      position="bottom"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon onClick={open} mr={"lg"} variant="light" color="red">
          <IconTrash size={17} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">آیا از حذف این آیتم مطمن هستید</Text>
        <Flex justify={"flex-end"} mt={"sm"}>
          <Button
            ml={"sm"}
            color="red"
            variant="light"
            size="xs"
            onClick={() => onDelete(productId)}
          >
            بله
          </Button>
          <Button variant="light" size="xs" onClick={close}>
            خیر
          </Button>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ConfirmDeletePopover;
