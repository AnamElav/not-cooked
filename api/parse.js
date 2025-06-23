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
            "You are a productivity assistant that helps break vague to-do lists into clear, short, actionable steps. Do not include explanations or headers — just return a list of steps, one per line.",
        },
        {
          role: "user",
          content: `Break this into smaller tasks:\n\n${input}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  const tasks = content
    .split("\n")
    .map((line) => line.replace(/^[-*\d.]+\s*/, "").trim())
    .filter(Boolean);

  res.status(200).json({ tasks: tasks.split("\n").filter(Boolean) });
}
