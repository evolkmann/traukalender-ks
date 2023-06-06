import { DateTime } from "luxon";
import {
  getLocationName,
  isValidLocation,
  isValidMonth,
  Location,
  queryApi,
  Tooltip,
} from "./api";
import { sendSlackMessage } from "./slack";

export async function main(): Promise<string[]> {
  const logs: string[] = [];
  let anyAppointmentsFound = false;

  const year = +(process.env.YEAR || "2024");
  if (typeof year !== "number") {
    throw new Error("YEAR must be a number");
  }
  const monthMin = +(process.env.MONTH_MIN || "1");
  if (!isValidMonth(monthMin)) {
    throw new Error("MONTH_MIN must be a number");
  }
  const monthMax = +(process.env.MONTH_MAX || "12");
  if (!isValidMonth(monthMax)) {
    throw new Error("MONTH_MAX must be a number");
  }
  const locations = process.env.LOCATIONS?.split(",") || [];

  for (const location of locations) {
    if (!isValidLocation(location)) {
      throw new Error(
        `Invalid location: ${location}, must be one of ${Object.values(
          Location
        ).join(", ")}`
      );
    }
    const locationName = getLocationName(location) as string;
    log(`Querying location ${locationName}...`, logs);

    for (let month = monthMin; month <= monthMax; month++) {
      log(`For month ${year}-${month.toString().padStart(2, "0")}:`, logs);
      const response = await queryApi({ location, month, year });
      let appointmentInMonthFound = false;
      for (const day of response.data.tooltips) {
        if (day.text === Tooltip.APPOINTMENTS) {
          log(`--> Found appointment in ${locationName} on ${day.date}`, logs);
          appointmentInMonthFound = true;
          anyAppointmentsFound = true;
        }
      }
      if (!appointmentInMonthFound) {
        log(`--> No appointments`, logs);
      }
    }
  }

  if (anyAppointmentsFound) {
    await sendSlackMessage(`Es gibt freie Termine!\n\n${logs.join("\n")}`);
    log("Sent Slack notification", []);
  }

  return logs;
}

function log(message: string, logs: string[]): void {
  const msg = `[${DateTime.local().toFormat(
    "yyyy-MM-dd HH:mm:ss"
  )}] ${message}`;
  logs.push(msg);
  console.log(msg);
}
