import { useRef, useState } from "preact/hooks";

export interface SendMessageProps {
  to: string[];
  message: string;
}

type SocketEventTypes = "success" | "connected" | "qrcode";

export interface BaileysSocketEvent {
  type: SocketEventTypes;
  data: string;
}

type SocketEventActionRecord = Record<SocketEventTypes, () => void>;

const getWebSocketUrl = () => {
  if (window.location.hostname === "localhost") return "ws://localhost:3000";

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}`;
};

export function useBaileysSocket() {
  const [isReady, setIsReady] = useState(false);
  const socket = useRef(new WebSocket(getWebSocketUrl()));
  console.log("Socket created");
  const [oQRCode, setQRCode] = useState<string>();

  socket.current.addEventListener("open", () => {
    console.log("Connection established");
  });

  socket.current.addEventListener("message", (wsevent) => {
    const event = JSON.parse(wsevent.data) as BaileysSocketEvent;

    const actions: SocketEventActionRecord = {
      success: () => console.log("Message sent!"),
      connected: () => {
        console.log("Ready to send!");
        setIsReady(true);
      },
      qrcode: () => setQRCode(event.data),
    };

    actions[event.type]?.();
  });

  const sendMessage = ({ to, message }: SendMessageProps) => {
    socket.current.send(
      JSON.stringify({
        type: "SEND_BULK",
        data: {
          to,
          message,
        },
      })
    );
  };

  return {
    isReady,
    sendMessage,
    oQRCode,
  };
}
