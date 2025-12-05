import { render, screen } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Test component that uses the hook
function TestComponent() {
  const [value, setValue] = useLocalStorage("test-key", "initial");
  return (
    <div>
      <span data-testid="value">{value}</span>
      <button onClick={() => setValue("updated")}>Update</button>
    </div>
  );
}

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with default value", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("value").textContent).toBe("initial");
  });

  it("should update value", () => {
    render(<TestComponent />);
    const button = screen.getByRole("button");
    button.click();
    expect(screen.getByTestId("value").textContent).toBe("updated");
  });
});
