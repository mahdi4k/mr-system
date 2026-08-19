import { Breadcrumbs, Anchor, Text } from "@mantine/core";
import React, { FC } from "react";

type Props = {
  title: string;
  type:
    | "cpu"
    | "motherboard"
    | "power"
    | "graphic"
    | "fan"
    | "ram"
    | "case"
    | "ssd";
};

const BreadCrumbKiwi: FC<Props> = ({ title, type }) => {
  return (
    <Breadcrumbs mb={"lg"} mt={"lg"}>
      <Anchor c={"var(--mantine-color-rigora-2)"} size="sm" href={"/"}>
        خانه
      </Anchor>
      <Anchor
        c={"var(--mantine-color-rigora-2)"}
        size="sm"
        href={`/category/${type}`}
      >
        {type === "cpu"
          ? "cpu"
          : type === "graphic"
            ? "گرافیک "
            : type === "power"
              ? "پاور"
              : type === "motherboard"
                ? "مادربرد"
                : type === "case"
                  ? "کیس"
                  : type === "fan"
                    ? "فن"
                    : type === "ram"
                      ? "رم"
                      : type === "ssd"
                        ? "ssd"
                        : ""}
      </Anchor>
      <Text c="dimmed" size="xs">
        {title}
      </Text>
    </Breadcrumbs>
  );
};

export default BreadCrumbKiwi;
