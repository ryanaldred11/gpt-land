import OpenAI from "openai";
import type { ChatCompletionTool } from "openai/resources/index.mjs";

const getCurrentWeather = (location: string) => {
  console.log(`getting the weather for ${location}.....`);
}

const openai = new OpenAI({
  baseURL: process.env.base_url,
  apiKey: process.env.open_ai_key,
});

const chatHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {role: 'system', content: 'You are a friendly ai chatbot that helps people look up the weather'},
  {role: 'user', content: 'Whats teh weather like in Las Vegas?'},
];

const weatherFunctionSignature: ChatCompletionTool = {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "get the current weather",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state. ex: Vancouver, BC"
          },
        },
        required: ["location"],
      }
    }
  };

const tools = [
  weatherFunctionSignature
];

const chatCompletion = await openai.chat.completions.create({
  messages: [
    ...chatHistory
  ],
  tools: tools,
  model: 'gpt-4o',
  temperature: 0.2,
});

if (
  chatCompletion.choices &&
  chatCompletion.choices[0].message.tool_calls &&
  chatCompletion.choices[0].message.tool_calls[0].function.name === 'getCurrentWeather'
) {
  getCurrentWeather(
    JSON.parse(
      chatCompletion.choices[0].message.tool_calls[0]?.function.arguments
    ).location
  );
} else {
  console.log(chatCompletion.choices[0].message);
}