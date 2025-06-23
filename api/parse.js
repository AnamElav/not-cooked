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
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a task simplification assistant designed for people with ADHD and executive dysfunction.

Take a vague to-do list and break each task into:
- a clear title
- an estimated effort level (low/medium/high)
- estimated time to complete (in minutes)
- 2–4 specific, small actionable steps to get started

Use this format for each task:

Title: [Short, actionable title]  
Effort: [Low / Medium / High]  
Time: [~X min]  
Steps:
- Step 1
- Step 2
- Step 3

Only include the task breakdowns — no commentary or intros.

For each task step, offer guidance on how to approach it if relevant.

Example 1:
Instead of "Take notes", say:
"Write down 3 key takeaways and 2 questions you still have."

Example 2:
Instead of "Write email to X", generate a template for the email.`,
            },
            {
              role: "user",
              content: `Break this into small, doable task plans:\n\n${input}`,
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
