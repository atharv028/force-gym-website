import { addDays } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const IST = "Asia/Kolkata";

export function getIstNow(): Date {
  return toZonedTime(new Date(), IST);
}

export function getAttendanceDateForConfig(nowUtc: Date, closingHour: number): string {
  const zoned = toZonedTime(nowUtc, IST);
  const hour = Number(formatInTimeZone(zoned, IST, "H"));
  const day = hour <= closingHour ? zoned : addDays(zoned, -1);
  return formatInTimeZone(day, IST, "yyyy-MM-dd");
}

export function formatIstTime(dateIso: string | null): string | null {
  if (!dateIso) return null;
  return formatInTimeZone(new Date(dateIso), IST, "hh:mm a");
}

export function toDurationLabel(minutes: number | null): string {
  if (!minutes || minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
