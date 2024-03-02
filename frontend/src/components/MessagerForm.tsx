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
    <div className="flex w-full mt-14 flex-col items-start">
      <p className="text-large text-left font-semibold">
        Disparo de mensagens em massa
      </p>
      <p className="text-left">
        Insira as informações necessárias e clique em enviar mensagens
      </p>
      <div className="w-full bg-neutral-100 border-slate-800 border-opacity-50 resize-none h-[200px] content-start mt-6 input-message rounded-t-lg p-4 border max-w-full">
        <label className="flex-1 flex items-start overflow-auto cursor-text gap-2 flex-wrap content-start h-full">
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
            className="flex-1 rounded-t-lg p-1 border-0 max-w-full bg-transparent"
          />
        </label>
      </div>
      <textarea
        value={messageToSend}
        onInput={(e: any) => setMessageToSend(e.target?.value)}
        placeholder="Insira a mensagem a ser enviada"
        className="bg-neutral-50 border-slate-800 border-opacity-50 resize-none w-full h-[200px] rounded-b-lg  border-t-0 p-4 border max-w-full"
      ></textarea>
      <button
        className="bg-[#1B965B] ml-auto hover:bg-blueDark disabled:bg-gray-500 text-white px-6 py-3 rounded-lg mt-6 font-semibold"
        disabled={!isReady}
        onClick={handleSendMessage}
      >
        Enviar para todos
      </button>
    </div>
  );
}
