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

Your job is to break each vague task into:
- A short, clear, motivating title
- An estimated effort level (Low / Medium / High)
- An estimated time range to complete (in minutes)
- 2–5 specific, *mentally helpful* steps to get started

The output must follow this format exactly:

Title: [Short, action-oriented title]  
Effort: [Low / Medium / High]  
Time: [~X min]  
Steps:
- Step 1
- Step 2
...

⛔️ Skip obvious or frictionless steps such as:
- “Turn on device”
- “Open browser”
- “Collect emails”
- “Gather materials”
- “Get out notebook”
- “Click submit”

✅ Focus instead on cognitive or emotional friction points:
- Planning what to say
- Structuring ideas
- Knowing where to begin
- Identifying blockers
- Reducing overwhelm

🧠 For each step, give just enough guidance that the user *knows how to start*. If the task involves writing or communication, generate a brief outline or draft.

💬 Example transformation:
Instead of “Write email to professor”, say:
“Write 2–3 sentences explaining your issue. Use this draft: ‘Hi Professor, I’m struggling with...’”

Instead of “Take notes”, say:
“Write 3 takeaways + 1 question you had during the lecture.”

Only output the task breakdowns. No commentary or headings.`,
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
