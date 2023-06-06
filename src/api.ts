import { DateTime } from "luxon";

export enum Location {
  RATHAUS = "628",
  PLANETARIUM = "668",
  GRIMMWELT = "824",
  RENTHOF_BIBLIOTHEK = "876",
}

export function isValidLocation(location?: string): location is Location {
  return Object.values(Location).includes(location as Location);
}

export function getLocationName(
  location: Location
): keyof Location | undefined {
  for (const key in Location) {
    if (Location[key as keyof typeof Location] === location) {
      return key as keyof Location;
    }
  }
}

export function isValidMonth(
  month?: number
): month is 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 {
  return month !== undefined && month >= 1 && month <= 12;
}

export enum Tooltip {
  NO_APPOINTMENTS = "tooltip_keine_termine",
  APPOINTMENTS = "tooltip_buchbar",
}

export interface ApiResponse {
  /**
   * @format yyyy-MM-dd
   */
  appointments: string[];
  /**
   * @format yyyy-MM-dd
   */
  holidays: string[];
  hints: unknown[];
  tooltips: {
    /**
     * @format yyyy-MM-dd
     */
    date: string;
    text: Tooltip;
  }[];
}

export interface RequestConfig {
  location: Location;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
}

export function makeUrl(config: RequestConfig): string {
  const url = new URL(
    "/traukalender/common/ajax.php",
    "https://traukalender.kassel.de"
  );
  const min = DateTime.local().set({ year: config.year }).startOf("year");
  const max = DateTime.local().set({ year: config.year }).endOf("year");
  url.searchParams.set("bereich", "portal");
  url.searchParams.set("modul_id", "101");
  url.searchParams.set("klasse", "tko_buergeransicht");
  url.searchParams.set("com", "ermitteln_termindaten");
  url.searchParams.set("ortsverwaltung", "0");
  url.searchParams.set("sprache", "de");
  url.searchParams.set("texte", "undefined");
  url.searchParams.set("trauort", config.location);
  url.searchParams.set("monat", `${config.month}`);
  url.searchParams.set("jahr", `${config.year}`);
  url.searchParams.set("min", min.toFormat("yyyy-MM-dd"));
  url.searchParams.set("max", max.toFormat("yyyy-MM-dd"));
  return url.toString();
}

export async function queryApi(config: RequestConfig): Promise<{
  data: ApiResponse;
  config: RequestConfig;
  url: string;
}> {
  const url = makeUrl(config);
  const res = await fetch(url);
  const data = await res.json();
  return {
    config,
    data,
    url,
  };
}
