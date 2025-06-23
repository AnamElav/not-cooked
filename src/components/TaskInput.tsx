import { useState } from "react";

export default function TaskInput() {
  const [taskDump, setTaskDump] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<string[]>([]);

  async function handleSubmit() {
    setIsLoading(true);
    const res = await fetch("/api/parse", {
      method: "POST",
      body: JSON.stringify({ input: taskDump }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setParsedTasks(data.tasks);
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <textarea
        value={taskDump}
        onChange={(e) => setTaskDump(e.target.value)}
        placeholder="Dump your tasks here (e.g., laundry, email Alex, study notes)"
        className="w-full p-3 border rounded-lg shadow"
        rows={4}
      />
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {isLoading ? "Thinking..." : "Break Down Tasks"}
      </button>
      {parsedTasks.length > 0 && (
        <ul className="list-disc pl-6">
          {parsedTasks.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
