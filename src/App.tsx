import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main
      style={{ fontFamily: "system-ui", maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}
    >
      <h1>🚀 Dev Template</h1>
      <p>
        Projeto criado com boas práticas: Vite + React + TypeScript + ESLint + Prettier + Vitest +
        CI.
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Cliques: {count}</button>
    </main>
  );
}
