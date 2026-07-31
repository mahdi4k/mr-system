import { Flex, Button, ActionIcon } from "@mantine/core";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { CPU } from "@/_redux/services/cpuApi";
import { Graphic } from "@/_redux/services/graphicApi";
import { POWER } from "@/_redux/services/powerApi";
import { Motherboard } from "@/_redux/services/motherboardApi";

const parseLinks = (links: string | undefined): string[] => {
  if (!links) return [];
  try {
    const parsed = JSON.parse(links);
    return Array.isArray(parsed) ? parsed : [links];
  } catch {
    return [links];
  }
};

const ShopsLink = ({
  currentPiece,
  justIcon,
}: {
  currentPiece:
    | Partial<Motherboard>
    | Partial<CPU>
    | Partial<Graphic>
    | Partial<POWER>;
  justIcon?: boolean;
}) => {
  const links = parseLinks(currentPiece.links);
  const firstLink = links[0];
  const secondLink = links[1];

  return (
    <Flex justify={justIcon ? "center" : "start"} mt={"xs"}>
      {firstLink && (
        <Link href={firstLink} target="_blank">
          {justIcon ? (
            <ActionIcon
              onClick={(event) => event.stopPropagation()}
              title="لینک ترب"
              ml={"sm"}
              variant="light"
            >
              <Image alt="" width={20} height={20} src={"/torob.png"} />
            </ActionIcon>
          ) : (
            <Button
              ml={"xs"}
              px={"xs"}
              color="red"
              leftSection={
                <Image
                  style={{ borderRadius: "100%" }}
                  alt="torob-kiwi-part"
                  width={20}
                  height={20}
                  src={"/torob.png"}
                />
              }
              variant="light"
            >
              مشاهده در ترب
            </Button>
          )}
        </Link>
      )}

      {secondLink && (
        <Link href={secondLink} target="_blank">
          {justIcon ? (
            <ActionIcon
              onClick={(event) => event.stopPropagation()}
              title="لینک ایمالز"
              variant="light"
            >
              <Image alt="" width={20} height={20} src={"/emalls.png"} />
            </ActionIcon>
          ) : (
            <Button
              color="indigo"
              px={"xs"}
              variant="light"
              leftSection={
                <Image
                  style={{ borderRadius: "100%" }}
                  alt="emalls-kiwi-part"
                  width={20}
                  height={20}
                  src={"/emalls.png"}
                />
              }
            >
              مشاهده در ایمالز
            </Button>
          )}
        </Link>
      )}
    </Flex>
  );
};

export default ShopsLink;
