import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PhoneNumbersPillProps {
  key: any;
  number: string;
  removeNumber: (number: string) => void;
}
export function PhoneNumbersPill({
  key,
  number,
  removeNumber,
}: PhoneNumbersPillProps) {
  return (
    <div
      key={key}
      class="numbertag shadow-md max-h-[40px] py-2 flex bg-stone-200 pl-3 pr-3  rounded-lg max-w-[200px]"
    >
      <p>{number}</p>
      <FontAwesomeIcon
        className="cursor-pointer m-auto ml-2 text-[10px]"
        icon={faX}
        onClick={() => removeNumber(number)}
      />
    </div>
  );
}
