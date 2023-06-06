import { ChatPostMessageResponse } from "@slack/web-api/dist/response";
const { App } = require("@slack/bolt");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

export async function sendSlackMessage(
  text: string
): Promise<ChatPostMessageResponse> {
  return app.client.chat.postMessage({
    channel: process.env.SLACK_CHANNEL,
    text,
  });
}
