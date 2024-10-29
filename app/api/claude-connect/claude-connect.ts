import Anthropic from "@anthropic-ai/sdk";

export const claudeConnect = async ({
  ImageUrl,
  textInput,
}: {
  ImageUrl: string;
  textInput: string;
}) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0,
    system: "Analyze the image and change it into a published deliverable.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: ImageUrl,
            },
          },
          {
            type: "text",
            text: textInput,
          },
        ],
      },
    ],
  });
  console.log(msg);
};
