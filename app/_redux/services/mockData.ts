import { CPU } from "./cpuApi";
import { Graphic } from "./graphicApi";
import { Motherboard } from "./motherboardApi";
import { RAM } from "./ramApi";
import { POWER } from "./powerApi";
import { CASE, IResult } from "./caseApi";
import { FAN } from "./fanApi";
import { SSD } from "./ssdApi";
import { Product, Category, User, ApiResponse } from "./adsApi";

export const mockCpus: CPU[] = [
  {
    id: 1,
    name: "Intel Core i9-13900K",
    cpu_socket: "LGA1700",
    integrated_graphic: "UHD 770",
    manufacturer: "Intel",
    price: "58000000",
    attributes: ["24 cores", "32 threads", "5.8 GHz max boost"],
    image: "/svg/cpu.svg",
    motherboards: [1, 3],
    fans: [1],
    graphics: [1, 2, 3, 4],
    links: "/products/cpu/1",
    brand: "Intel",
    rams: [1, 2, 3],
  },
  {
    id: 2,
    name: "Intel Core i7-13700K",
    cpu_socket: "LGA1700",
    integrated_graphic: "UHD 770",
    manufacturer: "Intel",
    price: "42000000",
    attributes: ["16 cores", "24 threads", "5.4 GHz max boost"],
    image: "/svg/cpu.svg",
    motherboards: [1, 3],
    fans: [1, 2],
    graphics: [1, 2, 3, 4],
    links: "/products/cpu/2",
    brand: "Intel",
    rams: [1, 2, 3],
  },
  {
    id: 3,
    name: "AMD Ryzen 9 7950X",
    cpu_socket: "AM5",
    integrated_graphic: "Radeon Graphics",
    manufacturer: "AMD",
    price: "55000000",
    attributes: ["16 cores", "32 threads", "5.7 GHz max boost"],
    image: "/svg/cpu.svg",
    motherboards: [2, 4],
    fans: [3, 4],
    graphics: [1, 2, 3, 4],
    links: "/products/cpu/3",
    brand: "AMD",
    rams: [1, 2],
  },
  {
    id: 4,
    name: "AMD Ryzen 7 7700X",
    cpu_socket: "AM5",
    integrated_graphic: "Radeon Graphics",
    manufacturer: "AMD",
    price: "38000000",
    attributes: ["8 cores", "16 threads", "5.4 GHz max boost"],
    image: "/svg/cpu.svg",
    motherboards: [2, 4],
    fans: [3, 4],
    graphics: [1, 2, 3, 4],
    links: "/products/cpu/4",
    brand: "AMD",
    rams: [1, 2],
  },
  {
    id: 5,
    name: "Intel Core i5-13600K",
    cpu_socket: "LGA1700",
    integrated_graphic: "UHD 770",
    manufacturer: "Intel",
    price: "32000000",
    attributes: ["14 cores", "20 threads", "5.1 GHz max boost"],
    image: "/svg/cpu.svg",
    motherboards: [1, 3],
    fans: [1, 2, 3],
    graphics: [1, 2, 3, 4],
    links: "/products/cpu/5",
    brand: "Intel",
    rams: [1, 2, 3],
  },
];

export const mockGraphics: Graphic[] = [
  {
    id: 1,
    name: "NVIDIA GeForce RTX 4090",
    manufacturer: "NVIDIA",
    attributes: ["24GB GDDR6X", "16384 CUDA cores", "AD102 GPU"],
    links: "/products/graphic/1",
    type: "Gaming",
    ram: 24,
    image: "/svg/graphic.svg",
    price: "75000000",
    cpus: [],
    brand: "NVIDIA",
    psu: "850W",
    powers: [1],
  },
  {
    id: 2,
    name: "NVIDIA GeForce RTX 4080",
    manufacturer: "NVIDIA",
    attributes: ["16GB GDDR6X", "9728 CUDA cores", "AD103 GPU"],
    links: "/products/graphic/2",
    type: "Gaming",
    ram: 16,
    image: "/svg/graphic.svg",
    price: "55000000",
    cpus: [],
    brand: "NVIDIA",
    psu: "750W",
    powers: [1, 2],
  },
  {
    id: 3,
    name: "AMD Radeon RX 7900 XTX",
    manufacturer: "AMD",
    attributes: ["24GB GDDR6", "12288 Stream processors", "Navi 31"],
    links: "/products/graphic/3",
    type: "Gaming",
    ram: 24,
    image: "/svg/graphic.svg",
    price: "48000000",
    cpus: [],
    brand: "AMD",
    psu: "800W",
    powers: [1, 2],
  },
  {
    id: 4,
    name: "NVIDIA GeForce RTX 4070",
    manufacturer: "NVIDIA",
    attributes: ["12GB GDDR6X", "5888 CUDA cores", "AD104 GPU"],
    links: "/products/graphic/4",
    type: "Gaming",
    ram: 12,
    image: "/svg/graphic.svg",
    price: "35000000",
    cpus: [],
    brand: "NVIDIA",
    psu: "600W",
    powers: [2, 3, 4],
  },
];

export const mockMotherboards: Motherboard[] = [
  {
    id: 1,
    name: "ASUS ROG Maximus Z790 Hero",
    size: "ATX",
    total_slot_ram: 4,
    brand: "ASUS",
    price: "28000000",
    cpu_socket: "LGA1700",
    ddr5: true,
    wifi_support: true,
    links: "/products/motherboard/1",
    image: "/svg/motherboard.svg",
    cpus: [1, 2, 5],
    rams: [1, 2],
    attributes: ["Wi-Fi 7", "Bluetooth 5.4", "Thunderbolt 4"],
  },
  {
    id: 2,
    name: "MSI MPG B650 Edge WiFi",
    size: "ATX",
    total_slot_ram: 4,
    brand: "MSI",
    price: "18000000",
    cpu_socket: "AM5",
    ddr5: true,
    wifi_support: true,
    links: "/products/motherboard/2",
    image: "/svg/motherboard.svg",
    cpus: [3, 4],
    rams: [1, 2],
    attributes: ["Wi-Fi 6E", "2.5G LAN", "PCIe 5.0"],
  },
  {
    id: 3,
    name: "Gigabyte Z790 AORUS ELITE",
    size: "ATX",
    total_slot_ram: 4,
    brand: "Gigabyte",
    price: "22000000",
    cpu_socket: "LGA1700",
    ddr5: true,
    wifi_support: false,
    links: "/products/motherboard/3",
    image: "/svg/motherboard.svg",
    cpus: [1, 2, 5],
    rams: [1, 2, 3],
    attributes: ["2.5G LAN", "PCIe 5.0", "USB 3.2"],
  },
  {
    id: 4,
    name: "ASRock B650 LiveMixer",
    size: "ATX",
    total_slot_ram: 4,
    brand: "ASRock",
    price: "14000000",
    cpu_socket: "AM5",
    ddr5: true,
    wifi_support: true,
    links: "/products/motherboard/4",
    image: "/svg/motherboard.svg",
    cpus: [3, 4],
    rams: [1, 2, 3],
    attributes: ["Wi-Fi 6", "2.5G LAN", "Hyper M.2"],
  },
];

export const mockRams: RAM[] = [
  {
    id: 1,
    name: "Corsair Vengeance DDR5 32GB",
    frequency: "6000MHz",
    brand: "Corsair",
    rgb: true,
    image: "/svg/ram.svg",
    price: "8500000",
    links: "/products/ram/1",
    cpus: [1, 2, 3, 4, 5],
    motherboards: [1, 2, 3, 4],
  },
  {
    id: 2,
    name: "G.Skill Trident Z5 RGB 32GB",
    frequency: "5600MHz",
    brand: "G.Skill",
    rgb: true,
    image: "/svg/ram.svg",
    price: "7800000",
    links: "/products/ram/2",
    cpus: [1, 2, 3, 4, 5],
    motherboards: [1, 2, 3, 4],
  },
  {
    id: 3,
    name: "Kingston Fury Beast 32GB",
    frequency: "5200MHz",
    brand: "Kingston",
    rgb: false,
    image: "/svg/ram.svg",
    price: "6500000",
    links: "/products/ram/3",
    cpus: [1, 2, 5],
    motherboards: [3, 4],
  },
  {
    id: 4,
    name: "TeamGroup T-Force Vulcan Z 16GB",
    frequency: "4800MHz",
    brand: "TeamGroup",
    rgb: false,
    image: "/svg/ram.svg",
    price: "4200000",
    links: "/products/ram/4",
    cpus: [],
    motherboards: [],
  },
];

export const mockPowers: POWER[] = [
  {
    id: 1,
    name: "Corsair RM1000x 1000W",
    attributes: ["80+ Gold", "Full Modular", "135mm Fan"],
    image: "/svg/power.svg",
    price: "12500000",
    links: "/products/power/1",
    graphics: [1, 2, 3],
    brand: "Corsair",
    psu: "1000W",
    modular: 1,
  },
  {
    id: 2,
    name: "Seasonic Focus GX-850",
    attributes: ["80+ Gold", "Full Modular", "120mm Fan"],
    image: "/svg/power.svg",
    price: "9800000",
    links: "/products/power/2",
    graphics: [2, 3, 4],
    brand: "Seasonic",
    psu: "850W",
    modular: 1,
  },
  {
    id: 3,
    name: "Cooler Master MWE Gold 750",
    attributes: ["80+ Gold", "Semi-Modular", "120mm HDB Fan"],
    image: "/svg/power.svg",
    price: "7200000",
    links: "/products/power/3",
    graphics: [4],
    brand: "Cooler Master",
    psu: "750W",
    modular: 0,
  },
  {
    id: 4,
    name: "EVGA SuperNOVA 650 G5",
    attributes: ["80+ Gold", "Full Modular", "139mm Fluid Bearing Fan"],
    image: "/svg/power.svg",
    price: "5800000",
    links: "/products/power/4",
    graphics: [],
    brand: "EVGA",
    psu: "650W",
    modular: 1,
  },
];

export const mockCases: CASE[] = [
  {
    id: 1,
    name: "Lian Li O11 Dynamic",
    max_total_fan: "9",
    brand: "Lian Li",
    form: "Mid Tower",
    rgb: false,
    image: "/svg/case.svg",
    price: "8500000",
    links: "/products/case/1",
  },
  {
    id: 2,
    name: "Corsair 4000D Airflow",
    max_total_fan: "6",
    brand: "Corsair",
    form: "Mid Tower",
    rgb: false,
    image: "/svg/case.svg",
    price: "7200000",
    links: "/products/case/2",
  },
  {
    id: 3,
    name: "NZXT H7 Flow",
    max_total_fan: "7",
    brand: "NZXT",
    form: "Mid Tower",
    rgb: false,
    image: "/svg/case.svg",
    price: "6800000",
    links: "/products/case/3",
  },
  {
    id: 4,
    name: "Cooler Master TD500 Mesh",
    max_total_fan: "7",
    brand: "Cooler Master",
    form: "Mid Tower",
    rgb: true,
    image: "/svg/case.svg",
    price: "6200000",
    links: "/products/case/4",
  },
];

export const mockFans: FAN[] = [
  {
    id: 1,
    name: "Noctua NH-D15",
    fan_noise: "19.2 dBA",
    heat_sink_material: "Aluminum",
    cpu_sockets: "LGA1700, AM5",
    rgb: false,
    image: "/svg/fan.svg",
    price: "5800000",
    links: "/products/fan/1",
    cpus: [1, 2, 5],
    brand: "Noctua",
  },
  {
    id: 2,
    name: "Corsair iCUE H150i Elite",
    fan_noise: "30 dBA",
    heat_sink_material: "Copper",
    cpu_sockets: "LGA1700, AM5",
    rgb: true,
    image: "/svg/fan.svg",
    price: "8500000",
    links: "/products/fan/2",
    cpus: [1, 2, 5],
    brand: "Corsair",
  },
  {
    id: 3,
    name: "Arctic Freezer 34 eSports DUO",
    fan_noise: "22 dBA",
    heat_sink_material: "Aluminum",
    cpu_sockets: "LGA1700, AM5",
    rgb: true,
    image: "/svg/fan.svg",
    price: "3200000",
    links: "/products/fan/3",
    cpus: [3, 4, 5],
    brand: "Arctic",
  },
  {
    id: 4,
    name: "DeepCool AK620",
    fan_noise: "26 dBA",
    heat_sink_material: "Copper",
    cpu_sockets: "LGA1700, AM5",
    rgb: false,
    image: "/svg/fan.svg",
    price: "2800000",
    links: "/products/fan/4",
    cpus: [3, 4],
    brand: "DeepCool",
  },
];

export const mockSsds: SSD[] = [
  {
    id: 1,
    name: "Samsung 990 PRO 2TB",
    size: "2TB",
    brand: "Samsung",
    read: "7450 MB/s",
    write: "6900 MB/s",
    age: "5 سال",
    image: "/svg/ssd.svg",
    form: "M.2",
    price: "6800000",
    links: "/products/ssd/1",
  },
  {
    id: 2,
    name: "WD Black SN850X 2TB",
    size: "2TB",
    brand: "Western Digital",
    read: "7300 MB/s",
    write: "6600 MB/s",
    age: "5 سال",
    image: "/svg/ssd.svg",
    form: "M.2",
    price: "5500000",
    links: "/products/ssd/2",
  },
  {
    id: 3,
    name: "Crucial P5 Plus 1TB",
    size: "1TB",
    brand: "Crucial",
    read: "6600 MB/s",
    write: "5000 MB/s",
    age: "3 سال",
    image: "/svg/ssd.svg",
    form: "M.2",
    price: "2800000",
    links: "/products/ssd/3",
  },
  {
    id: 4,
    name: "Samsung 870 EVO 1TB",
    size: "1TB",
    brand: "Samsung",
    read: "560 MB/s",
    write: "530 MB/s",
    age: "3 سال",
    image: "/svg/ssd.svg",
    form: "2.5-inch",
    price: "1800000",
    links: "/products/ssd/4",
  },
];

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

export const mockIResultCpu: IResult<CPU> = {
  message: "CPU یافت شد",
  data: mockCpus[0],
};

export const mockIResultGraphic: IResult<Graphic> = {
  message: "Graphic یافت شد",
  data: mockGraphics[0],
};

export const mockIResultMotherboard: IResult<Motherboard> = {
  message: "Motherboard یافت شد",
  data: mockMotherboards[0],
};

export const mockIResultRam: IResult<RAM> = {
  message: "RAM یافت شد",
  data: mockRams[0],
};

export const mockIResultPower: IResult<POWER> = {
  message: "Power یافت شد",
  data: mockPowers[0],
};

export const mockIResultCase: IResult<CASE> = {
  message: "Case یافت شد",
  data: mockCases[0],
};

export const mockIResultFan: IResult<FAN> = {
  message: "Fan یافت شد",
  data: mockFans[0],
};

export const mockIResultSsd: IResult<SSD> = {
  message: "SSD یافت شد",
  data: mockSsds[0],
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

export const getMockCpu = (id: string): CPU | undefined => {
  return mockCpus.find((cpu) => cpu.id === parseInt(id));
};

export const getMockCpuByIds = (ids: number[]): CPU[] => {
  return mockCpus.filter((cpu) => ids.includes(cpu.id));
};

export const getMockGraphic = (id: string): Graphic | undefined => {
  return mockGraphics.find((g) => g.id === parseInt(id));
};

export const getMockGraphicByIds = (ids: number[]): Graphic[] => {
  return mockGraphics.filter((g) => ids.includes(g.id));
};

export const getMockMotherboard = (id: string): Motherboard | undefined => {
  return mockMotherboards.find((m) => m.id === parseInt(id));
};

export const getMockMotherboardByIds = (ids: number[]): Motherboard[] => {
  return mockMotherboards.filter((m) => ids.includes(m.id));
};

export const getMockRam = (id: string): RAM | undefined => {
  return mockRams.find((r) => r.id === parseInt(id));
};

export const getMockRamByIds = (ids: number[]): RAM[] => {
  return mockRams.filter((r) => ids.includes(r.id));
};

export const getMockPower = (id: string): POWER | undefined => {
  return mockPowers.find((p) => p.id === parseInt(id));
};

export const getMockPowerByIds = (ids: number[]): POWER[] => {
  return mockPowers.filter((p) => ids.includes(p.id));
};

export const getMockCase = (id: string): CASE | undefined => {
  return mockCases.find((c) => c.id === parseInt(id));
};

export const getMockFan = (id: string): FAN | undefined => {
  return mockFans.find((f) => f.id === parseInt(id));
};

export const getMockFanByIds = (ids: number[]): FAN[] => {
  return mockFans.filter((f) => ids.includes(f.id));
};

export const getMockSsd = (id: string): SSD | undefined => {
  return mockSsds.find((s) => s.id === parseInt(id));
};

export const getMockProduct = (id: string): Product | undefined => {
  return mockProducts.find((p) => p.id === parseInt(id));
};

export const filterMockCpus = (filters: {
  manufacturer?: string[];
  search?: string;
}): CPU[] => {
  let result = mockCpus;
  if (filters.manufacturer && filters.manufacturer.length > 0) {
    result = result.filter((cpu) =>
      filters.manufacturer!.includes(cpu.manufacturer),
    );
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((cpu) =>
      cpu.name.toLowerCase().includes(searchLower),
    );
  }
  return result;
};

export const filterMockGraphics = (filters: {
  manufacturer?: string[];
  search?: string;
}): Graphic[] => {
  let result = mockGraphics;
  if (filters.manufacturer && filters.manufacturer.length > 0) {
    result = result.filter((g) =>
      filters.manufacturer!.includes(g.manufacturer),
    );
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((g) => g.name.toLowerCase().includes(searchLower));
  }
  return result;
};

export const filterMockMotherboards = (filters: {
  manufacturer?: string[];
  search?: string;
}): Motherboard[] => {
  let result = mockMotherboards;
  if (filters.manufacturer && filters.manufacturer.length > 0) {
    result = result.filter((m) => filters.manufacturer!.includes(m.brand));
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((m) => m.name.toLowerCase().includes(searchLower));
  }
  return result;
};

export const filterMockPowers = (filters: {
  modular?: string[];
  eighty_plus?: string[];
  search?: string;
}): POWER[] => {
  let result = mockPowers;
  if (filters.modular && filters.modular.length > 0) {
    result = result.filter((p) => filters.modular!.includes(String(p.modular)));
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(searchLower));
  }
  return result;
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
