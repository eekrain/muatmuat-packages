import { useState } from "react";

import { TimelineField } from "@/components/Timeline/timeline-field";

import {
  dataCollapsed,
  dataCollapsedWithDate,
  dataMuatBongkar,
  fakeAddress,
} from "./mockdata";

const {
  TimelineContainer,
  TimelineItem,
  TimelineContentWithButtonDate,
  TimelineContentAddress,
} = require("@/components/Timeline");

function ExampleTimeline() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="mb-2 text-xl font-bold">
            List Timeline Muat Bongkar (Number)
          </h1>
          <TimelineContainer>
            {dataMuatBongkar.map((item, index) => (
              <TimelineItem
                key={index}
                variant="number-muat"
                totalLength={dataMuatBongkar.length}
                index={index}
                activeIndex={0}
              >
                <TimelineContentAddress title={item.title} />
              </TimelineItem>
            ))}
          </TimelineContainer>
        </div>

        <div>
          <h1 className="mb-2 text-xl font-bold">
            List Timeline Bongkar (Number)
          </h1>
          <TimelineContainer>
            {dataMuatBongkar.map((item, index) => (
              <TimelineItem
                key={index}
                variant="number-bongkar"
                totalLength={dataMuatBongkar.length}
                index={index}
                activeIndex={0}
              >
                <TimelineContentAddress title={item.title} />
              </TimelineItem>
            ))}
          </TimelineContainer>
        </div>

        <div>
          <h1 className="mb-2 text-xl font-bold">
            List Timeline Bongkar Muat (Bullet)
          </h1>
          <TimelineContainer>
            {dataMuatBongkar.map((item, index) => (
              <TimelineItem
                key={index}
                variant="bullet"
                totalLength={dataMuatBongkar.length}
                index={index}
                activeIndex={2}
              >
                <TimelineContentAddress title={item.title} />
              </TimelineItem>
            ))}
          </TimelineContainer>
        </div>

        <div className="grid gap-4">
          <div className="max-w-[400px]">
            <h1 className="mb-2 text-xl font-bold">
              Timeline Bongkar Muat Collapsed
            </h1>
            <TimelineContainer>
              {dataCollapsed.map((item, index) => (
                <TimelineItem
                  key={index}
                  variant="bullet"
                  totalLength={dataCollapsed.length}
                  index={index}
                  activeIndex={0}
                >
                  <TimelineContentWithButtonDate
                    title={item.title}
                    withButton={item.withButton}
                    onSubtitleClick={() =>
                      alert(`Tampilkan modal untuk ${item.subtitle}`)
                    }
                  />
                </TimelineItem>
              ))}
            </TimelineContainer>
          </div>

          <div className="max-w-[400px]">
            <h1 className="mb-2 text-xl font-bold">Detail Status Driver</h1>
            <TimelineContainer>
              {dataCollapsedWithDate.map((item, index) => (
                <TimelineItem
                  key={index}
                  variant="bullet-driver-status"
                  totalLength={dataCollapsedWithDate.length}
                  index={index}
                  activeIndex={0}
                >
                  <TimelineContentWithButtonDate
                    title={item.title}
                    withButton={item.withButton}
                    withDate={item.withDate}
                    onSubtitleClick={() =>
                      alert(`Tampilkan modal untuk ${item.subtitle}`)
                    }
                  />
                </TimelineItem>
              ))}
            </TimelineContainer>
          </div>
        </div>
      </div>

      <ExampleTimelineField />
    </div>
  );
}

export default ExampleTimeline;

export const ExampleTimelineField = () => {
  const [muatValues, setMuatValues] = useState([]);

  const handleAddMuatLocation = () => {
    setMuatValues([
      ...muatValues,
      fakeAddress[Math.floor(Math.random() * fakeAddress.length)],
    ]);
  };

  const handleDeleteMuatLocation = (index) => {
    setMuatValues(muatValues.filter((_, i) => i !== index));
  };

  const [bongkarValues, setBongkarValues] = useState([]);

  const handleAddBongkarLocation = () => {
    setBongkarValues([
      ...bongkarValues,
      fakeAddress[Math.floor(Math.random() * fakeAddress.length)],
    ]);
  };

  const handleDeleteBongkarLocation = (index) => {
    setBongkarValues(bongkarValues.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="max-w-[400px]">
        <h1 className="mb-2 text-xl font-bold">Timeline Field Muat</h1>

        <p>State values: </p>
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(muatValues, null, 2)}
        </pre>

        <TimelineField
          variant="muat"
          // Only accept array string address
          // You need to map the value that will be rendered, in case the state is an array of object
          values={muatValues.map((value) => value.address)}
          onAddLocation={handleAddMuatLocation}
          onDeleteLocation={handleDeleteMuatLocation}
        />
      </div>

      <div className="max-w-[400px]">
        <h1 className="mb-2 text-xl font-bold">Timeline Field Bongkar</h1>

        <p>State values: </p>
        <pre>{JSON.stringify(bongkarValues, null, 2)}</pre>

        <TimelineField
          variant="bongkar"
          // Only accept array string address
          // You need to map the value that will be rendered, in case the state is an array of object
          values={bongkarValues.map((value) => value.address)}
          onAddLocation={handleAddBongkarLocation}
          onDeleteLocation={handleDeleteBongkarLocation}
        />
      </div>
    </div>
  );
};
