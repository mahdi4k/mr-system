import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const sql = neon(databaseUrl);

const products = [
  {
    legacyId: 1,
    slug: "intel-core-i3-12100f",
    type: "cpu",
    name: "Intel Core i3-12100F",
    brand: "Intel",
    aliases: ["i3 12100f", "i3-12100f", "core i3 12100f"],
    specifications: {
      socket: "LGA1700",
      generation: 12,
      integratedGraphic: false,
    },
    compatibility: {
      motherboards: [1],
      graphics: [1, 2],
      fans: [1, 2],
      rams: [1],
    },
    image: "/svg/cpu.svg",
  },
  {
    legacyId: 2,
    slug: "amd-ryzen-5-7600",
    type: "cpu",
    name: "AMD Ryzen 5 7600",
    brand: "AMD",
    aliases: ["ryzen 5 7600", "r5 7600"],
    specifications: {
      socket: "AM5",
      generation: 7000,
      integratedGraphic: true,
    },
    compatibility: {
      motherboards: [2],
      graphics: [1, 2],
      fans: [1, 2],
      rams: [2],
    },
    image: "/svg/cpu.svg",
  },
  {
    legacyId: 1,
    slug: "asus-prime-b660m-a-d4",
    type: "motherboard",
    name: "ASUS Prime B660M-A D4",
    brand: "ASUS",
    aliases: ["prime b660m-a d4", "asus b660m a d4"],
    specifications: {
      socket: "LGA1700",
      chipset: "B660",
      memoryType: "DDR4",
      form: "Micro-ATX",
    },
    compatibility: { cpus: [1], rams: [1] },
    image: "/svg/motherboard.svg",
  },
  {
    legacyId: 2,
    slug: "msi-mpg-b650-edge-wifi",
    type: "motherboard",
    name: "MSI MPG B650 Edge WiFi",
    brand: "MSI",
    aliases: ["mpg b650 edge wifi", "msi b650 edge"],
    specifications: {
      socket: "AM5",
      chipset: "B650",
      memoryType: "DDR5",
      form: "ATX",
    },
    compatibility: { cpus: [2], rams: [2] },
    image: "/svg/motherboard.svg",
  },
  {
    legacyId: 1,
    slug: "nvidia-geforce-rtx-4060",
    type: "graphic",
    name: "NVIDIA GeForce RTX 4060",
    brand: "NVIDIA",
    aliases: ["rtx 4060", "geforce 4060"],
    specifications: {
      memory: "8GB GDDR6",
      recommendedPsu: 550,
      interface: "PCIe 4.0",
    },
    compatibility: { cpus: [1, 2], powers: [1, 2] },
    image: "/svg/graphic.svg",
  },
  {
    legacyId: 2,
    slug: "amd-radeon-rx-7600",
    type: "graphic",
    name: "AMD Radeon RX 7600",
    brand: "AMD",
    aliases: ["rx 7600", "radeon 7600"],
    specifications: {
      memory: "8GB GDDR6",
      recommendedPsu: 550,
      interface: "PCIe 4.0",
    },
    compatibility: { cpus: [1, 2], powers: [1, 2] },
    image: "/svg/graphic.svg",
  },
  {
    legacyId: 1,
    slug: "corsair-rm650-650w",
    type: "power",
    name: "Corsair RM650 650W",
    brand: "Corsair",
    aliases: ["corsair rm650", "rm650 650w"],
    specifications: { wattage: 650, efficiency: "80+ Gold", modular: true },
    compatibility: { graphics: [1, 2] },
    image: "/svg/power.svg",
  },
  {
    legacyId: 2,
    slug: "seasonic-focus-gx-750",
    type: "power",
    name: "Seasonic Focus GX-750",
    brand: "Seasonic",
    aliases: ["focus gx-750", "seasonic gx750"],
    specifications: { wattage: 750, efficiency: "80+ Gold", modular: true },
    compatibility: { graphics: [1, 2] },
    image: "/svg/power.svg",
  },
  {
    legacyId: 1,
    slug: "noctua-nh-d15",
    type: "fan",
    name: "Noctua NH-D15",
    brand: "Noctua",
    aliases: ["nh-d15", "noctua d15"],
    specifications: {
      sockets: ["LGA1700", "AM5"],
      noise: "24.6 dBA",
      rgb: false,
    },
    compatibility: { cpus: [1, 2] },
    image: "/svg/fan.svg",
  },
  {
    legacyId: 2,
    slug: "deepcool-ak620",
    type: "fan",
    name: "DeepCool AK620",
    brand: "DeepCool",
    aliases: ["ak620", "deepcool ak 620"],
    specifications: {
      sockets: ["LGA1700", "AM5"],
      noise: "28 dBA",
      rgb: false,
    },
    compatibility: { cpus: [1, 2] },
    image: "/svg/fan.svg",
  },
  {
    legacyId: 1,
    slug: "kingston-fury-beast-ddr4-16gb",
    type: "ram",
    name: "Kingston Fury Beast DDR4 16GB",
    brand: "Kingston",
    aliases: ["fury beast ddr4 16gb", "kingston 16gb ddr4"],
    specifications: {
      memoryType: "DDR4",
      capacity: "16GB",
      frequency: "3200MHz",
      rgb: false,
    },
    compatibility: { cpus: [1], motherboards: [1] },
    image: "/svg/ram.svg",
  },
  {
    legacyId: 2,
    slug: "corsair-vengeance-ddr5-32gb",
    type: "ram",
    name: "Corsair Vengeance DDR5 32GB",
    brand: "Corsair",
    aliases: ["vengeance ddr5 32gb", "corsair 32gb ddr5"],
    specifications: {
      memoryType: "DDR5",
      capacity: "32GB",
      frequency: "6000MHz",
      rgb: false,
    },
    compatibility: { cpus: [2], motherboards: [2] },
    image: "/svg/ram.svg",
  },
  {
    legacyId: 1,
    slug: "samsung-990-pro-2tb",
    type: "ssd",
    name: "Samsung 990 PRO 2TB",
    brand: "Samsung",
    aliases: ["990 pro 2tb", "samsung 990pro 2tb"],
    specifications: {
      capacity: "2TB",
      form: "M.2",
      interface: "PCIe 4.0",
      read: "7450 MB/s",
    },
    compatibility: {},
    image: "/svg/ssd.svg",
  },
  {
    legacyId: 2,
    slug: "wd-black-sn850x-2tb",
    type: "ssd",
    name: "WD Black SN850X 2TB",
    brand: "Western Digital",
    aliases: ["sn850x 2tb", "wd black sn850x"],
    specifications: {
      capacity: "2TB",
      form: "M.2",
      interface: "PCIe 4.0",
      read: "7300 MB/s",
    },
    compatibility: {},
    image: "/svg/ssd.svg",
  },
  {
    legacyId: 1,
    slug: "lian-li-o11-dynamic",
    type: "case",
    name: "Lian Li O11 Dynamic",
    brand: "Lian Li",
    aliases: ["o11 dynamic", "lian li o11"],
    specifications: { form: "Mid Tower", maxFans: 9, rgb: false },
    compatibility: {},
    image: "/svg/case.svg",
  },
  {
    legacyId: 2,
    slug: "corsair-4000d-airflow",
    type: "case",
    name: "Corsair 4000D Airflow",
    brand: "Corsair",
    aliases: ["4000d airflow", "corsair 4000d"],
    specifications: { form: "Mid Tower", maxFans: 6, rgb: false },
    compatibility: {},
    image: "/svg/case.svg",
  },
];

await sql`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('cpu', 'motherboard', 'graphic', 'power', 'fan', 'ram', 'ssd', 'case')),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    aliases JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    compatibility JSONB NOT NULL DEFAULT '{}'::jsonb,
    image TEXT NOT NULL,
    price INTEGER,
    links JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (type, legacy_id)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS product_offers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    external_id TEXT NOT NULL,
    title TEXT NOT NULL,
    price INTEGER,
    image TEXT,
    url TEXT NOT NULL,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (source, external_id)
  )
`;

for (const product of products) {
  await sql`
    INSERT INTO products (
      legacy_id,
      slug,
      type,
      name,
      brand,
      aliases,
      specifications,
      compatibility,
      image
    ) VALUES (
      ${product.legacyId},
      ${product.slug},
      ${product.type},
      ${product.name},
      ${product.brand},
      ${JSON.stringify(product.aliases)}::jsonb,
      ${JSON.stringify(product.specifications)}::jsonb,
      ${JSON.stringify(product.compatibility)}::jsonb,
      ${product.image}
    )
    ON CONFLICT (slug) DO UPDATE SET
      legacy_id = EXCLUDED.legacy_id,
      type = EXCLUDED.type,
      name = EXCLUDED.name,
      brand = EXCLUDED.brand,
      aliases = EXCLUDED.aliases,
      specifications = EXCLUDED.specifications,
      compatibility = EXCLUDED.compatibility,
      image = EXCLUDED.image,
      updated_at = now()
  `;
}

console.log(`Seeded ${products.length} products.`);
