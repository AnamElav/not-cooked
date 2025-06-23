export default async function handler(req, res) {
  const { input } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You help people break vague todo tasks into small actionable steps.",
        },
        {
          role: "user",
          content: `Break down: ${input}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const tasks = data.choices[0].message.content;

  res.status(200).json({ tasks: tasks.split("\n").filter(Boolean) });
}
