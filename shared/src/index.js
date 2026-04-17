export const ROLES = {
  ADMIN: "ADMIN",
  TRAINER: "TRAINER",
  CUSTOMER: "CUSTOMER"
};

export const BOOKING_STATUS = {
  BOOKED: "BOOKED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED"
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  REFUNDED: "REFUNDED"
};

export const SESSION_DURATION_MINUTES = 60;

export const NAV_LINKS = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "Antrenörler", path: "/antrenorler" },
  { label: "Paketler", path: "/paketler" },
  { label: "Rezervasyon", path: "/rezervasyon" },
  { label: "İletişim", path: "/iletisim" }
];
