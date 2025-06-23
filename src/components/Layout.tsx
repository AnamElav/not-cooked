export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 p-6">
      <div className="max-w-xl mx-auto space-y-6">{children}</div>
    </div>
  );
}
