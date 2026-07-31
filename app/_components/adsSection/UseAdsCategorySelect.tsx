import { useEffect, useState } from "react";
import { UnstyledButton, Text } from "@mantine/core";
import Image from "next/image";
import classes from "./ads.module.css";

interface Category {
  id: number;
  name: string;
  icon: string;
}

const mockCategoriesAds: Category[] = [
  { id: 1, name: "پردازنده", icon: "/svg/cpu.svg" },
  { id: 2, name: "کارت گرافیک", icon: "/svg/graphic.svg" },
  { id: 3, name: "مادربرد", icon: "/svg/motherboard.svg" },
  { id: 4, name: "حافظه رم", icon: "/svg/ram.svg" },
  { id: 5, name: "منبع تغذیه", icon: "/svg/power.svg" },
  { id: 6, name: "کیس", icon: "/svg/case.svg" },
  { id: 7, name: "خنک‌کننده", icon: "/svg/fan.svg" },
  { id: 8, name: "حافظه SSD", icon: "/svg/ssd.svg" },
];

export const UseAdsCategory = () => {
  const [categoriesAds, setCategoriesAds] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    setCategoriesAds(mockCategoriesAds);
  }, []);

  const handleClick = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  const items = categoriesAds.map((category) => (
    <UnstyledButton
      className={`${classes.item} ${activeCategory === category.id ? classes.activeItem : ""}`}
      onClick={() => handleClick(category.id)}
      key={category.id}
    >
      <Image width={40} height={40} src={category.icon} alt={category.name} />
      <Text ta={"center"} size="xs" mt={7}>
        {category.name}
      </Text>
    </UnstyledButton>
  ));

  return { items, activeCategory };
};
