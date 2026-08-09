import type { ProductCondition } from "@/_data/products/types";
import { Grid } from "@mantine/core";
import React from "react";
import Image from "next/image";
import ProductConditionBadge from "@/_components/shared/ProductConditionBadge";

const SingleProductImage = ({
  product,
}: {
  product: { image: string; name: string; condition?: ProductCondition };
}) => {
  return (
    <>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <ProductConditionBadge condition={product.condition} />
        {product.image && (
          <Image
            alt={product.name}
            width={450}
            height={450}
            sizes="100vw"
            style={{
              width: "100%",
              height: "revert-layer",
              objectFit: "contain",
            }}
            src={product.image}
          />
        )}
      </Grid.Col>
    </>
  );
};

export default SingleProductImage;
