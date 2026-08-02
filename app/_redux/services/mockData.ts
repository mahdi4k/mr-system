import { IResult } from "./caseApi";
import { Product, Category, User, ApiResponse } from "./adsApi";

const mockAdCategories: Category[] = [
  { id: 1, name: "پردازنده (CPU)", value: "cpu", icon: "cpu" },
  { id: 2, name: "کارت گرافیک (GPU)", value: "graphic", icon: "gpu" },
  { id: 3, name: "مادربرد", value: "motherboard", icon: "motherboard" },
  { id: 4, name: "حافظه رم (RAM)", value: "ram", icon: "ram" },
  { id: 5, name: "منبع تغذیه (Power)", value: "power", icon: "power" },
  { id: 6, name: "کیس (Case)", value: "case", icon: "case" },
  { id: 7, name: "خنک‌کننده (Cooler)", value: "fan", icon: "cooler" },
  { id: 8, name: "حافظه SSD", value: "ssd", icon: "ssd" },
];

export { mockAdCategories };

const mockUsers: User[] = [
  { id: 1, name: "کاربر تست", username: "test_user", phone: "09123456789" },
  { id: 2, name: "فروشنده ۱", username: "seller_user", phone: "09123456790" },
];

const mockProducts: Product[] = [
  {
    id: 1,
    title: "کامپیوتر گیمینگ حرفه‌ای",
    description: "سیستم گیمینگ قدرتمند با آخرین نسل سخت‌افزار",
    category: mockAdCategories[0],
    user: mockUsers[0],
    image: '["/svg/cpu.svg"]',
    price: "45000000",
    created_at: "2024-01-15T10:30:00Z",
    status: "active",
    city: "تهران",
    ostan: "1",
  },
  {
    id: 2,
    title: "سیستم اداری",
    description: "کامپیوتر مناسب برای کارهای اداری و روزانه",
    category: mockAdCategories[1],
    user: mockUsers[1],
    image: '["/svg/graphic.svg"]',
    price: "15000000",
    created_at: "2024-01-14T14:20:00Z",
    status: "active",
    city: "اصفهان",
    ostan: "4",
  },
  {
    id: 3,
    title: "کارت گرافیک NVIDIA RTX 4070",
    description: "کارت گرافیک نو و پلمپ",
    category: mockAdCategories[1],
    user: mockUsers[1],
    image: '["/svg/graphic.svg"]',
    price: "35000000",
    created_at: "2024-01-13T09:15:00Z",
    status: "active",
    city: "تهران",
    ostan: "1",
  },
  {
    id: 4,
    title: "پردازنده Intel Core i9",
    description: "پردازنده نو و اوریجینال",
    category: mockAdCategories[0],
    user: mockUsers[0],
    image: '["/svg/cpu.svg"]',
    price: "58000000",
    created_at: "2024-01-12T16:45:00Z",
    status: "active",
    city: "تبریز",
    ostan: "3",
  },
  {
    id: 5,
    title: "مادربرد ASUS ROG",
    description: "مادربرد گیمینگ ASUS ROG Z790",
    category: mockAdCategories[2],
    user: mockUsers[1],
    image: '["/svg/motherboard.svg"]',
    price: "28000000",
    created_at: "2024-01-11T11:30:00Z",
    status: "pending",
    city: "مشهد",
    ostan: "2",
  },
  {
    id: 6,
    title: "حافظه رم 32GB DDR5",
    description: "رم Corsair Vengeance 32GB DDR5 6000MHz",
    category: mockAdCategories[3],
    user: mockUsers[0],
    image: '["/svg/ram.svg"]',
    price: "8500000",
    created_at: "2024-01-10T13:00:00Z",
    status: "active",
    city: "تهران",
    ostan: "1",
  },
];

export const mockApiResponse: ApiResponse = {
  data: mockProducts,
  current_page: 1,
  last_page: 3,
  per_page: 6,
  total: 18,
};

export const mockIResultProduct: IResult<Product> = {
  message: "Product یافت شد",
  data: mockProducts[0],
};

export type featuredmedia = {
  id: number;
  link: string;
  mime_type: string;
};

export type postsMO = {
  title: { rendered: string };
  excerpt: { rendered: string };
  id: string;
  date: string;
  slug: string;
  content: { rendered: string };
  _embedded: { "wp:featuredmedia": featuredmedia[] };
};

export const mockBlogPosts: postsMO[] = [
  {
    id: "1",
    title: { rendered: "راهنمای خرید پردازنده (CPU) برای گیمینگ" },
    excerpt: {
      rendered:
        "<p>در این مقاله به بررسی نکات مهم در خرید پردازنده برای بازی می‌پردازیم...</p>",
    },
    date: "2024-01-15T10:30:00Z",
    slug: "cpu-gaming-guide",
    content: {
      rendered: `
                <h2>مقدمه</h2>
                <p>انتخاب پردازنده مناسب برای گیمینگ یکی از مهم‌ترین تصمیمات در مونتاژ یک سیستم گیمینگ است.</p>
                
                <h2>Intel یا AMD؟</h2>
                <p>هر دو برند مزایا و معایب خود را دارند. اینتل عملکرد تک هسته‌ای بهتری ارائه می‌دهد، در حالی که AMD ارزش بهتری برای پول دارد.</p>
                
                <h3>پیشنهادات ما</h3>
                <ul>
                    <li>Intel Core i9-13900K برای سیستم‌های بالا رده</li>
                    <li>Intel Core i7-13700K برای سیستم‌های میان رده</li>
                    <li>AMD Ryzen 9 7950X برای کاربران AMD</li>
                    <li>AMD Ryzen 7 7700X به عنوان بهترین انتخاب ارزشی</li>
                </ul>
                
                <h2>نکات مهم</h2>
                <p>قبل از خرید مطمئن شوید که مادربرد شما سوکت مناسب را پشتیبانی می‌کند.</p>
            `,
    },
    _embedded: {
      "wp:featuredmedia": [
        {
          id: 1,
          link: "/svg/article.svg",
          mime_type: "image/jpeg",
        },
      ],
    },
  },
  {
    id: "2",
    title: { rendered: "مقایسه کارت‌های گرافیک NVIDIA و AMD" },
    excerpt: {
      rendered: "<p>کدام برند کارت گرافیک را انتخاب کنیم؟ بررسی کامل...</p>",
    },
    date: "2024-01-14T14:20:00Z",
    slug: "nvidia-vs-amd-gpu",
    content: {
      rendered: `
                <h2>NVIDIA RTX 4000 Series</h2>
                <p>نسل جدید کارت‌های گرافیک انویدیا با معماری Ada Lovelace عملکرد فوق‌العاده‌ای ارائه می‌دهند.</p>
                
                <h2>AMD RX 7000 Series</h2>
                <p>کارت‌های گرافیک AMD با معماری RDNA 3 رقیب سرسختی برای انویدیا هستند.</p>
                
                <h3>نتیجه‌گیری</h3>
                <p>برای رزولوشن 4K و ray tracing، NVIDIA انتخاب بهتری است. برای رزولوشن 1440p، AMD ارزش بهتری دارد.</p>
            `,
    },
    _embedded: {
      "wp:featuredmedia": [
        {
          id: 2,
          link: "/svg/article.svg",
          mime_type: "image/jpeg",
        },
      ],
    },
  },
  {
    id: "3",
    title: { rendered: "آموزش اسمبل کردن کامپیوتر" },
    excerpt: {
      rendered: "<p>راهنمای گام به گام مونتاژ سیستم کامپیوتری...</p>",
    },
    date: "2024-01-13T09:15:00Z",
    slug: "how-to-build-pc",
    content: {
      rendered: `
                <h2>مرحله 1: آماده‌سازی</h2>
                <p>قبل از شروع مطمئن شوید که تمام قطعات را دارید و فضای کافی برای کار دارید.</p>
                
                <h2>مرحله 2: نصب پردازنده</h2>
                <p>پردازنده را با دقت در سوکت قرار دهید. توجه کنید که پین‌ها خم نشوند.</p>
                
                <h2>مرحله 3: نصب خنک‌کننده</h2>
                <p>خمیر حرارتی را به مقدار مناسب روی پردازنده بمالید.</p>
                
                <h2>مرحله 4: نصب رم</h2>
                <p>رم‌ها را در اسلات‌های صحیح نصب کنید.</p>
            `,
    },
    _embedded: {
      "wp:featuredmedia": [
        {
          id: 3,
          link: "/svg/article.svg",
          mime_type: "image/jpeg",
        },
      ],
    },
  },
  {
    id: "4",
    title: { rendered: "بهترین رم‌های DDR5 برای گیمینگ" },
    excerpt: {
      rendered: "<p>بررسی بهترین حافظه‌های DDR5 موجود در بازار...</p>",
    },
    date: "2024-01-12T11:00:00Z",
    slug: "best-ddr5-ram",
    content: {
      rendered: `
                <h2>مزایای DDR5</h2>
                <p>رم‌های DDR5 سرعت بالاتر و مصرف انرژی کمتری نسبت به DDR4 دارند.</p>
                
                <h2>بهترین انتخاب‌ها</h2>
                <ul>
                    <li>Corsair Vengeance 32GB 6000MHz</li>
                    <li>G.Skill Trident Z5 RGB 32GB 5600MHz</li>
                    <li>Kingston Fury Beast 32GB 5200MHz</li>
                </ul>
            `,
    },
    _embedded: {
      "wp:featuredmedia": [
        {
          id: 4,
          link: "/svg/article.svg",
          mime_type: "image/jpeg",
        },
      ],
    },
  },
];

export type categoriesMO = {
  id: string;
  slug: string;
  name: string;
};

export const mockBlogCategories: categoriesMO[] = [
  { id: "1", slug: "hardware", name: "سخت‌افزار" },
  { id: "2", slug: "gaming", name: "گیمینگ" },
  { id: "3", slug: "guide", name: "راهنما" },
  { id: "4", slug: "news", name: "اخبار" },
];

export const getMockProduct = (id: string): Product | undefined => {
  return mockProducts.find((p) => p.id === parseInt(id));
};

export const filterMockProducts = (filters: {
  category?: string;
  search?: string;
  price_from?: string;
  price_to?: string;
  page?: string;
  ostan?: string;
}): ApiResponse => {
  let result = [...mockProducts];

  if (filters.category) {
    result = result.filter((p) =>
      p.category.name.toLowerCase().includes(filters.category!.toLowerCase()),
    );
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(searchLower));
  }
  if (filters.price_from) {
    result = result.filter(
      (p) => parseInt(p.price) >= parseInt(filters.price_from!),
    );
  }
  if (filters.price_to) {
    result = result.filter(
      (p) => parseInt(p.price) <= parseInt(filters.price_to!),
    );
  }

  return {
    data: result,
    current_page: 1,
    last_page: Math.ceil(result.length / 6),
    per_page: 6,
    total: result.length,
  };
};
