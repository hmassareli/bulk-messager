import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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

  // TODO: Use skeleton class instead of animate-pulse
  return (
    <div className="size-64 animate-pulse bg-zinc-400 text-white rounded-lg flex items-center justify-center">
      Carregando QR Code...
    </div>
  );
}
