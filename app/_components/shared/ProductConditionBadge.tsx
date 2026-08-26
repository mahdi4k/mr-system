import type { ProductCondition } from "@/_data/products/types";
import { Badge } from "@mantine/core";

interface ProductConditionBadgeProps {
  condition?: ProductCondition;
  className?: string;
}

const ProductConditionBadge = ({
  condition,
  className,
}: ProductConditionBadgeProps) => {
  if (condition !== "used") return null;

  return (
    <Badge
      color="orange"
      radius="sm"
      size="sm"
      variant="filled"
      className={className}
    >
      کارکرده
    </Badge>
  );
};

export default ProductConditionBadge;
