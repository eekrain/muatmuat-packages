import IconComponent from "../IconComponent/IconComponent";

const Stepper = ({ steps, currentStep }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "inactive";
  };

  return (
    <div className="h-[64px] px-[calc(110px/2-16px)]">
      <div className="relative flex items-start justify-between gap-4">
        {/* Background line */}
        <div className="absolute left-[16px] right-[16px] top-4 z-0 h-0.5 bg-[#C4C4C4]" />

        {/* Active progress line */}
        {currentStep > 0 && (
          <div
            className="absolute left-[16px] top-4 z-10 h-0.5 bg-[#FFC217] transition-all duration-300"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100 - 2}%`,
              maxWidth: "calc(100% - 32px)",
            }}
          />
        )}

        {steps.map((step, index) => {
          const status = getStepStatus(index);

          return (
            <div key={index} className="relative z-20 flex flex-col gap-2">
              {/* Step Circle */}
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                  status === "active"
                    ? "border-[#FFC217] bg-[#FFC217]"
                    : status === "completed"
                      ? "border-[#FFC217] bg-[#FFC217]"
                      : "border-[#C4C4C4] bg-[#F1F1F1]"
                } `}
              >
                <IconComponent
                  src={step.icon}
                  width={16}
                  height={16}
                  className={
                    status !== "inactive"
                      ? "text-muat-trans-primary-900"
                      : "text-neutral-600"
                  }
                />

                {/* Step Label */}
                <div className="absolute -bottom-2 left-1/2 w-[110px] -translate-x-1/2 translate-y-full text-center text-[12px] font-semibold leading-[14.4px] text-[#000000]">
                  {step.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
