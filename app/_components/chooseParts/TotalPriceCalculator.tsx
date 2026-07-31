import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  IResult,
  CPU,
  Graphic,
  Motherboard,
  FAN,
  SSD,
  RAM,
  CASE,
  POWER,
} from "@/_redux/services";

interface TotalPriceCalculatorProps {
  cpuData?: IResult<CPU> | undefined;
  graphicData?: IResult<Graphic> | undefined;
  motherboardData?: IResult<Motherboard> | undefined;
  fanData?: IResult<FAN> | undefined;
  ssdData?: IResult<SSD> | undefined;
  ramData?: IResult<RAM> | undefined;
  caseData?: IResult<CASE> | undefined;
  powerData?: IResult<POWER> | undefined;
  setTotalPrice: React.Dispatch<React.SetStateAction<string>>;
}

const TotalPriceCalculator: React.FC<TotalPriceCalculatorProps> = ({
  cpuData,
  graphicData,
  motherboardData,
  fanData,
  ssdData,
  ramData,
  caseData,
  powerData,
  setTotalPrice,
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const newTotalPrice = [
      searchParams.has("cpu") ? Number(cpuData?.data?.price) : 0,
      searchParams.has("graphic") ? Number(graphicData?.data?.price) : 0,
      searchParams.has("motherboard")
        ? Number(motherboardData?.data?.price)
        : 0,
      searchParams.has("fan") ? Number(fanData?.data?.price) : 0,
      searchParams.has("ssd") ? Number(ssdData?.data?.price) : 0,
      searchParams.has("ram") ? Number(ramData?.data?.price) : 0,
      searchParams.has("case") ? Number(caseData?.data?.price) : 0,
      searchParams.has("power") ? Number(powerData?.data?.price) : 0,
    ].reduce((acc, price) => acc + price, 0);

    setTotalPrice(`${newTotalPrice}`);
  }, [
    searchParams,
    cpuData?.data?.price,
    graphicData?.data?.price,
    motherboardData?.data?.price,
    fanData?.data?.price,
    ssdData?.data?.price,
    ramData?.data?.price,
    caseData?.data?.price,
    powerData?.data?.price,
    setTotalPrice,
  ]);

  return null;
};

export default TotalPriceCalculator;
