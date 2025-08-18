"use client";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import TransporterConfirmationModals from "@/app/cs/(main)/user/components/TransporterConfirmationModals";
import TransporterEmptyStates from "@/app/cs/(main)/user/components/TransporterEmptyStates";
import TransporterSearchAndFilter from "@/app/cs/(main)/user/components/TransporterSearchAndFilter";
import TransporterTable from "@/app/cs/(main)/user/components/TransporterTable";
import { useTransporterLogic } from "@/app/cs/(main)/user/components/useTransporterLogic";
import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import Pagination from "@/components/Pagination/Pagination";
import { useTranslation } from "@/hooks/use-translation";

// Note: Phone numbers are returned as raw strings from the API (e.g., "082112345678")
// and formatted in the frontend using the phoneFormatter utility
// Raw format: "082112345678" -> Formatted: "No. HP : 0821-1234-5678"
// 13-digit format: "08293333444410" -> Formatted: "No. HP : 0829-3333-4444-10"

const TransporterContainer = ({
  onPageChange,
  onPerPageChange,
  _count,
  onDataStateChange,
}) => {
  const { t } = useTranslation();
  const {
    // Data
    transportersData,
    totalItems,
    totalPages,
    currentPage,
    perPage,
    searchValue,
    filters,
    sortConfig,
    isLoading,
    isPatchingStatus,
    error,
    modalState,
    hubungiModalOpen,
    selectedTransporter,

    // States
    showNoDataState,
    showSearchNotFoundState,
    showFilterNotFoundState,
    showPagination,
    hasData,

    // Handlers
    handleSearch,
    handleSearchKeyDown,
    handleSearchBlur,
    handleClearSearch,
    handleFilter,
    getActiveFilters,
    handleRemoveFilter,
    handleClearAllFilters,
    handlePageChange,
    handlePerPageChange,
    handleSort,
    openModal,
    openHubungiModal,
    closeHubungiModal,
    handleConfirmAction,
    setModalState,
  } = useTransporterLogic({
    onPageChange,
    onPerPageChange,
    onDataStateChange,
  });

  const emptyComponent = (
    <TransporterEmptyStates
      error={error}
      showNoDataState={showNoDataState}
      showSearchNotFoundState={showSearchNotFoundState}
      showFilterNotFoundState={showFilterNotFoundState}
    />
  );

  return (
    <>
      <div className="min-h-[280px] overflow-hidden rounded-xl bg-white shadow-muat">
        {error || showNoDataState ? (
          emptyComponent
        ) : (
          <>
            <div className="flex flex-col gap-5 px-6 pb-6 pt-5">
              <TransporterSearchAndFilter
                searchValue={searchValue}
                onSearch={handleSearch}
                onSearchKeyDown={handleSearchKeyDown}
                onSearchBlur={handleSearchBlur}
                onClearSearch={handleClearSearch}
                filters={filters}
                onFilter={handleFilter}
                showFilterNotFoundState={showFilterNotFoundState}
                showSearchNotFoundState={showSearchNotFoundState}
                isLoading={isLoading}
                totalItems={totalItems}
              />
              {/* Active Filters Bar */}
              {Object.keys(filters).length > 0 && (
                <ActiveFiltersBar
                  filters={getActiveFilters()}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAllFilters}
                />
              )}
            </div>

            <div className="">
              <TransporterTable
                transportersData={transportersData}
                isLoading={isLoading}
                emptyComponent={emptyComponent}
                onSort={handleSort}
                sortConfig={sortConfig}
                onOpenModal={openModal}
                onOpenHubungiModal={openHubungiModal}
              />
              <TransporterConfirmationModals
                modalState={modalState}
                setModalState={setModalState}
                onConfirmAction={handleConfirmAction}
                isLoading={isPatchingStatus}
              />
              <HubungiModal
                isOpen={hubungiModalOpen}
                onClose={closeHubungiModal}
                transporterData={selectedTransporter}
              />
            </div>
          </>
        )}
      </div>
      {showPagination && hasData && !isLoading && !error && (
        <div className="px-6 pb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            variants="muatrans"
          />
        </div>
      )}
    </>
  );
};

export default TransporterContainer;
