import { useEffect, useState } from 'react';
import { UnstyledButton, Text } from '@mantine/core';
import Image from "next/image";
import classes from './ads.module.css';

interface Category {
  id: number;
  name: string;
  icon: string;
}

export const UseAdsCategory = () => {
  const [categoriesAds, setCategoriesAds] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/categories');
      const data: Category[] = await response.json();
      setCategoriesAds(data);
    };
    fetchCategories();
  }, []);

  const handleClick = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  const items = categoriesAds.map((category) => (
    <UnstyledButton
      className={`${classes.item} ${activeCategory === category.id ? classes.activeItem : ''}`}
      onClick={() => handleClick(category.id)}
      key={category.id} // Use category.id as a unique key
    >
      <Image width={40} height={40} src={category.icon} alt={category.name} />
      <Text size="xs" mt={7}>
        {category.name}
      </Text>
    </UnstyledButton>
  ));

  return { items, activeCategory };
};
