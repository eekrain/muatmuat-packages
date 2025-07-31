# Timeline Component - Compound Pattern

A flexible and customizable timeline component built using the compound component pattern. This provides excellent developer experience while maintaining full customization capabilities.

## Features

- ✅ **Compound Component Pattern** - Flexible composition
- ✅ **TypeScript Support** - Full type safety
- ✅ **Customizable Styling** - Easy className overrides
- ✅ **Multiple Status Variants** - Active, completed, pending, error states
- ✅ **Responsive Design** - Different size variants
- ✅ **Accessible** - Proper ARIA attributes and semantic HTML
- ✅ **Backward Compatible** - Legacy component still available

## Quick Start

```jsx
import Timeline from "@/components/Timeline/New";

function MyTimeline() {
  return (
    <Timeline.Root size="default">
      <Timeline.Selesai
        status="Selesai"
        link="Lihat Bukti"
        timestamp="9 Okt 2024\n20:05 WIB"
      />
      <Timeline.Spacer />
      <Timeline.SubItem
        status="Sedang Bongkar"
        timestamp="03 Okt 2024\n15:50 WIB"
      />
      <Timeline.ProcessSeparator
        icon="/icons/box-open.svg"
        label="Proses Bongkar"
        type="bongkar"
      />
      <Timeline.HorizontalRule />
    </Timeline.Root>
  );
}
```

## Components

### Timeline.Root

The main container component that provides context to all child components.

```jsx
<Timeline.Root
  size="default" // "default" | "large" | "small"
  className="custom-class"
>
  {/* Timeline children */}
</Timeline.Root>
```

**Props:**

- `size`: Timeline width variant
- `className`: Additional CSS classes
- `children`: Timeline components

### Timeline.Selesai

The main completion item with checkmark icon.

```jsx
<Timeline.Selesai
  status="Selesai"
  link="Lihat Bukti" // Optional
  timestamp="9 Okt 2024\n20:05 WIB"
  statusVariant="completed" // "completed" | "pending" | "error"
  className="custom-class"
>
  {/* Optional custom content */}
</Timeline.Selesai>
```

**Props:**

- `status`: Status text
- `link`: Optional link text
- `timestamp`: Timestamp string
- `statusVariant`: Status styling variant
- `className`: Additional CSS classes
- `children`: Optional custom content

### Timeline.SubItem

A sub-item with bullet point and connector line.

```jsx
<Timeline.SubItem
  status="Sedang Bongkar"
  timestamp="03 Okt 2024\n15:50 WIB"
  link="Lihat Bukti" // Optional
  isLast={false} // Removes connector line
  statusVariant="active" // "active" | "completed" | "pending"
  className="custom-class"
>
  {/* Optional custom content */}
</Timeline.SubItem>
```

**Props:**

- `status`: Status text
- `timestamp`: Timestamp string
- `link`: Optional link text
- `isLast`: If true, removes connector line
- `statusVariant`: Status styling variant
- `className`: Additional CSS classes
- `children`: Optional custom content

### Timeline.ProcessSeparator

A process separator with icon and label.

```jsx
<Timeline.ProcessSeparator
  icon="/icons/box-open.svg"
  label="Proses Bongkar"
  type="bongkar" // "muat" | "bongkar" | "default"
  className="custom-class"
>
  {/* Optional custom content */}
</Timeline.ProcessSeparator>
```

**Props:**

- `icon`: Icon path
- `label`: Separator label
- `type`: Process type for styling
- `className`: Additional CSS classes
- `children`: Optional custom content

### Timeline.HorizontalRule

A horizontal line separator.

```jsx
<Timeline.HorizontalRule
  style="default" // "default" | "light" | "dark"
  className="custom-class"
/>
```

**Props:**

- `style`: Line style variant
- `className`: Additional CSS classes

### Timeline.Spacer

A vertical spacer component.

```jsx
<Timeline.Spacer
  height="h-4" // Tailwind height class
  className="custom-class"
/>
```

**Props:**

- `height`: Tailwind height class
- `className`: Additional CSS classes

## Status Variants

### Selesai Status Variants

- `completed`: Green checkmark with primary colors
- `pending`: Gray checkmark with neutral colors
- `error`: Red checkmark with error colors

### SubItem Status Variants

- `active`: Blue bullet with active colors
- `completed`: Green bullet with completed colors
- `pending`: Gray bullet with pending colors

## Size Variants

- `default`: 360px width
- `large`: 480px width
- `small`: 280px width

## Examples

### Basic Timeline

```jsx
<Timeline.Root>
  <Timeline.Selesai
    status="Selesai"
    link="Lihat Bukti"
    timestamp="9 Okt 2024\n20:05 WIB"
  />
  <Timeline.Spacer />
  <Timeline.SubItem
    status="Sedang Bongkar"
    timestamp="03 Okt 2024\n15:50 WIB"
  />
</Timeline.Root>
```

### Custom Styling

```jsx
<Timeline.Root size="large" className="rounded-lg border shadow-lg">
  <Timeline.Selesai
    status="Selesai"
    timestamp="9 Okt 2024\n20:05 WIB"
    className="transition-colors hover:bg-gray-50"
  />
  <Timeline.SubItem
    status="Sedang Bongkar"
    timestamp="03 Okt 2024\n15:50 WIB"
    className="transition-colors hover:bg-blue-50"
  />
</Timeline.Root>
```

### Different Status Variants

```jsx
<Timeline.Root size="small">
  <Timeline.Selesai status="Selesai" statusVariant="completed" />
  <Timeline.SubItem status="Sedang Diproses" statusVariant="active" />
  <Timeline.SubItem status="Menunggu Konfirmasi" statusVariant="pending" />
</Timeline.Root>
```

### Dynamic Timeline

```jsx
const timelineData = [
  { type: "selesai", status: "Selesai", timestamp: "9 Okt 2024\n20:05 WIB" },
  { type: "spacer" },
  {
    type: "subitem",
    status: "Sedang Bongkar",
    timestamp: "03 Okt 2024\n15:50 WIB",
  },
  {
    type: "separator",
    icon: "/icons/box-open.svg",
    label: "Proses Bongkar",
    type: "bongkar",
  },
  { type: "rule" },
];

<Timeline.Root>
  {timelineData.map((item, index) => {
    if (item.type === "selesai") {
      return <Timeline.Selesai key={index} {...item} />;
    }
    if (item.type === "subitem") {
      return <Timeline.SubItem key={index} {...item} />;
    }
    // ... handle other types
  })}
</Timeline.Root>;
```

### Timeline with Custom Content

```jsx
<Timeline.Root>
  <Timeline.Selesai status="Selesai" timestamp="9 Okt 2024\n20:05 WIB">
    <div className="mt-2 text-xs text-gray-500">
      Additional information here
    </div>
  </Timeline.Selesai>
  <Timeline.SubItem status="Sedang Bongkar" timestamp="03 Okt 2024\n15:50 WIB">
    <div className="mt-1 text-xs text-blue-600">Custom sub-item content</div>
  </Timeline.SubItem>
</Timeline.Root>
```

## Migration from Legacy Component

The legacy `StatusTimeline` component is still available for backward compatibility:

```jsx
import { StatusTimeline } from "@/components/Timeline/New";

// This still works exactly as before
<StatusTimeline size="default" />;
```

## Styling Customization

All components accept a `className` prop for custom styling:

```jsx
<Timeline.Root className="bg-gray-50 border border-gray-200">
  <Timeline.Selesai className="hover:bg-white transition-colors">
  <Timeline.SubItem className="hover:bg-blue-50">
  <Timeline.ProcessSeparator className="bg-blue-100 text-blue-800">
```

## Accessibility

The component includes proper ARIA attributes and semantic HTML for screen readers and keyboard navigation.

## TypeScript Support

The component is fully typed and provides excellent IntelliSense support in TypeScript projects.
