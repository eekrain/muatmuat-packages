import { Alert } from "@/components/Alert/Alert";

export const EstimatedArrival = ({ label, arrivalTime }) => {
  return (
    <Alert variant="warning" className="mb-2 h-[45px] p-3">
      {/* The entire two-part layout is constructed here and passed as children.
This div is necessary to create the space-between effect.
*/}
      <div className="flex w-full items-center justify-between">
        {/* Left Side: Icon + Label */}
        <p
          className="w-[89px] text-xs font-medium leading-[13.2px] text-neutral-900"
          dangerouslySetInnerHTML={{ __html: label }}
        />

        {/* Right Side: Date/Time */}
        <p className="text-xs font-semibold leading-[13.2px] text-neutral-900">
          {arrivalTime}
        </p>
      </div>
    </Alert>
  );
};
