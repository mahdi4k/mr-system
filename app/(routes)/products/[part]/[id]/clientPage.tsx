"use client";

import { Container } from "@mantine/core";
import React, { FC } from "react";
import { Graphic } from "@/_redux/services/graphicApi";
import { CPU } from "@/_redux/services/cpuApi";
import { POWER } from "@/_redux/services/powerApi";
import { Motherboard } from "@/_redux/services/motherboardApi";
import dynamic from "next/dynamic";
import BreadCrumbKiwi from "@/_components/single/BreadCrumbKiwi";
import { CASE } from "@/_redux/services/caseApi";
import { FAN } from "@/_redux/services/fanApi";
import { RAM } from "@/_redux/services/ramApi";
import { SSD } from "@/_redux/services/ssdApi";

type productType = {
  product: Graphic | CPU | POWER | Motherboard | CASE | FAN | RAM | SSD;
  type:
    | "graphics"
    | "powers"
    | "motherboards"
    | "cpus"
    | "cases"
    | "rams"
    | "fans"
    | "ssds";
};

const ComponentCPU = dynamic(() => import("@/_components/single/CpuSingle"), {
  ssr: false,
});
const ComponentMotherboard = dynamic(
  () => import("@/_components/single/MotherboardSingle"),
  { ssr: false },
);
const ComponentGraphicCard = dynamic(
  () => import("@/_components/single/GraphicCardSingle"),
  { ssr: false },
);
const ComponentPower = dynamic(
  () => import("@/_components/single/PowerSingle"),
  { ssr: false },
);
const ComponentCase = dynamic(() => import("@/_components/single/CaseSingle"), {
  ssr: false,
});
const ComponentFan = dynamic(() => import("@/_components/single/FanSingle"), {
  ssr: false,
});
const ComponentRam = dynamic(() => import("@/_components/single/RamSingle"), {
  ssr: false,
});
const ComponentSsd = dynamic(() => import("@/_components/single/SsdSingle"), {
  ssr: false,
});

const ClientPage: FC<productType> = ({ product, type }) => {
  switch (type) {
    case "cpus":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="cpu" />
          <ComponentCPU product={product as CPU} />
        </Container>
      );
    case "motherboards":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="motherboard" />
          <ComponentMotherboard product={product as Motherboard} />
        </Container>
      );
    case "graphics":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="graphic" />
          <ComponentGraphicCard product={product as Graphic} />
        </Container>
      );
    case "powers":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="power" />
          <ComponentPower product={product as POWER} />
        </Container>
      );
    case "cases":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="case" />
          <ComponentCase product={product as CASE} />
        </Container>
      );
    case "fans":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="fan" />
          <ComponentFan product={product as FAN} />
        </Container>
      );
    case "rams":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="ram" />
          <ComponentRam product={product as RAM} />
        </Container>
      );
    case "ssds":
      return (
        <Container
          styles={{ root: { flex: "1 0 auto", width: "100%" } }}
          size={"lg"}
        >
          <BreadCrumbKiwi title={product.name} type="ssd" />
          <ComponentSsd product={product as SSD} />
        </Container>
      );
    default:
      return <h1>No piece match</h1>;
  }
};

export default ClientPage;
