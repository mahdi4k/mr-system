import type { ProductCondition } from "@/_data/products/types";
import { Badge } from "@mantine/core";

interface ProductConditionBadgeProps {
  condition?: ProductCondition;
}

const ProductConditionBadge = ({ condition }: ProductConditionBadgeProps) => {
  if (condition !== "used") return null;

  return (
    <Badge color="orange" radius="sm" size="sm" variant="filled">
      کارکرده
    </Badge>
  );
};

export default ProductConditionBadge;
