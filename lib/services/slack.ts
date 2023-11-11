import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_TOKEN;

export async function sendMessage({
  channel,
  text,
  blocks
}: {
  channel: string;
  text: string;
  blocks?: any;
}) {
  const client = new WebClient(token);
  const result = await client.chat.postMessage({
    channel,
    text,
    blocks
  });
  return result;
}
