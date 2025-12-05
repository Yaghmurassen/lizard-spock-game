import { render, screen } from "@testing-library/react";
import { ChatComponent } from "@/components/ChatComponent";
import { SocketProvider } from "@/contexts/SocketContext";

// Mock the socket hook
jest.mock("@/hooks/useSocket", () => ({
  useSocket: () => ({
    socket: null,
    isConnected: false,
  }),
}));

describe("ChatComponent", () => {
  it("should render chat interface", () => {
    render(
      <SocketProvider>
        <ChatComponent />
      </SocketProvider>
    );

    expect(screen.getByPlaceholderText("Type a message...")).toBeTruthy();
    expect(screen.getByText("Send")).toBeTruthy();
  });

  it("should show disconnected status", () => {
    render(
      <SocketProvider>
        <ChatComponent />
      </SocketProvider>
    );

    expect(screen.getByText("Disconnected")).toBeTruthy();
  });
});
