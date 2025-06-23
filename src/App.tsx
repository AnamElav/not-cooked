import Layout from "./components/Layout";
import TaskInput from "./components/TaskInput";

function App() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center">🧠 Focus Companion</h1>
      <TaskInput />
    </Layout>
  );
}

export default App;
