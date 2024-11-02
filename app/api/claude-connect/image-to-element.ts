import Anthropic from "@anthropic-ai/sdk";

export const ImageToEle = async ({
  ImageUrl,
  textInput,
  apiKey,
}: {
  ImageUrl: string;
  textInput: string;
  apiKey: string | undefined;
}) => {
  console.log("이미지 URL:", ImageUrl);
  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  console.log("init", apiKey);
  const contentObj = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0,
    system:
      "Please analyze the provided image and transform it into a coded implementation using appropriate web technologies (HTML, CSS, SVG) to reproduce the visual output",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: ImageUrl,
            },
          },
        ],
      },
    ],
  });
  console.log("done");
  console.log("결과값", contentObj.content[0]);
  return contentObj.content[0];
};
