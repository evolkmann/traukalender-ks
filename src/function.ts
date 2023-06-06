import * as functions from "@google-cloud/functions-framework";
import { DateTime } from "luxon";
import { getLocationName } from "./api";
import { locations } from "./env";
import { main } from "./main";
import { sendSlackMessage } from "./slack";

functions.http("helloHttp", async (req, res) => {
  if (DateTime.local().weekday === 1) {
    const locationNames = locations.map(getLocationName);
    await sendSlackMessage(
      `Ich prüfe weiterhin täglich, ob neue Trautermine in den Locations ${locationNames.join(
        ","
      )} verfügbar sind.`
    );
  }

  const logs = await main();
  res.json({ logs }).status(200);
});
