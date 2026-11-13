// Dates anyone reads are written out British style, "5th of October 1990", so nobody has to guess
// which number is the month. Takes the stored YYYY-MM-DD form; anything else is returned untouched.

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
};

export function britishDate(iso: string | null | undefined): string {
  const m = (iso ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso ?? "";
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${ordinal(Number(m[3]))} of ${month} ${m[1]}` : iso ?? "";
}
