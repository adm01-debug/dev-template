import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza o título", () => {
    render(<App />);
    expect(screen.getByText(/Dev Template/i)).toBeInTheDocument();
  });

  it("incrementa o contador ao clicar", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /Cliques/i });
    fireEvent.click(button);
    expect(screen.getByText(/Cliques: 1/i)).toBeInTheDocument();
  });
});
