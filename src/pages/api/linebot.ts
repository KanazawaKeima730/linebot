import { NextApiRequest, NextApiResponse } from "next";
import linebot from "linebot";
import axios from "axios";

const bot = linebot({
  channelId: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
  channelSecret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const signature = req.headers["x-line-signature"] as string;
    const events = req.body.events;

    if (!bot.verify(req.body as string, signature)) {
      res.status(400).json({ error: "Invalid signature" });
      return;
    }

    events.forEach(async (event: any) => {
      const userMessage = event.message.text;
      const prompt = `User: ${userMessage}\nAssistant:`;

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/engines/davinci-codex/completions",
          {
            prompt,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.5,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
          }
        );

        const replyText = response.data.choices[0].text.trim();
        await bot.replyMessage(event.replyToken, {
          type: "text",
          text: replyText,
        });
      } catch (error) {
        console.error("Error while sending reply:", error);
      }
    });

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
