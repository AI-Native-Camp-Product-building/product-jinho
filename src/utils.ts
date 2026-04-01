import { randomBytes } from "crypto";

export function randomId(): string {
  return randomBytes(4).toString("hex");
}

export function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 8);
}
