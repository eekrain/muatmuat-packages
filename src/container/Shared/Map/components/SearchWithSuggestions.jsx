import { useState } from "react";

import { X } from "lucide-react";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import { SearchSuggestions } from "./SearchSuggestions";

export const SearchWithSuggestions = ({
  placeholder = "Cari No. Polisi / Nama Driver",
  onSearch,
  containerClassName,
  inputClassName,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      if (searchValue.length > 2 || searchValue === "") {
        onSearch?.(searchValue);
      }
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setShowSuggestions(false);
    onSearch?.("");
  };

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion) {
      // Use the display text for the input field
      const searchText = suggestion.displayText;
      setSearchValue(searchText);
      setShowSuggestions(false);
      // Pass the full suggestion data to parent, including originalData
      onSearch?.(suggestion);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (searchValue.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        type="text"
        placeholder={t(
          "SearchWithSuggestions.searchPlaceholder",
          {},
          placeholder
        )}
        value={searchValue}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        icon={{
          left: <IconComponent src="/icons/datatable-search.svg" width={12} />,
          right:
            searchValue.length > 0 ? (
              <button
                onClick={handleClear}
                className="flex items-center justify-center rounded-full p-0.5 hover:bg-neutral-200"
              >
                <X className="h-3 w-3 text-neutral-600" />
              </button>
            ) : null,
        }}
        appearance={{
          containerClassName: cn("h-8", inputClassName),
          inputClassName: "text-xs font-medium mt-0",
        }}
      />
      <SearchSuggestions
        isOpen={showSuggestions}
        searchValue={searchValue}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
};
