import { useState } from "preact/hooks";
import { PhoneNumbersPill } from "./PhoneNumbersPill";
import { getFormattedNumbers } from "../utils/phone-numbers";
import { SendMessageProps } from "../hooks/useBaileysSocket";

export interface MessagerFormProps {
  isReady: boolean;
  onSendMessages: (props: SendMessageProps) => void;
}

export function MessagerForm({ isReady, onSendMessages }: MessagerFormProps) {
  const [validatedNumbers, setValidatedNumbers] = useState<string[]>([]);
  const [numbersString, setNumbersString] = useState<string>("");
  const [messageToSend, setMessageToSend] = useState<string>("");

  const removeNumber = (number: string) => {
    const newNumbers = validatedNumbers.filter((n) => n !== number);
    setValidatedNumbers(newNumbers);
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (clipboardData) {
      const pastedNumbers = clipboardData.getData("text/plain");
      const numbers = getFormattedNumbers(pastedNumbers, validatedNumbers);

      setValidatedNumbers(numbers);
      setNumbersString("");
    }
  };

  const handleNumbersChange = (e: KeyboardEvent) => {
    const numbersString = (e.target as HTMLInputElement).value;
    const submitKeys = ["Enter", "Tab", "NumpadEnter", " ", "Space"];
    const eraseKeys = ["Backspace"];

    setNumbersString(numbersString);
    console.log(validatedNumbers);

    if (submitKeys.includes(e.key) || submitKeys.includes(e.code)) {
      const numbers = getFormattedNumbers(numbersString, validatedNumbers);

      setValidatedNumbers((prev) => [...prev, ...numbers]);
      setNumbersString("");
    }

    if (eraseKeys.includes(e.key) || eraseKeys.includes(e.code)) {
      setValidatedNumbers((prev) => prev.slice(0, validatedNumbers.length - 1));
    }
  };

  const handleSendMessage = () => {
    onSendMessages({
      to: validatedNumbers,
      message: messageToSend,
    });
  };

  return (
    <div className="flex flex-col items-start w-full mt-14">
      <div className="mb-4 prose prose-slate max-w-none">
        <h3 className="mt-0">Disparo de mensagens em massa</h3>
        <p>Insira as informações necessárias e clique em enviar mensagens</p>
      </div>
      <div
        className={`
        w-full max-w-full h-[200px] p-4
        bg-neutral-100
        resize-none content-start
        border border-slate-800 rounded-t-lg
        `}
      >
        <label className="flex flex-wrap items-stretch content-start flex-1 h-full gap-2 overflow-auto cursor-text">
          {validatedNumbers
            ? validatedNumbers.map((number, index) => {
                return (
                  <PhoneNumbersPill
                    removeNumber={removeNumber}
                    number={number}
                    key={index}
                  />
                );
              })
            : null}
          <input
            type="text"
            placeholder={
              validatedNumbers.length
                ? ""
                : "Números separados por vários números, espaço ou quebra de linha"
            }
            value={numbersString}
            onKeyUp={handleNumbersChange}
            onPaste={handlePaste}
            className="flex-1 max-w-full p-1 bg-transparent border-0 outline-none"
          />
        </label>
      </div>
      <textarea
        value={messageToSend}
        onInput={(e: any) => setMessageToSend(e.target?.value)}
        placeholder="Insira a mensagem a ser enviada"
        className={`
          outline-none
          bg-neutral-50
          border border-slate-800 border-opacity-50 border-t-0 shadow-none
          focus:border-opacity-100 focus:shadow-sm focus:border-t focus:-mt-px focus:mb-px
          w-full h-[200px]
          resize-none 
          rounded-b-lg p-4
        `}
      ></textarea>
      <button
        className="px-6 py-3 mt-6 ml-auto font-semibold text-white rounded-lg bg-whatsapp disabled:bg-gray-500"
        disabled={!isReady}
        onClick={handleSendMessage}
      >
        Enviar para todos
      </button>
    </div>
  );
}
