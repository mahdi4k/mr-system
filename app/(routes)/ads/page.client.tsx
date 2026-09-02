"use client";

import type { AdsCategory } from "./page";
import type { AdsFilterUpdate } from "../../_components/adsSection/AdsFilter";
import type { AdsFilters, Product } from "../../_features/ads/types";
import AdsFilter from "../../_components/adsSection/AdsFilter";
import CardPartPrice from "../../_components/shared/CardPartPrice";
import { fetchCity, fetchOstan } from "../../_redux/features/ads";
import { useGetAdsListCategoryQuery } from "../../_redux/services/adsApi";
import type { AppDispatch, RootState } from "../../_redux/store";
import {
  cityTitleHandler,
  formatJalaliTimeAgo,
  formatNumberWithCommas,
  provinceTitleHandler,
} from "../../_utils/utils";
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Drawer,
  Flex,
  Group,
  Menu,
  Pagination,
  Paper,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconChevronDown,
  IconFlag3,
  IconLayoutGrid,
  IconRefresh,
  IconSearchOff,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImgNoProduct from "../../../public/no-product.png";
import classes from "./AdsPage.module.css";

const SORT_OPTIONS = [
  { label: "جدیدترین", value: "created_at" },
  { label: "ارزان‌ترین", value: "price_asc" },
  { label: "گران‌ترین", value: "price_desc" },
];

interface PageClientProps {
  categories: AdsCategory[];
}

function getFirstImage(image?: string): string | null {
  if (!image) return null;
  try {
    const images = JSON.parse(image) as unknown;
    return Array.isArray(images) && typeof images[0] === "string"
      ? images[0]
      : null;
  } catch {
    return null;
  }
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "error" in error) {
    const message = (error as { error?: unknown }).error;
    if (typeof message === "string") return message;
  }
  return "دریافت آگهی‌ها ناموفق بود. دوباره تلاش کنید.";
}

export default function PageClient({ categories }: PageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { ostan, city, status } = useSelector((state: RootState) => state.ads);
  const [filtersOpened, { open: openFilters, close: closeFilters }] =
    useDisclosure(false);

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const currentSort = searchParams.get("sort") || SORT_OPTIONS[0].value;
  const selectedSort =
    SORT_OPTIONS.find(({ value }) => value === currentSort) ?? SORT_OPTIONS[0];
  const provinceFilters = searchParams
    .getAll("ostan")
    .flatMap((value) => value.split(","))
    .filter(Boolean);

  const filters: AdsFilters = {
    page,
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
    price_from: searchParams.get("price_from") || undefined,
    price_to: searchParams.get("price_to") || undefined,
    sort: currentSort,
    ostan: provinceFilters.length ? provinceFilters.join(",") : undefined,
  };

  const { data, error, isError, isFetching, isLoading, refetch } =
    useGetAdsListCategoryQuery(filters);

  useEffect(() => {
    if (!ostan.length && status !== "loading") void dispatch(fetchOstan());
    if (!city.length && status !== "loading") void dispatch(fetchCity());
  }, [city.length, dispatch, ostan.length, status]);

  const navigate = (params: URLSearchParams) => {
    const query = params.toString();
    router.push(query ? `/ads?${query}` : "/ads", { scroll: true });
  };

  const updateFilters = (update: AdsFilterUpdate) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    Object.entries(update).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry));
      } else if (value) {
        params.set(key, value);
      }
    });
    navigate(params);
  };

  const setSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (sort === SORT_OPTIONS[0].value) params.delete("sort");
    else params.set("sort", sort);
    navigate(params);
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage === 1) params.delete("page");
    else params.set("page", String(nextPage));
    navigate(params);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (currentSort !== SORT_OPTIONS[0].value) params.set("sort", currentSort);
    navigate(params);
  };

  const activeFilters = [
    filters.category && {
      key: "category",
      label:
        categories.find(({ value }) => value === filters.category)?.name ||
        filters.category,
    },
    filters.search && { key: "search", label: `جستجو: ${filters.search}` },
    filters.price_from && {
      key: "price_from",
      label: `از ${formatNumberWithCommas(filters.price_from)} تومان`,
    },
    filters.price_to && {
      key: "price_to",
      label: `تا ${formatNumberWithCommas(filters.price_to)} تومان`,
    },
    provinceFilters.length > 0 && {
      key: "ostan",
      label:
        provinceFilters.length === 1
          ? ostan.find(({ id }) => String(id) === provinceFilters[0])?.name ||
            "یک استان"
          : `${provinceFilters.length} استان`,
    },
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  const filterPanel = (
    <AdsFilter
      currentPriceFrom={filters.price_from ?? ""}
      currentPriceTo={filters.price_to ?? ""}
      currentProvinces={provinceFilters}
      currentSearch={filters.search ?? ""}
      onApply={updateFilters}
      onApplied={closeFilters}
      provinces={ostan}
    />
  );

  const currentCategory = filters.category ?? null;

  return (
    <Container className={classes.page} size="lg">
      <Breadcrumbs my="lg">
        <Anchor component={Link} href="/" size="sm">
          خانه
        </Anchor>
        <Text c="dimmed" size="xs">
          آگهی‌ها
        </Text>
      </Breadcrumbs>

      <Flex align="flex-end" justify="space-between" mb="lg" gap="md">
        <Box>
          <Title order={1} size="h2">
            آگهی قطعات کامپیوتر
          </Title>
          <Text c="dimmed" fz="sm" mt={4}>
            {data
              ? `${data.total.toLocaleString("fa-IR")} آگهی`
              : "جستجو و مقایسه قطعات"}
          </Text>
        </Box>
        <Button
          className={classes.mobileFilterButton}
          leftSection={<IconAdjustmentsHorizontal size={18} />}
          onClick={openFilters}
          variant="light"
        >
          فیلترها
          {activeFilters.length > 0 && (
            <Badge circle mr="xs" size="sm">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </Flex>

      <Box hiddenFrom="sm" mb="lg">
        <CategoryGrid
          categories={categories}
          currentCategory={currentCategory}
          onApply={updateFilters}
        />
      </Box>

      <div className={classes.layout}>
        <Paper className={classes.sidebar} p="md" radius="lg" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={700}>فیلترها</Text>
            {activeFilters.length > 0 && (
              <Button
                color="gray"
                onClick={clearAllFilters}
                size="compact-xs"
                variant="subtle"
              >
                پاک کردن همه
              </Button>
            )}
          </Group>
          {filterPanel}
        </Paper>

        <Box className={classes.results}>
          <Flex align="center" justify="space-between" gap="md" mb="md">
            <Group gap="xs" className={classes.filterBadges}>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  rightSection={
                    <IconX
                      aria-label={`حذف فیلتر ${filter.label}`}
                      className={classes.badgeRemove}
                      onClick={() => updateFilters({ [filter.key]: null })}
                      size={12}
                    />
                  }
                  size="lg"
                  variant="light"
                >
                  {filter.label}
                </Badge>
              ))}
            </Group>

            <Menu position="bottom-end" shadow="md" width={160}>
              <Menu.Target>
                <UnstyledButton className={classes.sortControl}>
                  <Text fz="sm" fw={500}>
                    {selectedSort.label}
                  </Text>
                  <IconChevronDown size={16} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {SORT_OPTIONS.map((option) => (
                  <Menu.Item
                    key={option.value}
                    onClick={() => setSort(option.value)}
                  >
                    {option.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Flex>

          {isError ? (
            <Alert
              color="red"
              icon={<IconAlertCircle size={20} />}
              title="آگهی‌ها بارگذاری نشدند"
            >
              <Text fz="sm" mb="md">
                {getErrorMessage(error)}
              </Text>
              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={refetch}
                variant="light"
              >
                تلاش دوباره
              </Button>
            </Alert>
          ) : isLoading ? (
            <AdsGridSkeleton />
          ) : data && data.data.length > 0 ? (
            <>
              <Box pos="relative">
                <SimpleGrid
                  cols={{ base: 2, xs: 2, md: 3 }}
                  spacing={{ base: "xs", md: "md" }}
                  verticalSpacing={{ base: "xs", md: "md" }}
                >
                  {data.data.map((product) => (
                    <AdCard
                      city={city}
                      key={product.id}
                      locationStatus={status}
                      product={product}
                      provinces={ostan}
                    />
                  ))}
                </SimpleGrid>
                {isFetching && <div className={classes.refreshOverlay} />}
              </Box>
              {data.last_page > 1 && (
                <Flex justify="center" mt="xl">
                  <Pagination
                    boundaries={1}
                    onChange={setPage}
                    siblings={1}
                    total={data.last_page}
                    value={Math.min(page, data.last_page)}
                  />
                </Flex>
              )}
            </>
          ) : (
            <Paper className={classes.emptyState} p="xl" radius="lg" withBorder>
              <IconSearchOff size={44} stroke={1.4} />
              <Title order={3} mt="md">
                آگهی‌ای پیدا نشد
              </Title>
              <Text c="dimmed" fz="sm" mt="xs" ta="center">
                فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید.
              </Text>
              {activeFilters.length > 0 && (
                <Button mt="lg" onClick={clearAllFilters} variant="light">
                  حذف همه فیلترها
                </Button>
              )}
            </Paper>
          )}
        </Box>
      </div>

      <Drawer
        opened={filtersOpened}
        onClose={closeFilters}
        padding="md"
        position="bottom"
        size="85%"
        title="فیلتر آگهی‌ها"
      >
        {filterPanel}
      </Drawer>
    </Container>
  );
}

interface CategoryGridProps {
  categories: AdsCategory[];
  currentCategory: string | null;
  onApply: (update: AdsFilterUpdate) => void;
}

function CategoryGrid({
  categories,
  currentCategory,
  onApply,
}: CategoryGridProps) {
  return (
    <SimpleGrid cols={4} spacing="xs" verticalSpacing="xs">
      <UnstyledButton
        className={classes.categoryCell}
        data-active={!currentCategory || undefined}
        onClick={() => onApply({ category: null })}
      >
        <Box className={classes.categoryCellIcon}>
          <IconLayoutGrid size={30} stroke={1.6} />
        </Box>
        <Text className={classes.categoryCellText} component="span">
          همه قطعات
        </Text>
      </UnstyledButton>
      {categories.map((category) => (
        <UnstyledButton
          className={classes.categoryCell}
          data-active={currentCategory === category.value || undefined}
          key={category.id}
          onClick={() => onApply({ category: category.value })}
        >
          <Box className={classes.categoryCellIcon}>
            <Image fill alt={category.name} sizes="50px" src={category.icon} />
          </Box>
          <Text className={classes.categoryCellText} component="span">
            {category.name}
          </Text>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}

function AdsGridSkeleton() {
  return (
    <SimpleGrid
      cols={{ base: 2, xs: 2, md: 3 }}
      spacing={{ base: "xs", md: "md" }}
      verticalSpacing={{ base: "xs", md: "md" }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton className={classes.adCardSkeleton} key={index} radius="lg" />
      ))}
    </SimpleGrid>
  );
}

interface AdCardProps {
  city: Array<{ id: number; name: string }>;
  locationStatus: "idle" | "loading" | "succeeded" | "failed";
  product: Product;
  provinces: Array<{ id: number; name: string }>;
}

function AdCard({ city, locationStatus, product, provinces }: AdCardProps) {
  const image = getFirstImage(product.image);
  return (
    <Card
      className={classes.adCard}
      component={Link}
      href={`/ads/${product.id}`}
      padding="sm"
      radius="lg"
      withBorder
    >
      <Card.Section className={classes.imageSection}>
        <Image
          alt={product.title}
          fill
          sizes="(max-width: 576px) 50vw, (max-width: 992px) 50vw, 33vw"
          src={image || ImgNoProduct}
          style={{ objectFit: image ? "cover" : "contain" }}
        />
      </Card.Section>
      <Text
        fw={600}
        fz={{ base: "sm", md: "md" }}
        lineClamp={2}
        mih={{ base: 40, md: 48 }}
        mt={{ base: "xs", md: "sm" }}
      >
        {product.title}
      </Text>
      <Flex
        align="center"
        justify="space-between"
        mt={{ base: "xs", md: "md" }}
      >
        {product.price ? (
          <CardPartPrice
            isAds
            price={product.price}
            textSize={14}
            tomanHeight={17}
            tomanWidth={17}
          />
        ) : (
          <Text c="teal" fw={600} fz={{ base: "xs", md: "sm" }}>
            توافقی
          </Text>
        )}
        <Text c="dimmed" fz="xs">
          {formatJalaliTimeAgo(product.created_at)}
        </Text>
      </Flex>
      <Group c="dimmed" gap={4} mt={{ base: "xs", md: "sm" }} wrap="nowrap">
        <IconFlag3 size={15} />
        <Text fz="xs" truncate>
          {provinceTitleHandler(locationStatus, product.ostan, provinces)}،{" "}
          {cityTitleHandler(locationStatus, product.city, city)}
        </Text>
      </Group>
    </Card>
  );
}
