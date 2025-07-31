import Timeline from ".";

// Example 1: Basic usage (same as before)
export const BasicExample = () => {
  return (
    <Timeline.Root size="default">
      <Timeline.Selesai
        status="Selesai"
        link="Lihat Bukti Bongkar Barang & POD"
        timestamp={"9 Okt 2024\n20:05 WIB"}
      />
      <Timeline.Spacer />
      <Timeline.SubItem
        status="Sedang Bongkar"
        timestamp={"03 Okt 2024\n15:50 WIB"}
      />
      <Timeline.SubItem
        status="Antri di Lokasi Bongkar"
        timestamp={"03 Okt 2024\n15:50 WIB"}
      />
      <Timeline.SubItem
        status="Tiba di Lokasi Bongkar"
        link="Lihat Bukti Tiba di Lokasi Bongkar"
        timestamp={"04 Okt 2024\n05:20 WIB"}
      />
      <Timeline.SubItem
        status="Menuju ke Lokasi Bongkar"
        link="Lihat Bukti Muat Barang & POD"
        timestamp={"3 Okt 2024\n21:20 WIB"}
        isLast
      />
      <Timeline.Spacer />
      <Timeline.ProcessSeparator
        icon="/icons/box-open.svg"
        label="Proses Bongkar"
        type="bongkar"
      />
      <Timeline.HorizontalRule />
      <Timeline.SubItem
        status="Sedang Muat"
        timestamp={"03 Okt 2024\n15:50 WIB"}
      />
      <Timeline.SubItem
        status="Antri di Lokasi Muat"
        timestamp={"03 Okt 2024\n15:50 WIB"}
      />
      <Timeline.SubItem
        status="Tiba di Lokasi Muat"
        link="Lihat Bukti Tiba di Lokasi Muat"
        timestamp={"03 Okt 2024\n17:50 WIB"}
      />
      <Timeline.SubItem
        status="Menuju ke Lokasi Muat"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        isLast
      />
      <Timeline.Spacer />
      <Timeline.ProcessSeparator
        icon="/icons/box-closed.svg"
        label="Proses Muat"
        type="muat"
      />
    </Timeline.Root>
  );
};

// Example 2: Custom styling with className
export const CustomStylingExample = () => {
  return (
    <Timeline.Root
      size="large"
      className="rounded-lg border border-gray-200 shadow-lg"
    >
      <Timeline.Selesai
        status="Selesai"
        link="Lihat Bukti Bongkar Barang & POD"
        timestamp={"9 Okt 2024\n20:05 WIB"}
        className="transition-colors hover:bg-gray-50"
      />
      <Timeline.Spacer height="h-6" />
      <Timeline.SubItem
        status="Sedang Bongkar"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        className="transition-colors hover:bg-blue-50"
      />
      <Timeline.SubItem
        status="Antri di Lokasi Bongkar"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="completed"
      />
      <Timeline.ProcessSeparator
        icon="/icons/box-open.svg"
        label="Proses Bongkar"
        type="bongkar"
        className="rounded bg-blue-100 p-2"
      />
      <Timeline.HorizontalRule style="light" />
    </Timeline.Root>
  );
};

// Example 3: Different status variants
export const StatusVariantsExample = () => {
  return (
    <Timeline.Root size="small">
      <Timeline.Selesai
        status="Selesai"
        link="Lihat Bukti"
        timestamp={"9 Okt 2024\n20:05 WIB"}
        statusVariant="completed"
      />
      <Timeline.Spacer />
      <Timeline.SubItem
        status="Sedang Diproses"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="active"
      />
      <Timeline.SubItem
        status="Menunggu Konfirmasi"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="pending"
      />
      <Timeline.SubItem
        status="Gagal Diproses"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="error"
        isLast
      />
    </Timeline.Root>
  );
};

// Example 4: Compact layout
export const CompactExample = () => {
  return (
    <Timeline.Root size="small" className="bg-gray-50">
      <Timeline.Selesai
        status="Selesai"
        timestamp={"9 Okt 2024\n20:05 WIB"}
        statusVariant="completed"
      />
      <Timeline.Spacer height="h-2" />
      <Timeline.SubItem
        status="Sedang Bongkar"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="active"
      />
      <Timeline.SubItem
        status="Antri di Lokasi"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="pending"
        isLast
      />
    </Timeline.Root>
  );
};

// Example 5: Custom process separator
export const CustomProcessSeparatorExample = () => {
  return (
    <Timeline.Root>
      <Timeline.Selesai status="Selesai" timestamp={"9 Okt 2024\n20:05 WIB"} />
      <Timeline.Spacer />
      <Timeline.ProcessSeparator
        icon="/icons/truck.svg"
        label="Pengiriman"
        type="muat"
        className="bg-green-100 text-green-800"
      />
      <Timeline.SubItem
        status="Barang Dikirim"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="completed"
      />
      <Timeline.ProcessSeparator
        icon="/icons/warehouse.svg"
        label="Penerimaan"
        type="bongkar"
        className="bg-blue-100 text-blue-800"
      />
      <Timeline.SubItem
        status="Barang Diterima"
        timestamp={"03 Okt 2024\n15:50 WIB"}
        statusVariant="completed"
        isLast
      />
    </Timeline.Root>
  );
};

// Example 6: Dynamic timeline with conditional rendering
export const DynamicTimelineExample = ({ timelineData }) => {
  return (
    <Timeline.Root size="large">
      {timelineData.map((item, index) => {
        if (item.type === "selesai") {
          return (
            <Timeline.Selesai
              key={index}
              status={item.status}
              link={item.link}
              timestamp={item.timestamp}
              statusVariant={item.statusVariant}
            />
          );
        }

        if (item.type === "separator") {
          return (
            <Timeline.ProcessSeparator
              key={index}
              icon={item.icon}
              label={item.label}
              type={item.type}
            />
          );
        }

        if (item.type === "rule") {
          return <Timeline.HorizontalRule key={index} style={item.style} />;
        }

        if (item.type === "spacer") {
          return <Timeline.Spacer key={index} height={item.height} />;
        }

        return (
          <Timeline.SubItem
            key={index}
            status={item.status}
            timestamp={item.timestamp}
            link={item.link}
            statusVariant={item.statusVariant}
            isLast={item.isLast}
          />
        );
      })}
    </Timeline.Root>
  );
};

// Example 7: Timeline with custom children
export const TimelineWithCustomChildren = () => {
  return (
    <Timeline.Root>
      <Timeline.Selesai status="Selesai" timestamp={"9 Okt 2024\n20:05 WIB"}>
        {/* Custom content can be added here */}
        <div className="mt-2 text-xs text-gray-500">
          Additional information can be displayed here
        </div>
      </Timeline.Selesai>
      <Timeline.Spacer />
      <Timeline.SubItem
        status="Sedang Bongkar"
        timestamp={"03 Okt 2024\n15:50 WIB"}
      >
        <div className="mt-1 text-xs text-blue-600">
          Custom sub-item content
        </div>
      </Timeline.SubItem>
      <Timeline.ProcessSeparator
        icon="/icons/box-open.svg"
        label="Proses Bongkar"
        type="bongkar"
      >
        <div className="mt-1 text-xs text-gray-600">Process details</div>
      </Timeline.ProcessSeparator>
    </Timeline.Root>
  );
};
