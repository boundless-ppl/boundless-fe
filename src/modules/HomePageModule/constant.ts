export const FEATURES = [
    {
      title: "Scholarship & Funding Matcher",
      description: "Get matched with scholarships based on your background and goals.",
      image: "/card.png"
    },
    {
      title: "Step-by-Step Preparation Roadmap", 
      description: "Know exactly what to do, from research to money management.",
      image: "/card2.png"
    },
    {
      title: "Cultural & Religious Fit Finder",
      description: "Discover universities that support your values, needs, and lifestyle.",
      image: "/card3.png"
    }
  ];

export const featureSteps = [
  {
    title: "Generate QR Code",
    description: "Merchants create payment QR codes instantly with custom amounts and preferred currencies.",
    bgColor: "bg-blue-500",
    illustration: "/GENERATE_QR_ILLUST.png"
  },
  {
    title: "Customer Scans & Pays",
    description: "Customers scan the QR code and choose to pay with crypto or fiat through their preferred wallet.",
    bgColor: "bg-green-500",
    illustration: "/SCAN_PAY_ILLUST.png"
  },
  {
    title: "Instant Settlement",
    description: "Payments are processed immediately with real-time confirmation and automatic currency conversion.",
    bgColor: "bg-purple-500",
    illustration: "/SETTLEMENT_ILLUST.png"
  },
  {
    title: "Easy Cash Out",
    description: "Merchants can withdraw earnings to their bank account or keep them as cryptocurrency.",
    bgColor: "bg-orange-500",
    illustration: "/CASH_OUT_ILLUST.png"
  }
];

export const PRICES = [
  {
    name: "Basic",
    price: "$19/month",
    features: [
      "Access to basic scholarship matches",
      "Standard preparation roadmap",
      "Limited cultural fit insights",
      "Email support"
    ] 
  },
]

export const FEATURES_NEW = [
  {
    icon: "🤖",
    title: "Unlimited GlobalMatch AI Access",
    description: "Get unlimited AI-powered university matching and recommendations tailored to your profile.",
  },
  {
    icon: "📋",
    title: "Document Verification Dashboard",
    description: "Upload and verify all your important documents in one secure place.",
  },
  {
    icon: "⚡",
    title: "Bulk University Form Filler",
    description: "Fill out application forms for multiple universities at once. Save hours of work.",
  },
];

export const PLAN_FEATURES = [
  "Unlimited GlobalMatch AI",
  "Dashboard verifikasi dokumen",
  "Bulk form filler universitas",
  "Akses semua fitur baru",
];

export const PRICING_PLANS = [
  {
    name: "1 Bulan",
    price: "Rp 79.000",
    subtext: "per bulan · Rp 79.000/bulan",
    buttonText: "Pilih Paket",
    highlight: false,
    checkColor: "#4479B2",
  },
  {
    name: "3 Bulan",
    price: "Rp 199.000",
    subtext: "per 3 bulan · Rp 66.333/bulan",
    buttonText: "Mulai Sekarang",
    highlight: true, // Untuk kartu "Populer"
    badge: "Populer",
    discount: "Hemat 16%",
    checkColor: "#FA8613",
  },
  {
    name: "1 Tahun",
    price: "Rp 699.000",
    subtext: "per tahun · Rp 58.250/bulan",
    buttonText: "Pilih Paket",
    highlight: false,
    badge: "Terbaik",
    discount: "Hemat 26%",
    checkColor: "#4479B2",
  },
];
