import * as functions from "@google-cloud/functions-framework";
import { main } from "./main";

functions.http("helloHttp", async (req, res) => {
  const logs = await main();
  res.json({ logs }).status(200);
});
