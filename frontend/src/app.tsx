import { MessagerForm } from "./components/MessagerForm";
import { useBaileysSocket } from "./hooks/useBaileysSocket";
import { QRCodeBlock } from "./components/QRCodeBlock";
import { ContextMenuIcon } from "./components/svg-icons/context-menu-icon";
import { ConfigIcon } from "./components/svg-icons/config-icon";

export function App() {
  const { isReady, sendMessage, oQRCode } = useBaileysSocket();

  return (
    <div className="bg-gradient-to-b from-whatsapp from-15% to-15% to-slate-100 pt-20 pb-24">
      <div className="container m-auto bg-white rounded-md shadow-lg p-14">
        <div className="flex flex-col items-center justify-between w-full m-auto prose prose-slate max-w-none md:flex-row">
          <div>
            <p>Abra o WhatsApp no seu celular.</p>
            <p>
              Toque em <strong>Mais opções</strong> <ContextMenuIcon /> no
              Android ou em <strong>Configurações</strong> <ConfigIcon /> no
              iPhone
            </p>
            <p>
              Toque em <strong>Dispositivos conectados</strong> e, em seguida,
              em <strong>Conectar um dispositivo</strong>.
            </p>
            <p>Aponte seu celular para esta tela para capturar o QR code.</p>
          </div>

          <QRCodeBlock oQRCode={oQRCode} />
        </div>

        <MessagerForm isReady={isReady} onSendMessages={sendMessage} />
      </div>
    </div>
  );
}
