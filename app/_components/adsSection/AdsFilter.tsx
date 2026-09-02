"use client";

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  MultiSelect,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  convertToEnglishNumber,
  formatNumberWithCommas,
} from "../../_utils/utils";

export interface AdsFilterUpdate {
  category?: string | null;
  ostan?: string[] | null;
  price_from?: string | null;
  price_to?: string | null;
  search?: string | null;
}

interface AdsFilterProps {
  currentProvinces: string[];
  currentSearch: string;
  currentPriceFrom: string;
  currentPriceTo: string;
  onApply: (update: AdsFilterUpdate) => void;
  onApplied?: () => void;
  provinces: Array<{ id: number; name: string }>;
}

function formatPriceInput(value: string): string {
  const digits = convertToEnglishNumber(value).replace(/\D/g, "");
  return digits ? formatNumberWithCommas(digits) : "";
}

export default function AdsFilter({
  currentPriceFrom,
  currentPriceTo,
  currentProvinces,
  currentSearch,
  onApply,
  onApplied,
  provinces,
}: AdsFilterProps) {
  const [search, setSearch] = useState(currentSearch);
  const [priceFrom, setPriceFrom] = useState(
    currentPriceFrom ? formatNumberWithCommas(currentPriceFrom) : "",
  );
  const [priceTo, setPriceTo] = useState(
    currentPriceTo ? formatNumberWithCommas(currentPriceTo) : "",
  );
  const [selectedProvinces, setSelectedProvinces] =
    useState<string[]>(currentProvinces);

  useEffect(() => setSearch(currentSearch), [currentSearch]);
  useEffect(
    () =>
      setPriceFrom(
        currentPriceFrom ? formatNumberWithCommas(currentPriceFrom) : "",
      ),
    [currentPriceFrom],
  );
  useEffect(
    () =>
      setPriceTo(currentPriceTo ? formatNumberWithCommas(currentPriceTo) : ""),
    [currentPriceTo],
  );
  useEffect(
    () => setSelectedProvinces(currentProvinces),
    [currentProvinces.join(",")],
  );

  const apply = (update: AdsFilterUpdate) => {
    onApply(update);
    onApplied?.();
  };

  return (
    <Stack gap="lg">
      <Box>
        <MultiSelect
          clearable
          data={provinces.map((province) => ({
            value: province.id.toString(),
            label: province.name,
          }))}
          label="استان"
          nothingFoundMessage="استانی یافت نشد"
          onChange={setSelectedProvinces}
          placeholder="انتخاب استان"
          searchable
          value={selectedProvinces}
        />
        <Group gap="xs" justify="flex-end" mt="sm">
          <Button
            disabled={
              selectedProvinces.join(",") === currentProvinces.join(",")
            }
            onClick={() => apply({ ostan: selectedProvinces })}
            size="xs"
          >
            اعمال
          </Button>
          {currentProvinces.length > 0 && (
            <Button
              color="gray"
              onClick={() => {
                setSelectedProvinces([]);
                apply({ ostan: null });
              }}
              size="xs"
              variant="subtle"
            >
              حذف
            </Button>
          )}
        </Group>
      </Box>

      <Divider />

      <Box>
        <Text fw={700} fz="sm" mb="xs">
          جستجو در آگهی‌ها
        </Text>
        <TextInput
          leftSection={<IconSearch size={16} />}
          onChange={(event) => setSearch(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              apply({ search: search.trim() || null });
            }
          }}
          placeholder="مثلاً RTX 4070"
          rightSection={
            search ? (
              <ActionIcon
                aria-label="پاک کردن جستجو"
                onClick={() => {
                  setSearch("");
                  apply({ search: null });
                }}
                variant="subtle"
              >
                <IconX size={15} />
              </ActionIcon>
            ) : undefined
          }
          value={search}
        />
        <Button
          fullWidth
          mt="sm"
          onClick={() => apply({ search: search.trim() || null })}
          size="xs"
          variant="light"
        >
          جستجو
        </Button>
      </Box>

      <Divider />

      <Box>
        <Text fw={700} fz="sm" mb="xs">
          محدوده قیمت
        </Text>
        <TextInput
          inputMode="numeric"
          label="از قیمت"
          onChange={(event) =>
            setPriceFrom(formatPriceInput(event.currentTarget.value))
          }
          placeholder="تومان"
          styles={{ input: { direction: "ltr", textAlign: "left" } }}
          value={priceFrom}
        />
        <TextInput
          inputMode="numeric"
          label="تا قیمت"
          mt="xs"
          onChange={(event) =>
            setPriceTo(formatPriceInput(event.currentTarget.value))
          }
          placeholder="تومان"
          styles={{ input: { direction: "ltr", textAlign: "left" } }}
          value={priceTo}
        />
        <Group gap="xs" justify="flex-end" mt="sm">
          <Button
            onClick={() =>
              apply({
                price_from: priceFrom.replace(/,/g, "") || null,
                price_to: priceTo.replace(/,/g, "") || null,
              })
            }
            size="xs"
          >
            اعمال قیمت
          </Button>
          {(currentPriceFrom || currentPriceTo) && (
            <Button
              color="gray"
              onClick={() => {
                setPriceFrom("");
                setPriceTo("");
                apply({ price_from: null, price_to: null });
              }}
              size="xs"
              variant="subtle"
            >
              حذف
            </Button>
          )}
        </Group>
      </Box>
    </Stack>
  );
}
