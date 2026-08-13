import { Alert, Stack, Text } from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";

interface LegacyCatalogLayoutProps {
  children: React.ReactNode;
}

export default function LegacyCatalogLayout({
  children,
}: LegacyCatalogLayoutProps) {
  return (
    <Stack>
      <Alert
        color="orange"
        icon={<IconDatabaseOff size={20} />}
        title="ابزار قدیمی کاتالوگ"
        variant="light"
      >
        <Text fz="sm">
          اطلاعات این بخش از فایل‌های محلی و سرویس‌های نمایشی خوانده می‌شود.
          افزودن، ویرایش و حذف هنوز در Supabase ذخیره نمی‌شود و برای مدیریت
          تولید آماده نیست.
        </Text>
      </Alert>
      {children}
    </Stack>
  );
}
