import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "./Skeleton";

export interface QRCodeBlockProps {
  oQRCode?: string;
  done?: boolean;
}

export function QRCodeBlock({ oQRCode, done = false }: QRCodeBlockProps) {
  if (oQRCode) {
    if (done) {
      return (
        <div className="flex items-center justify-center rounded-lg size-64 aspect-square bg-zinc-400">
          <FontAwesomeIcon
            className="absolute bg-white rounded-full text-whatsapp"
            icon={faCheckCircle}
            size="10x"
          />
          <QRCodeSVG className="size-full" value={oQRCode} level="H" />
        </div>
      );
    }

    return (
      <QRCodeSVG className="rounded-lg size-64" value={oQRCode} level="H" />
    );
  }

  return (
    <Skeleton className="flex items-center self-center justify-center font-medium text-gray-500 rounded-lg size-64 aspect-square">
      Carregando...
    </Skeleton>
  );
}
