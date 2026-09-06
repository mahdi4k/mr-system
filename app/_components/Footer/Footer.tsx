import { Container, Group, Image, Text } from "@mantine/core";
import {
  IconArrowLeft,
  IconBrandTelegram,
  IconCheck,
  IconCpu,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import AppChrome from "../shared/AppChrome";
import classes from "./footer.module.css";

const serviceLinks = [
  { href: "/choose-part", label: "اسمبل آنلاین" },
  { href: "/ads", label: "بازار قطعات" },
  { href: "/ads/create", label: "ثبت آگهی رایگان" },
  { href: "/blog", label: "مقالات و راهنماها" },
];

const categoryLinks = [
  { href: "/category/cpu", label: "پردازنده" },
  { href: "/category/graphic", label: "کارت گرافیک" },
  { href: "/category/motherboard", label: "مادربرد" },
  { href: "/category/ram", label: "حافظه رم" },
  { href: "/category/ssd", label: "حافظه SSD" },
  { href: "/category/power", label: "منبع تغذیه" },
  { href: "/category/case", label: "کیس" },
  { href: "/category/fan", label: "خنک‌کننده" },
];

const accountLinks = [
  { href: "/profile", label: "حساب کاربری" },
  { href: "/profile/ads", label: "آگهی‌های من" },
  { href: "/chat", label: "گفت‌وگوها" },
];

function FooterLinks({
  id,
  links,
  title,
}: {
  id: string;
  links: Array<{ href: string; label: string }>;
  title: string;
}) {
  return (
    <nav aria-labelledby={id} className={classes.linkGroup}>
      <Text className={classes.groupTitle} component="h2" id={id}>
        {title}
      </Text>
      <ul className={classes.linkList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link className={classes.link} href={link.href}>
              <IconArrowLeft aria-hidden size={14} />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear().toLocaleString("fa-IR", {
    useGrouping: false,
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.container} size="lg">
        <AppChrome homeOnly>
          <section aria-labelledby="footer-cta-title" className={classes.cta}>
            <div className={classes.ctaCopy}>
              <Text className={classes.eyebrow}>از انتخاب تا اسمبل</Text>
              <Text
                className={classes.ctaTitle}
                component="h2"
                id="footer-cta-title"
              >
                سیستم بعدی‌ات را هوشمندانه بساز
              </Text>
              <Text className={classes.ctaDescription}>
                قطعات سازگار را کنار هم بچین یا قطعه‌ای که نیاز نداری برای فروش
                آگهی کن.
              </Text>
            </div>
            <Group className={classes.ctaActions} gap="sm">
              <Link className={classes.primaryAction} href="/choose-part">
                <IconCpu aria-hidden size={19} />
                شروع اسمبل آنلاین
              </Link>
              <Link className={classes.secondaryAction} href="/ads/create">
                <IconPlus aria-hidden size={19} />
                ثبت آگهی
              </Link>
            </Group>
          </section>
        </AppChrome>

        <div className={classes.mainGrid}>
          <section
            aria-labelledby="footer-about-title"
            className={classes.brand}
          >
            <Image
              alt="ریگورا"
              className={classes.logo}
              fit="contain"
              h={48}
              src="/logo-dark.png"
              w={104}
            />
            <Text
              className={classes.visuallyHidden}
              component="h2"
              id="footer-about-title"
            >
              درباره ریگورا
            </Text>
            <Text className={classes.description}>
              مرجع انتخاب، مقایسه و خرید و فروش قطعات کامپیوتر؛ برای ساختن یک
              سیستم سازگار با بودجه شما.
            </Text>
            <ul aria-label="امکانات ریگورا" className={classes.benefits}>
              {[
                "مقایسه قیمت قطعات",
                "بررسی سازگاری سیستم",
                "بازار مستقیم کاربران",
              ].map((benefit) => (
                <li key={benefit}>
                  <IconCheck aria-hidden size={14} />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <FooterLinks
            id="footer-services"
            links={serviceLinks}
            title="ریگورا"
          />
          <FooterLinks
            id="footer-categories"
            links={categoryLinks}
            title="دسته‌بندی قطعات"
          />

          <div className={classes.sideColumn}>
            <FooterLinks
              id="footer-account"
              links={accountLinks}
              title="حساب و ارتباطات"
            />
            <div className={classes.support}>
              <Text mb={"sm"} className={classes.supportLabel}>
                پشتیبانی ریگورا
              </Text>
              <a
                aria-label="پشتیبانی ریگورا در تلگرام"
                className={classes.telegramLink}
                href="https://t.me/rigora_official"
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconBrandTelegram aria-hidden size={18} />
                تلگرام پشتیبانی
              </a>
            </div>
          </div>
        </div>

        <div className={classes.bottomBar}>
          <Text>© {currentYear} ریگورا؛ تمامی حقوق محفوظ است.</Text>
          <Text className={classes.bottomMessage}>
            انتخاب دقیق‌تر، سیستم بهتر
          </Text>
        </div>
      </Container>
    </footer>
  );
}
