import { useState } from "react";

type ParsedTask = {
  title: string;
  effort: string;
  time: string;
  steps: string[];
};

export default function TaskInput() {
  const [taskDump, setTaskDump] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: taskDump }),
      });

      const data = await res.json();

      const taskBlocks: ParsedTask[] = data.tasks
        .join("\n")
        .split(/Title:/)
        .filter((block: string) => block.trim().length > 0)
        .map((block: string) => {
          const lines = block
            .trim()
            .split("\n")
            .map((line) => line.trim());

          const title = lines[0] || "Untitled Task";
          const effortLine =
            lines.find((line) => line.startsWith("Effort:")) || "";
          const timeLine = lines.find((line) => line.startsWith("Time:")) || "";
          const stepsStartIndex =
            lines.findIndex((line) => line.startsWith("Steps:")) + 1;

          const effort = effortLine.replace("Effort:", "").trim() || "Unknown";
          const time = timeLine.replace("Time:", "").trim() || "~?? min";

          const steps = lines
            .slice(stepsStartIndex)
            .map((stepLine) => stepLine.replace(/^[-•]\s*/, "").trim())
            .filter((step) => step.length > 0);

          return { title, effort, time, steps };
        });

      setParsedTasks(taskBlocks);
    } catch (err) {
      console.error("Failed to parse tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={taskDump}
        onChange={(e) => setTaskDump(e.target.value)}
        placeholder="Dump your tasks here (e.g., laundry, email professor, study notes)"
        className="w-full p-3 border rounded-lg shadow"
        rows={4}
      />
      <p className="text-xs text-gray-500">
        Try including time, context, or goal (e.g., "watch 45min lecture" →
        better suggestions!)
      </p>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="animate-pulse text-sm">
            🧠 Thinking really hard...
          </span>
        ) : (
          <span>🔍 Break Down Tasks</span>
        )}
      </button>

      {parsedTasks.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">🧠 Broken Down Tasks</h2>

          {parsedTasks.map((task, i) => (
            <div
              key={i}
              className="bg-white border-l-4 border-indigo-500 shadow p-4 rounded-md space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <div className="text-sm text-gray-600">{task.time}</div>
              </div>

              <div className="flex gap-2 text-sm">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    task.effort.toLowerCase() === "low"
                      ? "bg-green-100 text-green-800"
                      : task.effort.toLowerCase() === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Effort: {task.effort}
                </span>
              </div>

              <ul className="list-disc pl-5 space-y-1 text-sm">
                {task.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
