import { useState } from "react";
import { UnstyledButton, Text } from "@mantine/core";
import Image from "next/image";
import classes from "./ads.module.css";

interface Category {
  id: number;
  name: string;
  icon: string;
}

export const UseAdsCategory = (
  categories: Category[],
  onChange?: () => void,
) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const handleClick = (categoryId: number) => {
    setActiveCategory(categoryId);
    onChange?.();
  };

  const items = categories.map((category) => (
    <UnstyledButton
      aria-pressed={activeCategory === category.id}
      className={`${classes.item} ${activeCategory === category.id ? classes.activeItem : ""}`}
      onClick={() => handleClick(category.id)}
      key={category.id}
      type="button"
    >
      <Image width={40} height={40} src={category.icon} alt={category.name} />
      <Text ta={"center"} size="xs" mt={7}>
        {category.name}
      </Text>
    </UnstyledButton>
  ));

  return {
    items,
    activeCategory,
    activeCategoryName: categories.find(
      (category) => category.id === activeCategory,
    )?.name,
  };
};
