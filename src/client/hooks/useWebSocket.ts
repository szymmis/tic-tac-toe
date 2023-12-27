import { createRef, useEffect } from "react";

const socket = createRef() as React.MutableRefObject<WebSocket>;

export default function useWebSocket<T = unknown>(options: {
  hostname: string;
  port: number;
  onOpen?: () => void;
  onMessage?: (msg: T) => void;
  onError?: () => void;
  onClose?: () => void;
}) {
  const { hostname, port, onOpen, onMessage, onError, onClose } = options;

  const send = (message: unknown) =>
    socket.current?.send(JSON.stringify(message));

  useEffect(() => {
    const messageHandler = (e: MessageEvent) => {
      try {
        onMessage?.(JSON.parse(e.data));
      } catch (e) {
        console.error(e);
      }
    };

    if (!socket.current) {
      socket.current = new WebSocket(`ws://${hostname}:${port}`);

      socket.current.addEventListener("open", () => onOpen?.());
      socket.current.addEventListener("error", () => onError?.());
      socket.current.addEventListener("close", () => onClose?.());
    }

    socket.current.addEventListener("message", messageHandler);
    () => socket.current.removeEventListener("message", messageHandler);
  }, []);

  return {
    send,
  };
}
