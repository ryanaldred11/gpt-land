import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.base_url,
  apiKey: process.env.open_ai_key,
});

const chatHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {role: 'system', content: 'You are a friendly ai pirate'},
];

const getChatCompletion = async (prompt: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      ...chatHistory,
      {role: 'user', content: prompt}
    ],
    model: 'gpt-4o',
    temperature: 0.2,
  });

  chatHistory.push(
    {role: 'user', content: prompt},
    {role: chatCompletion.choices[0].message.role, content: chatCompletion.choices[0].message.content}
  )
  
  return {
    role: chatCompletion.choices[0].message.role,
    content: chatCompletion.choices[0].message.content
  };
}

const prompt = "You: ";
process.stdout.write(prompt);


for await (const line of console) {
  const {role, content} = await getChatCompletion(line);

  console.log(`${role}: ${content}`);

  process.stdout.write(prompt);
}