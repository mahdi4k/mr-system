export type PartSort = "recommended" | "price-asc" | "price-desc";

interface FilterablePart {
  name: string;
  price?: string;
}

const getPrice = (item: FilterablePart): number | undefined => {
  const price = Number(item.price);
  return item.price?.trim() && Number.isFinite(price) && price > 0
    ? price
    : undefined;
};

export const filterAndSortParts = <T extends FilterablePart>(
  items: T[],
  search: string,
  sort: PartSort,
  isRecommended: (item: T) => boolean,
): T[] => {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredItems = normalizedSearch
    ? items.filter((item) =>
        item.name.toLocaleLowerCase().includes(normalizedSearch),
      )
    : items;

  return [...filteredItems].sort((first, second) => {
    if (sort === "recommended") {
      return Number(isRecommended(second)) - Number(isRecommended(first));
    }

    const firstPrice = getPrice(first);
    const secondPrice = getPrice(second);
    if (firstPrice === undefined) return secondPrice === undefined ? 0 : 1;
    if (secondPrice === undefined) return -1;

    return sort === "price-asc"
      ? firstPrice - secondPrice
      : secondPrice - firstPrice;
  });
};
