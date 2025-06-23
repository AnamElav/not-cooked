export default async function handler(req, res) {
  try {
    const { input } = req.body;

    console.log("Received input:", input);

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a productivity assistant that helps break vague to-do lists into clear, short, actionable steps. Do not include explanations or headers — just return a list of steps, one per line",
            },
            {
              role: "user",
              content: input,
            },
          ],
          temperature: 0.6,
          max_tokens: 300,
        }),
      }
    );

    const data = await openaiRes.json();
    console.log("OpenAI response:", data);

    const tasks = data.choices[0].message.content
      .split("\n")
      .map((line) => line.replace(/^[-*\d.]+\s*/, "").trim())
      .filter(Boolean);

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "A server error occurred." });
  }
}
