export const toISODate = (date = new Date()) => {
  if (!(date instanceof Date)) {
    return '';
  }
  return date.toISOString().slice(0, 10);
};

export const addDaysISO = (days = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const isOnOrAfter = (dateStr, compareStr) => {
  if (!dateStr || !compareStr) return false;
  return dateStr >= compareStr;
};

export const toReadableDate = (isoDate) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}-${m}-${y}`;
};
