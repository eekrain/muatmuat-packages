import { useEffect } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import RadioButton from "@/components/Radio/RadioButton";
import FilterResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FilterResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

const StatusFilterScreen = ({
  onChangeQueryParams,
  statusRadioOptions,
  isFiltering,
  setFilterType,
  selectedOption,
  setSelectedOption,
}) => {
  const navigation = useResponsiveNavigation();

  useEffect(() => {
    if (!isFiltering) {
      navigation.pop();
    }
  }, [isFiltering]);

  const handleSubmit = () => {
    onChangeQueryParams(selectedOption.name, selectedOption.value);
    setFilterType("radio");
    navigation.pop();
  };
  return (
    <FilterResponsiveLayout>
      <div className="min-h-[calc(100vh-140px)] overflow-y-auto px-4 py-5 pb-[84px]">
        {statusRadioOptions.map((option, key) => (
          <div className="flex flex-col gap-y-4" key={key}>
            <h4 className="text-sm font-semibold leading-[1.1] text-neutral-900">
              {option.label}
            </h4>
            <div className="flex flex-col gap-y-3">
              {option.children.map((child, index) => (
                <div
                  className={cn(
                    option.children.length - 1 === index
                      ? ""
                      : "border-b border-b-neutral-400 pb-3"
                  )}
                  key={index}
                >
                  <RadioButton
                    label={child.label}
                    checked={selectedOption?.value === child.value}
                    value={child.value}
                    onClick={({ value }) =>
                      setSelectedOption({
                        name: option.key,
                        value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ResponsiveFooter className="flex gap-x-2 bg-[#FCFCFC]">
        <Button
          variant="muatparts-primary-secondary"
          className="h-10 w-full"
          onClick={() => setSelectedOption(null)}
          type="button"
        >
          Reset
        </Button>
        <Button
          variant="muatparts-primary"
          className="h-10 w-full"
          onClick={handleSubmit}
          type="button"
        >
          Simpan
        </Button>
      </ResponsiveFooter>
    </FilterResponsiveLayout>
  );
};

export default StatusFilterScreen;
