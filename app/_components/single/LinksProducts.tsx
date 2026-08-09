import { Flex, Button } from "@mantine/core";
import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";

type Props = {
  links: string;
};

function parseProductLinks(links: string): [string?, string?] {
  try {
    const parsed: unknown = JSON.parse(links);

    if (Array.isArray(parsed)) {
      const validLinks = parsed.filter(
        (link): link is string => typeof link === "string",
      );
      return [validLinks[0], validLinks[1]];
    }

    if (typeof parsed === "string") {
      return [parsed];
    }
  } catch {
    // Current catalog entries store the Torob URL directly.
  }

  return links ? [links] : [];
}

const LinksProducts: FC<Props> = ({ links }) => {
  const [torobLink, emallsLink] = parseProductLinks(links);

  return (
    <Flex justify={"end"} my={"xl"}>
      {torobLink && (
        <Link href={torobLink} target="_blank">
          <Button
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
        </Link>
      )}

      {emallsLink && (
        <Link href={emallsLink} target="_blank">
          <Button
            mr={"lg"}
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
        </Link>
      )}
    </Flex>
  );
};

export default LinksProducts;
