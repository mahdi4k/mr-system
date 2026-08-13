import { createClient } from "../../_lib/supabase/server";
import {
  Badge,
  Box,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAd,
  IconCircleCheck,
  IconClock,
  IconExternalLink,
  IconMessageCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import classes from "./dashboard.module.css";

interface RecentAd {
  created_at: string;
  id: string;
  status: "pending" | "published" | "sold" | "archived" | "rejected";
  title: string;
  user: { display_name: string | null };
}

const statusConfig = {
  pending: { color: "orange", label: "در انتظار بررسی" },
  published: { color: "green", label: "منتشرشده" },
  rejected: { color: "red", label: "ردشده" },
  sold: { color: "blue", label: "فروخته‌شده" },
  archived: { color: "gray", label: "بایگانی" },
} as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const [allAds, pendingAds, publishedAds, recentAds] = await Promise.all([
    supabase.from("ads").select("id", { count: "exact", head: true }),
    supabase
      .from("ads")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("ads")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("ads")
      .select(
        "id, title, status, created_at, user:profiles!ads_user_id_fkey(display_name)",
      )
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const stats = [
    {
      color: "green",
      icon: IconAd,
      label: "کل آگهی‌ها",
      value: allAds.count ?? 0,
    },
    {
      color: "orange",
      icon: IconClock,
      label: "نیازمند بررسی",
      value: pendingAds.count ?? 0,
    },
    {
      color: "teal",
      icon: IconCircleCheck,
      label: "منتشرشده",
      value: publishedAds.count ?? 0,
    },
  ];

  return (
    <Stack gap="lg">
      <Group align="flex-end" justify="space-between">
        <div>
          <Text c="dimmed" fz="sm" fw={600}>
            مرکز عملیات
          </Text>
          <Title order={1} size="h2">
            نمای کلی مدیریت
          </Title>
          <Text c="dimmed" fz="sm" mt={4}>
            وضعیت بازار و صف بررسی آگهی‌ها
          </Text>
        </div>
        <Link className={classes.primaryAction} href="/dashboard/ads">
          <IconAd size={18} />
          مدیریت آگهی‌ها
        </Link>
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
        {stats.map((stat) => (
          <Card key={stat.label} padding="lg" radius="lg" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" fz="sm">
                  {stat.label}
                </Text>
                <Text fw={800} fz={30} mt={4}>
                  {stat.value.toLocaleString("fa-IR")}
                </Text>
              </div>
              <ThemeIcon
                color={stat.color}
                radius="lg"
                size={48}
                variant="light"
              >
                <stat.icon size={25} />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 3 }}>
        <Paper className={classes.recentPanel} p="lg" radius="lg" withBorder>
          <Group justify="space-between" mb="md">
            <div>
              <Title order={2} size="h4">
                آخرین آگهی‌ها
              </Title>
              <Text c="dimmed" fz="xs">
                جدیدترین موارد ثبت‌شده در بازار
              </Text>
            </div>
            <Link className={classes.subtleAction} href="/dashboard/ads">
              مشاهده همه
              <IconExternalLink size={15} />
            </Link>
          </Group>

          {(recentAds.data ?? []).length ? (
            <Box className={classes.tableScroll}>
              <Table highlightOnHover miw={620} verticalSpacing="sm">
                <TableThead>
                  <TableTr>
                    <TableTh>آگهی</TableTh>
                    <TableTh>کاربر</TableTh>
                    <TableTh>وضعیت</TableTh>
                    <TableTh>تاریخ</TableTh>
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {((recentAds.data ?? []) as unknown as RecentAd[]).map(
                    (ad) => (
                      <TableTr key={ad.id}>
                        <TableTd>
                          <Text fw={600} fz="sm" lineClamp={1} maw={260}>
                            {ad.title}
                          </Text>
                        </TableTd>
                        <TableTd>
                          {ad.user.display_name || "کاربر ریگورا"}
                        </TableTd>
                        <TableTd>
                          <Badge
                            color={statusConfig[ad.status].color}
                            variant="light"
                          >
                            {statusConfig[ad.status].label}
                          </Badge>
                        </TableTd>
                        <TableTd>
                          {new Intl.DateTimeFormat("fa-IR").format(
                            new Date(ad.created_at),
                          )}
                        </TableTd>
                      </TableTr>
                    ),
                  )}
                </TableTbody>
              </Table>
            </Box>
          ) : (
            <Text c="dimmed" fz="sm" py="xl" ta="center">
              هنوز آگهی‌ای ثبت نشده است.
            </Text>
          )}
        </Paper>

        <Card padding="lg" radius="lg" withBorder>
          <ThemeIcon color="blue" radius="lg" size={45} variant="light">
            <IconMessageCircle size={24} />
          </ThemeIcon>
          <Title order={3} size="h4" mt="md">
            گفت‌وگوهای کاربران
          </Title>
          <Text c="dimmed" fz="sm" lh={1.8} mt="xs">
            مدیران به محتوای خصوصی گفت‌وگوها دسترسی ندارند. این بخش فقط برای
            ورود به تجربه عمومی پیام‌هاست.
          </Text>
          <Link className={classes.lightAction} href="/chat">
            مشاهده گفت‌وگوهای خودم
          </Link>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
