import { Location } from "./api";

export const locations = (process.env.LOCATIONS?.split(",") ||
  []) as unknown as Location[];
