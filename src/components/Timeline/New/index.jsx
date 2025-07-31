"use client";

import Link from "next/link";
import { createContext, useContext } from "react";

import { cva } from "class-variance-authority";

import IconComponent from "@/components/IconComponent/IconComponent";

// Context for timeline state
const TimelineContext = createContext();

// CVA variants for timeline components
export const timelineContainerVariants = cva(
  "w-[360px] bg-white p-5 font-sans",
  {
    variants: {
      size: {
        default: "w-[360px]",
        large: "w-[480px]",
        small: "w-[280px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const selesaiItemVariants = cva("flex items-center gap-3", {
  variants: {
    layout: {
      default: "flex items-center gap-3",
      compact: "flex items-center gap-2",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export const selesaiIconVariants = cva(
  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      status: {
        completed: "bg-primary-400",
        pending: "bg-neutral-200",
        error: "bg-red-500",
      },
    },
    defaultVariants: {
      status: "completed",
    },
  }
);

export const selesaiContentVariants = cva(
  "flex flex-1 items-start justify-between",
  {
    variants: {
      layout: {
        default: "flex flex-1 items-start justify-between",
        compact: "flex flex-1 items-center justify-between",
      },
    },
    defaultVariants: {
      layout: "default",
    },
  }
);

export const selesaiStatusVariants = cva("text-sm font-bold leading-tight", {
  variants: {
    status: {
      completed: "text-neutral-900",
      pending: "text-neutral-600",
      error: "text-red-600",
    },
  },
  defaultVariants: {
    status: "completed",
  },
});

export const selesaiLinkVariants = cva(
  "mt-1 block text-xs font-semibold leading-tight",
  {
    variants: {
      status: {
        completed: "text-primary-700",
        pending: "text-neutral-500",
        error: "text-red-500",
      },
    },
    defaultVariants: {
      status: "completed",
    },
  }
);

export const selesaiTimestampVariants = cva(
  "whitespace-pre-line text-right text-xs font-medium",
  {
    variants: {
      status: {
        completed: "text-neutral-900",
        pending: "text-neutral-600",
        error: "text-red-600",
      },
    },
    defaultVariants: {
      status: "completed",
    },
  }
);

export const subItemVariants = cva("flex items-start gap-3", {
  variants: {
    layout: {
      default: "flex items-start gap-3",
      compact: "flex items-center gap-2",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export const subItemBulletVariants = cva(
  "z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      status: {
        active: "bg-neutral-200",
        completed: "bg-primary-200",
        pending: "bg-neutral-100",
      },
      position: {
        default: "mt-1.5",
        withLink: "mt-0",
      },
    },
    defaultVariants: {
      status: "active",
      position: "default",
    },
  }
);

export const subItemBulletDotVariants = cva("rounded-full", {
  variants: {
    status: {
      active: "h-1.5 w-1.5 bg-neutral-600",
      completed: "h-1.5 w-1.5 bg-primary-600",
      pending: "h-1 w-1 bg-neutral-400",
    },
  },
  defaultVariants: {
    status: "active",
  },
});

export const subItemConnectorVariants = cva(
  "w-px flex-1 border-l-2 border-dashed",
  {
    variants: {
      status: {
        active: "border-neutral-400",
        completed: "border-primary-300",
        pending: "border-neutral-200",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);

export const subItemContentVariants = cva(
  "flex flex-1 items-center justify-between",
  {
    variants: {
      hasLink: {
        true: "flex flex-1 flex-col",
        false: "flex flex-1 items-center justify-between",
      },
      isLast: {
        true: "",
        false: "pb-4",
      },
    },
    defaultVariants: {
      hasLink: false,
      isLast: false,
    },
  }
);

export const subItemStatusVariants = cva("text-sm font-semibold", {
  variants: {
    status: {
      active: "text-neutral-600",
      completed: "text-neutral-900",
      pending: "text-neutral-500",
    },
  },
  defaultVariants: {
    status: "active",
  },
});

export const subItemLinkVariants = cva("mt-0.5 block text-xs font-semibold", {
  variants: {
    status: {
      active: "text-primary-700",
      completed: "text-primary-600",
      pending: "text-neutral-500",
    },
  },
  defaultVariants: {
    status: "active",
  },
});

export const subItemTimestampVariants = cva(
  "whitespace-pre-line text-right text-xs font-medium",
  {
    variants: {
      status: {
        active: "text-neutral-600",
        completed: "text-neutral-900",
        pending: "text-neutral-500",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);

export const processSeparatorVariants = cva("flex items-center gap-3", {
  variants: {
    layout: {
      default: "flex items-center gap-3",
      compact: "flex items-center gap-2",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export const processSeparatorIconVariants = cva(
  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      type: {
        muat: "bg-neutral-200",
        bongkar: "bg-neutral-200",
        default: "bg-neutral-200",
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
);

export const processSeparatorLabelVariants = cva("text-sm font-bold", {
  variants: {
    type: {
      muat: "text-neutral-600",
      bongkar: "text-neutral-600",
      default: "text-neutral-600",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

export const horizontalRuleVariants = cva("my-6 border-t", {
  variants: {
    style: {
      default: "border-neutral-400",
      light: "border-neutral-200",
      dark: "border-neutral-600",
    },
  },
  defaultVariants: {
    style: "default",
  },
});

// Hook to use timeline context
const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("Timeline components must be used within Timeline.Root");
  }
  return context;
};

// Main Timeline Container
const TimelineRoot = ({ children, size = "default", className, ...props }) => {
  return (
    <TimelineContext.Provider value={{ size }}>
      <div
        className={`${timelineContainerVariants({ size })} ${className || ""}`}
        {...props}
      >
        <div className="flex flex-col">{children}</div>
      </div>
    </TimelineContext.Provider>
  );
};

// Selesai Item Component
const TimelineSelesai = ({
  children,
  status,
  link,
  timestamp,
  statusVariant = "completed",
  className,
  ...props
}) => {
  return (
    <div className={`${selesaiItemVariants()} ${className || ""}`} {...props}>
      <div className={selesaiIconVariants({ status: statusVariant })}>
        <IconComponent
          src="/icons/check-solid.svg"
          className="h-5 w-5 text-neutral-900"
          alt="Selesai"
        />
      </div>
      <div className={selesaiContentVariants()}>
        <div>
          <p className={selesaiStatusVariants({ status: statusVariant })}>
            {status}
          </p>
          {link && (
            <Link
              href="#"
              className={selesaiLinkVariants({ status: statusVariant })}
            >
              {link}
            </Link>
          )}
        </div>
        <p className={selesaiTimestampVariants({ status: statusVariant })}>
          {timestamp}
        </p>
      </div>
      {children}
    </div>
  );
};

// Sub Item Component
const TimelineSubItem = ({
  children,
  status,
  timestamp,
  link,
  isLast = false,
  statusVariant = "active",
  position = "default",
  className,
  ...props
}) => {
  return (
    <div className={`${subItemVariants()} ${className || ""}`} {...props}>
      <div className="flex flex-col items-center self-stretch">
        <div
          className={subItemBulletVariants({ status: statusVariant, position })}
        >
          <div
            className={subItemBulletDotVariants({ status: statusVariant })}
          />
        </div>
        {!isLast && (
          <div
            className={subItemConnectorVariants({ status: statusVariant })}
          />
        )}
      </div>
      <div className={subItemContentVariants({ hasLink: !!link, isLast })}>
        {link ? (
          <div className="flex items-start justify-between">
            <div>
              <p className={subItemStatusVariants({ status: statusVariant })}>
                {status}
              </p>
              <Link
                href="#"
                className={subItemLinkVariants({ status: statusVariant })}
              >
                {link}
              </Link>
            </div>
            <p className={subItemTimestampVariants({ status: statusVariant })}>
              {timestamp}
            </p>
          </div>
        ) : (
          <>
            <p className={subItemStatusVariants({ status: statusVariant })}>
              {status}
            </p>
            <p className={subItemTimestampVariants({ status: statusVariant })}>
              {timestamp}
            </p>
          </>
        )}
      </div>
      {children}
    </div>
  );
};

// Process Separator Component
const TimelineProcessSeparator = ({
  children,
  icon,
  label,
  type = "default",
  className,
  ...props
}) => {
  return (
    <div
      className={`${processSeparatorVariants()} ${className || ""}`}
      {...props}
    >
      <div className={processSeparatorIconVariants({ type })}>
        <IconComponent
          src={icon}
          className="h-5 w-5 text-neutral-600"
          alt={label}
        />
      </div>
      <p className={processSeparatorLabelVariants({ type })}>{label}</p>
      {children}
    </div>
  );
};

// Horizontal Rule Component
const TimelineHorizontalRule = ({ style = "default", className, ...props }) => {
  return (
    <hr
      className={`${horizontalRuleVariants({ style })} ${className || ""}`}
      {...props}
    />
  );
};

// Spacer Component
const TimelineSpacer = ({ height = "h-4", className, ...props }) => {
  return <div className={`${height} ${className || ""}`} {...props} />;
};

// Compound Component Export
const Timeline = {
  Root: TimelineRoot,
  Selesai: TimelineSelesai,
  SubItem: TimelineSubItem,
  ProcessSeparator: TimelineProcessSeparator,
  HorizontalRule: TimelineHorizontalRule,
  Spacer: TimelineSpacer,
};

// Legacy component for backward compatibility
export const ExampleTimeline = ({ size = "default" }) => {
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
