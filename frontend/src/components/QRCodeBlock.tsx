import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "./Skeleton";

export interface QRCodeBlockProps {
  oQRCode?: string;
  done?: boolean;
}

export function QRCodeBlock({ oQRCode, done }: QRCodeBlockProps) {
  if (oQRCode) {
    if (done) {
      return (
        <div className="size-64  bg-zinc-400 rounded-lg flex items-center justify-center">
          <FontAwesomeIcon
            className="text-whatsapp absolute bg-white rounded-full"
            icon={faCheckCircle}
            size="10x"
          />
          <QRCodeSVG className="size-full" value={oQRCode} level="H" />
        </div>
      );
    }

    return (
      <QRCodeSVG className="size-64 rounded-lg" value={oQRCode} level="H" />
    );
  }

  return (
    <Skeleton className="flex items-center self-center justify-center font-medium text-gray-500 rounded-lg size-64 aspect-square">
      Carregando...
    </Skeleton>
  );
}
