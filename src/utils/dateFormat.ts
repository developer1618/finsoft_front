const pad = (segment: string, length = 2) => segment.padStart(length, "0");

export const displayToIsoDate = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s/g, "");
  const parts = normalized.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [day, month, year] = parts;
  if (!day || !month || !year || year.length !== 4) {
    return null;
  }

  return `${year}-${pad(month)}-${pad(day)}`;
};

export const isoToDisplayDate = (value?: string): string => {
  if (!value) {
    return "";
  }

  if (value.includes(".")) {
    return value;
  }

  const [datePart] = value.split("T");
  if (!datePart) {
    return value;
  }

  const parts = datePart.split("-");
  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return value;
  }

  return `${pad(day)}.${pad(month)}.${year}`;
};

export const normalizeToIsoDate = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  if (value.includes("-")) {
    const [isoPart] = value.split("T");
    return isoPart ?? null;
  }

  return displayToIsoDate(value);
};

export const applyDateMask = (value?: string): string => {
  if (!value) {
    return "";
  }

  const digits = value.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  let masked = "";

  if (day) {
    masked = day.length === 2 ? `${day}.` : day;
  }

  if (month) {
    masked += month.length === 2 ? `${month}.` : month;
  }

  if (year) {
    masked += year;
  }

  return masked;
};
