import { AvatarDriver } from "./AvatarDriver";

/**
 * # 🚗 AvatarDriver Component
 *
 * A specialized avatar component for displaying driver information including name, photo, and license plate with optional transporter icon.
 *
 * ## When to Use
 * - To display driver information in ride-hailing or delivery apps
 * - For driver profiles and assignment displays
 * - In trip details, booking confirmations, or driver selection interfaces
 * - When showing transporter/driver identification with vehicle information
 *
 * ## Design System Category
 * Data Display Components
 *
 * ## Prerequisites
 * - Uses Tailwind CSS classes from the design system
 * - Requires IconComponent for the transporter icon
 * - Supports responsive design with mobile/desktop breakpoints
 */

export default {
  title: "Components/AvatarDriver",
  component: AvatarDriver,
  parameters: {
    docs: {
      description: {
        component:
          "The AvatarDriver component provides a structured way to display driver information with photo, name, and license plate, optimized for transportation and delivery applications.",
      },
    },
  },
  argTypes: {
    name: {
      control: "text",
      description: "Driver's full name",
    },
    image: {
      control: "text",
      description: "URL of the driver's profile image",
    },
    licensePlate: {
      control: "text",
      description: "Vehicle license plate number",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the container",
    },
    appearance: {
      control: "object",
      description: "Customization object for styling different parts",
    },
    withIcon: {
      control: "boolean",
      description: "Whether to show the transporter icon next to license plate",
    },
  },
};

/**
 * ## Default AvatarDriver
 *
 * Shows the basic driver avatar with all information.
 */
export const Default = {
  args: {
    name: "Ahmad Surya",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 1234 ABC",
    withIcon: true,
  },
};

/**
 * ## Without Icon
 *
 * Driver avatar without the transporter icon.
 */
export const WithoutIcon = {
  args: {
    name: "Budi Santoso",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    licensePlate: "D 5678 DEF",
    withIcon: false,
  },
};

/**
 * ## Different Drivers
 *
 * Showcase various driver profiles with different information.
 */

/**
 * ### Express Delivery Driver
 */
export const ExpressDriver = {
  args: {
    name: "Rudi Express",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 9999 XYZ",
    withIcon: true,
  },
};

/**
 * ### Long Name Driver
 * Handles drivers with longer names.
 */
export const LongNameDriver = {
  args: {
    name: "Muhammad Rizki Abdullah",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 1111 AAA",
    withIcon: true,
  },
};

/**
 * ### Short Name Driver
 */
export const ShortNameDriver = {
  args: {
    name: "Ali",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 2222 BBB",
    withIcon: true,
  },
};

/**
 * ## License Plate Variations
 *
 * Different license plate formats and styles.
 */

/**
 * ### Standard Format
 */
export const StandardPlate = {
  args: {
    name: "Standard Driver",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 1234 ABC",
    withIcon: true,
  },
};

/**
 * ### Electric Vehicle
 */
export const ElectricVehicle = {
  args: {
    name: "Green Driver",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 7777 EL",
    withIcon: true,
  },
};

/**
 * ### Motorcycle
 */
export const Motorcycle = {
  args: {
    name: "Bike Courier",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 8888 MC",
    withIcon: true,
  },
};

/**
 * ## Custom Styling
 *
 * Customize the appearance using className and appearance props.
 */
export const CustomStyling = {
  args: {
    name: "Custom Driver",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 9999 CUS",
    className: "bg-neutral-50 p-3 rounded-lg shadow-sm",
    appearance: {
      containerClassName: "text-primary-700",
      photoClassName: "ring-2 ring-primary-200",
      nameClassName: "text-primary-800",
      licensePlateClassName: "text-primary-600",
    },
    withIcon: true,
  },
};

/**
 * ## Appearance Customization
 *
 * Fine-tune styling of individual parts using the appearance object.
 */

/**
 * ### Highlighted Name
 */
export const HighlightedName = {
  args: {
    name: "Featured Driver",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 4444 FEA",
    appearance: {
      nameClassName: "text-primary-700 font-bold",
    },
    withIcon: true,
  },
};

/**
 * ### Compact Layout
 */
export const CompactLayout = {
  args: {
    name: "Compact Driver",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 5555 CMP",
    className: "h-8",
    appearance: {
      photoClassName: "h-8 w-8",
      nameClassName: "text-sm",
      licensePlateClassName: "text-xs",
    },
    withIcon: true,
  },
};

/**
 * ## Interactive Playground
 *
 * Experiment with all available props and see the results in real-time.
 */
export const Playground = {
  args: {
    name: "Playground Driver",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 0000 TST",
    className: "",
    appearance: {
      containerClassName: "",
      photoClassName: "",
      nameClassName: "",
      licensePlateClassName: "",
    },
    withIcon: true,
  },
};

/**
 * ## Props Documentation
 *
 * | Prop | Type | Default | Required | Description |
 * |------|------|---------|----------|-------------|
 * | `name` | `string` | `undefined` | Yes | Driver's full name |
 * | `image` | `string` | `undefined` | Yes | URL of the driver's profile image |
 * | `licensePlate` | `string` | `undefined` | Yes | Vehicle license plate number |
 * | `className` | `string` | `undefined` | No | Additional CSS classes for the container |
 * | `appearance` | `Object` | `{}` | No | Customization object for styling |
 * | `withIcon` | `boolean` | `true` | No | Whether to show transporter icon |
 *
 * ### Appearance Object Structure
 * ```javascript
 * {
 *   containerClassName: string,    // Classes for the text container
 *   photoClassName: string,        // Classes for the profile image
 *   nameClassName: string,         // Classes for the driver name
 *   licensePlateClassName: string  // Classes for the license plate
 * }
 * ```
 */

/**
 * ## Responsive Design
 *
 * The component uses responsive breakpoints:
 * - **Mobile**: `text-base font-semibold` for name, `text-xs` for license plate
 * - **Desktop**: `md:text-sm md:font-bold` for name, `md:text-xxs` for license plate
 *
 * This ensures optimal readability across different screen sizes.
 */

/**
 * ## Accessibility Features
 *
 * - Uses semantic `img` element with driver's name as alt text
 * - Proper text hierarchy with responsive font sizes
 * - Icon provides visual context for license plate information
 * - Color contrast meets WCAG guidelines
 * - Screen reader friendly with meaningful content structure
 *
 * ## Best Practices
 *
 * ✅ **DO:**
 * - Provide high-quality profile images (square aspect ratio recommended)
 * - Use consistent license plate formatting
 * - Include full driver names when available
 * - Test on both mobile and desktop for responsive behavior
 * - Use the appearance object for consistent theming
 *
 * ❌ **DON'T:**
 * - Use low-resolution or distorted images
 * - Include sensitive information in license plate display
 * - Override default responsive behavior unless necessary
 * - Use generic placeholder images in production
 * - Remove the icon unless specifically required by design
 *
 * ## Performance Considerations
 *
 * - Images should be optimized for web delivery
 * - Consider lazy loading for driver lists
 * - Use appropriate image formats (WebP with fallbacks)
 * - Minimize custom styling to reduce CSS bundle size
 */

/**
 * ## Edge Cases
 *
 * ### Very Long Names
 * Handles drivers with very long names gracefully.
 */
export const VeryLongName = {
  args: {
    name: "Dr. Muhammad Abdul Rahman bin Abdullah Al-Mansoori",
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 7777 LNG",
    withIcon: true,
  },
};

/**
 * ### Long License Plate
 * Handles license plates with additional characters.
 */
export const LongLicensePlate = {
  args: {
    name: "Extended Plate",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
    licensePlate: "B 12345 ABC DEF",
    withIcon: true,
  },
};

/**
 * ### Missing Information
 * Graceful handling when some information is missing.
 */
export const MissingInfo = {
  args: {
    name: "Incomplete Driver",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
    licensePlate: "TBD",
    withIcon: false,
  },
};

/**
 * ## Usage Examples
 *
 * ### Trip Details
 * Common usage in ride-hailing trip information.
 */
export const TripDetails = () => (
  <div className="rounded-lg bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-lg font-semibold">Your Driver</h3>
    <AvatarDriver
      name="Ahmad Surya"
      image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      licensePlate="B 1234 ABC"
      withIcon={true}
    />
  </div>
);

/**
 * ### Driver Selection
 * Multiple drivers in a selection interface.
 */
export const DriverSelection = () => (
  <div className="space-y-3">
    <AvatarDriver
      name="Ahmad Surya"
      image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      licensePlate="B 1234 ABC"
      withIcon={true}
    />
    <AvatarDriver
      name="Budi Santoso"
      image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      licensePlate="D 5678 DEF"
      withIcon={true}
    />
    <AvatarDriver
      name="Cici Lestari"
      image="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face"
      licensePlate="B 9012 GHI"
      withIcon={true}
    />
  </div>
);

/**
 * ### Delivery Tracking
 * Driver information in delivery tracking interface.
 */
export const DeliveryTracking = () => (
  <div className="rounded-lg bg-neutral-50 p-4">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-700">
        Delivery Driver
      </span>
      <span className="text-xs text-neutral-500">On the way</span>
    </div>
    <AvatarDriver
      name="Pak Rahman"
      image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      licensePlate="B 3456 JKL"
      className="bg-transparent"
      withIcon={true}
    />
  </div>
);

/**
 * ### Driver Profile Card
 * Comprehensive driver information display.
 */
export const DriverProfileCard = () => (
  <div className="max-w-sm rounded-xl bg-white p-6 shadow-sm">
    <div className="mb-4 text-center">
      <AvatarDriver
        name="Siti Nurhaliza"
        image="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
        licensePlate="B 7890 MNO"
        className="justify-center"
        withIcon={true}
      />
    </div>
    <div className="text-center">
      <div className="mb-2 flex items-center justify-center gap-1 text-sm text-neutral-600">
        <span>⭐ 4.8 Rating</span>
        <span>•</span>
        <span>1,234 trips</span>
      </div>
      <p className="text-xs text-neutral-500">
        Professional and reliable delivery driver with 3+ years experience.
      </p>
    </div>
  </div>
);
