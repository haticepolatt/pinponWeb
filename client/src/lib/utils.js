export const cn = (...values) => values.filter(Boolean).join(" ");

export const currency = (amount) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export const getWeekRange = () => {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 14);
  return { from: start.toISOString(), to: end.toISOString() };
};
