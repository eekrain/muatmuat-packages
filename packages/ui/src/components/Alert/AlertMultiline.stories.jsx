import { TranslationProvider } from "@/hooks/use-translation";

import { AlertMultiline } from "./AlertMultiline";

/**
 * # 📋 AlertMultiline Component
 *
 * A flexible multiline alert component for displaying structured notifications with optional links, buttons, and tooltips.
 *
 * ## When to Use
 * - To display multiple related notifications or warnings
 * - For complex alerts requiring user actions (links/buttons)
 * - When showing detailed information with additional context via tooltips
 * - For form validation messages with multiple issues
 * - To provide contextual help or guidance with interactive elements
 *
 * ## Design System Category
 * Feedback Components
 *
 * ## Prerequisites
 * - Requires Next.js Link component for navigation
 * - Uses useTranslation hook for internationalization
 * - Depends on IconComponent and InfoTooltip components
 * - Uses Tailwind CSS classes from the design system
 */

export default {
  title: "Components/AlertMultiline",
  component: AlertMultiline,
  parameters: {
    docs: {
      description: {
        component:
          "The AlertMultiline component provides a structured way to display multiple alert items with consistent styling, icons, and optional interactive elements like links, buttons, and tooltips.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the alert container",
    },
    items: {
      control: "object",
      description:
        "Array of alert items with labels, links, buttons, or tooltips",
    },
  },
  decorators: [
    (Story) => (
      <TranslationProvider>
        <Story />
      </TranslationProvider>
    ),
  ],
};

/**
 * ## Default Alert (Single Item)
 *
 * The most basic usage with a single alert item.
 */
export const Default = {
  args: {
    items: [
      {
        label: "Please verify your email address to continue.",
      },
    ],
  },
};

/**
 * ## Multiple Items Alert
 *
 * Displays multiple alert items in a bulleted list format.
 */
export const MultipleItems = {
  args: {
    items: [
      {
        label: "Your account requires email verification.",
      },
      {
        label: "Please complete your profile information.",
      },
      {
        label: "Set up two-factor authentication for security.",
      },
    ],
  },
};

/**
 * ## Alert with Links
 *
 * Alert items that include clickable links for user actions.
 */
export const WithLinks = {
  args: {
    items: [
      {
        label: "Your subscription will expire in 3 days.",
        link: {
          label: "Renew now",
          link: "/subscription/renew",
        },
      },
      {
        label: "Update your payment method to avoid service interruption.",
        link: {
          label: "Update payment",
          link: "/payment/methods",
        },
      },
    ],
  },
};

/**
 * ## Alert with Buttons
 *
 * Alert items with interactive buttons for immediate actions.
 */
export const WithButtons = {
  args: {
    items: [
      {
        label: "New app update available.",
        button: {
          label: "Update now",
          onClick: () => alert("Update initiated!"),
        },
      },
      {
        label: "Clear your browser cache for better performance.",
        button: {
          label: "Clear cache",
          onClick: () => alert("Cache cleared!"),
        },
      },
    ],
  },
};

/**
 * ## Alert with Info Tooltips
 *
 * Alert items that provide additional context through info tooltips.
 */
export const WithInfoTooltips = {
  args: {
    items: [
      {
        label: "Enable location services for accurate delivery tracking.",
        info: "Location services help us provide real-time updates on your delivery status and estimated arrival times.",
      },
      {
        label: "Complete your driver verification process.",
        info: "Driver verification ensures the safety and reliability of our transportation services.",
      },
    ],
  },
};

/**
 * ## Mixed Content Types
 *
 * Alert combining different types of interactive elements.
 */
export const MixedContent = {
  args: {
    items: [
      {
        label: "Your profile is 80% complete.",
        link: {
          label: "Complete profile",
          link: "/profile/complete",
        },
      },
      {
        label: "Enable notifications for important updates.",
        button: {
          label: "Enable notifications",
          onClick: () => alert("Notifications enabled!"),
        },
      },
      {
        label: "Learn about our premium features.",
        info: "Premium features include priority support, advanced analytics, and exclusive discounts.",
      },
    ],
  },
};

/**
 * ## Custom Styling
 *
 * Customize the appearance using the className prop.
 */
export const CustomStyling = {
  args: {
    className: "border border-warning-200 shadow-lg",
    items: [
      {
        label: "Custom styled alert with border and shadow.",
      },
      {
        label: "This demonstrates additional styling options.",
      },
    ],
  },
};

/**
 * ## Interactive Playground
 *
 * Experiment with all available props and see the results in real-time.
 */
export const Playground = {
  args: {
    className: "",
    items: [
      {
        label: "Sample alert message with link.",
        link: {
          label: "Learn more",
          link: "#",
        },
      },
      {
        label: "Another item with button.",
        button: {
          label: "Action",
          onClick: () => alert("Button clicked"),
        },
      },
      {
        label: "Item with tooltip information.",
        info: "This is additional information that appears in a tooltip when you hover over the info icon.",
      },
    ],
  },
};

/**
 * ## Props Documentation
 *
 * | Prop | Type | Default | Required | Description |
 * |------|------|---------|----------|-------------|
 * | `className` | `string` | `undefined` | No | Additional CSS classes for the container |
 * | `items` | `AlertItem[]` | `[]` | No | Array of alert items to display |
 *
 * ### AlertItem Structure
 * ```javascript
 * {
 *   label: string,           // The main text content (translated)
 *   info?: string,           // Optional tooltip content
 *   link?: {                 // Optional link object
 *     label: string,         // Link text (translated)
 *     link: string           // URL path
 *   },
 *   button?: {               // Optional button object
 *     label: string,         // Button text (translated)
 *     onClick: function      // Click handler
 *   }
 * }
 * ```
 */

/**
 * ## Accessibility Features
 *
 * - Uses semantic list structure for multiple items
 * - Proper ARIA attributes through InfoTooltip component
 * - Keyboard navigation support for interactive elements
 * - Screen reader friendly with translated content
 * - Color contrast meets WCAG guidelines
 * - Focus management for buttons and links
 *
 * ## Best Practices
 *
 * ✅ **DO:**
 * - Use clear, concise labels that are easily translatable
 * - Provide meaningful link/button labels
 * - Include helpful tooltip information when needed
 * - Group related notifications together
 * - Use appropriate translation keys
 *
 * ❌ **DON'T:**
 * - Include too many items (limit to 3-5 for readability)
 * - Use generic labels like "Click here"
 * - Mix unrelated notifications in one alert
 * - Forget to handle button onClick events
 * - Use tooltips for critical information (keep it in main content)
 *
 * ## Edge Cases
 *
 * ### Empty State
 * Gracefully handles empty items array by rendering nothing.
 */
export const EmptyState = {
  args: {
    items: [],
  },
};

/**
 * ### Single Item with All Features
 * Demonstrates a single item with link, button, and tooltip.
 */
export const SingleItemFull = {
  args: {
    items: [
      {
        label: "Complete your account setup to unlock all features.",
        link: {
          label: "Setup account",
          link: "/account/setup",
        },
        button: {
          label: "Quick setup",
          onClick: () => alert("Quick setup initiated!"),
        },
        info: "Account setup includes profile completion, payment method setup, and preference configuration.",
      },
    ],
  },
};

/**
 * ### Long Content Handling
 * Shows how the component handles longer text content.
 */
export const LongContent = {
  args: {
    items: [
      {
        label:
          "Your recent order has been processed successfully and is now being prepared for shipment. You will receive a tracking number via email once it ships.",
        link: {
          label: "View order details",
          link: "/orders/recent",
        },
      },
      {
        label:
          "Remember to keep your contact information up to date to ensure timely delivery notifications and order updates.",
        info: "Contact information includes your phone number, email address, and delivery address. Updates can be made in your account settings.",
      },
    ],
  },
};

/**
 * ## Composition Patterns
 *
 * ### With Form Validation
 * Use in forms to display multiple validation errors.
 */
export const FormValidation = {
  args: {
    items: [
      {
        label: "Email address is required.",
      },
      {
        label: "Password must be at least 8 characters long.",
      },
      {
        label: "Phone number format is invalid.",
        info: "Please enter your phone number in the format: +62 XXX XXX XXXX",
      },
    ],
  },
};

/**
 * ### Account Notifications
 * Common pattern for account-related notifications.
 */
export const AccountNotifications = {
  args: {
    items: [
      {
        label: "Your email address has not been verified.",
        link: {
          label: "Send verification",
          link: "/account/verify-email",
        },
      },
      {
        label: "Complete your profile to access premium features.",
        link: {
          label: "Complete profile",
          link: "/profile",
        },
      },
      {
        label: "Set up two-factor authentication.",
        button: {
          label: "Setup 2FA",
          onClick: () => alert("2FA setup initiated!"),
        },
        info: "Two-factor authentication adds an extra layer of security to your account.",
      },
    ],
  },
};
