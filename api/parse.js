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
              content: `You are a friendly and practical executive function assistant.

Your job is to break vague, high-level to-do items into short, concrete, actionable steps.

Each step should be clear enough that someone could do it in under 5 minutes.

Only output the steps. Do not include any headings, numbers, categories, or bullet points.

Make sure the language feels doable and low-pressure (e.g., use “skim”, “draft”, “open”, “send a quick…”).

Keep each step under 15 words.`,
            },
            {
              role: "user",
              content: `Break this into smaller tasks:\n\n${input}`,
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
