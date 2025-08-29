import { Alert } from "./Alert";

/**
 * # 🚨 Alert Component
 *
 * A versatile alert component for displaying important messages, warnings, or notifications to users.
 *
 * ## When to Use
 * - To communicate important information that requires user attention
 * - For status messages (success, warning, error states)
 * - To highlight system notifications or validation messages
 * - As part of form validation feedback
 *
 * ## Design System Category
 * Feedback Components
 *
 * ## Prerequisites
 * - Requires IconComponent for displaying icons
 * - Uses Tailwind CSS classes from the design system
 * - Depends on custom color palette (warning, secondary, error variants)
 */

export default {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "The Alert component provides a flexible way to display contextual feedback messages with consistent styling and optional icons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["warning", "secondary", "error"],
      description: "Defines the visual style and semantic meaning of the alert",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "big"],
      description: "Controls the padding and icon size of the alert",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the alert container",
    },
    appearance: {
      control: "object",
      description: "Customization object for label styling",
    },
    children: {
      control: "text",
      description:
        "The content to display inside the alert (string or React node)",
    },
  },
};

/**
 * ## Default Alert
 *
 * The most basic usage of the Alert component with default props.
 */
export const Default = {
  args: {
    children: "This is a default warning alert message.",
  },
};

/**
 * ## Alert Variants
 *
 * Different visual styles for different types of messages.
 */

/**
 * ### Warning Alert
 *
 * Use for cautionary messages that require user attention but aren't critical errors.
 */
export const Warning = {
  args: {
    variant: "warning",
    children: "Please review your information before proceeding.",
  },
};

/**
 * ### Secondary Alert
 *
 * Use for general information or secondary notifications.
 */
export const Secondary = {
  args: {
    variant: "secondary",
    children: "Your changes have been saved successfully.",
  },
};

/**
 * ### Error Alert
 *
 * Use for critical errors or validation failures that need immediate attention.
 */
export const Error = {
  args: {
    variant: "error",
    children: "Failed to save changes. Please try again.",
  },
};

/**
 * ## Alert Sizes
 */

/**
 * ### Small Alert
 *
 * Compact size suitable for inline notifications or tight spaces.
 */
export const Small = {
  args: {
    size: "sm",
    children: "Small alert with compact padding.",
  },
};

/**
 * ### Big Alert
 *
 * Larger size with more padding, ideal for prominent notifications.
 */
export const Big = {
  args: {
    size: "big",
    children: "Big alert with generous padding for important messages.",
  },
};

/**
 * ## Custom Styling
 *
 * Customize the appearance using className and appearance props.
 */
export const CustomStyling = {
  args: {
    variant: "warning",
    className: "border-l-4 border-warning-400",
    appearance: {
      labelClassName: "font-semibold text-warning-800",
    },
    children: "Custom styled alert with border and bold text.",
  },
};

/**
 * ## With React Children
 *
 * The Alert component supports complex React children, not just strings.
 */
export const WithReactChildren = {
  args: {
    variant: "secondary",
    children: (
      <div>
        <strong>Complex Content:</strong>
        <br />
        <span>This alert contains </span>
        <a
          href="#"
          className="text-secondary-600 hover:text-secondary-700 underline"
        >
          links
        </a>
        <span> and other elements.</span>
      </div>
    ),
  },
};

/**
 * ## Interactive Playground
 *
 * Experiment with all available props and see the results in real-time.
 */
export const Playground = {
  args: {
    variant: "warning",
    size: "sm",
    className: "",
    appearance: {
      labelClassName: "text-neutral-900",
    },
    children: "Customize this alert using the controls below.",
  },
};

/**
 * ## Props Documentation
 *
 * | Prop | Type | Default | Required | Description |
 * |------|------|---------|----------|-------------|
 * | `variant` | `'warning' \| 'secondary' \| 'error'` | `'warning'` | No | Defines the visual style and semantic meaning |
 * | `size` | `'sm' \| 'big'` | `'sm'` | No | Controls padding and icon size |
 * | `className` | `string` | `undefined` | No | Additional CSS classes |
 * | `appearance` | `Object` | `{ labelClassName: 'text-neutral-900' }` | No | Customization for label styling |
 * | `children` | `string \| ReactNode` | `undefined` | Yes | Alert content |
 */

/**
 * ## Accessibility Features
 *
 * - Uses semantic color variants that provide sufficient contrast ratios
 * - Supports screen readers through proper text content
 * - Icon provides visual context (consider adding aria-label if needed)
 * - Color variants convey meaning: warning (caution), secondary (info), error (danger)
 *
 * ## Best Practices
 *
 * ✅ **DO:**
 * - Use appropriate variants for semantic meaning (error for failures, warning for cautions)
 * - Keep messages clear and concise
 * - Use the big size for important notifications
 * - Customize appearance using the appearance prop rather than overriding styles
 *
 * ❌ **DON'T:**
 * - Use error variant for non-critical issues
 * - Include interactive elements without proper accessibility attributes
 * - Override default styles with arbitrary Tailwind values
 * - Use for persistent notifications (consider toast notifications instead)
 *
 * ## Edge Cases
 *
 * ### Long Text Handling
 * The alert automatically handles long text with proper wrapping and maintains readability.
 */
export const LongText = {
  args: {
    variant: "warning",
    size: "big",
    children:
      "This is a very long alert message that demonstrates how the component handles extended content. The text will wrap naturally and maintain proper spacing and readability across different screen sizes and content lengths.",
  },
};

/**
 * ### Empty State
 * Handles cases where no children are provided gracefully.
 */
export const Empty = {
  args: {
    variant: "secondary",
    children: "",
  },
};

/**
 * ## Composition Patterns
 *
 * ### With Action Buttons
 * Combine with buttons for actionable alerts.
 */
export const WithActions = {
  args: {
    variant: "error",
    size: "big",
    children: (
      <div className="flex w-full items-center justify-between">
        <span>Failed to connect to server.</span>
        <button className="bg-error-600 hover:bg-error-700 ml-4 rounded px-3 py-1 text-sm text-white transition-colors">
          Retry
        </button>
      </div>
    ),
  },
};

/**
 * ### Multiple Alerts
 * Stack multiple alerts for complex messaging scenarios.
 */
export const MultipleAlerts = () => (
  <div className="space-y-2">
    <Alert variant="error">Critical system error detected.</Alert>
    <Alert variant="warning">Please save your work before continuing.</Alert>
    <Alert variant="secondary">Backup completed successfully.</Alert>
  </div>
);
