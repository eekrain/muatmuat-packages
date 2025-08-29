import Avatar from "./Avatar";

/**
 * # 👤 Avatar Component
 *
 * A flexible avatar component that displays user images with automatic fallback to initials and deterministic background colors.
 *
 * ## When to Use
 * - To display user profile pictures with automatic fallback
 * - For user identification in lists, comments, or profiles
 * - When you need consistent avatar styling across your application
 * - For displaying contact information or user representations
 *
 * ## Design System Category
 * Data Display Components
 *
 * ## Prerequisites
 * - Uses Tailwind CSS classes from the design system
 * - Supports standard image formats (PNG, JPG, WebP, etc.)
 * - No external dependencies required
 */

export default {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "The Avatar component provides a robust way to display user images with automatic fallback to initials when images fail to load or are not provided. Background colors are deterministically generated from the user's name.",
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description: "URL of the avatar image",
    },
    name: {
      control: "text",
      description:
        "User's full name for generating initials and background color",
    },
    size: {
      control: { type: "select", options: [24, 32, 36, 48] },
      description: "Size of the avatar in pixels",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the avatar",
    },
    alt: {
      control: "text",
      description: "Alt text for the avatar image",
    },
  },
};

/**
 * ## Default Avatar
 *
 * Shows the basic avatar with initials fallback.
 */
export const Default = {
  args: {
    name: "John Doe",
    size: 36,
  },
};

/**
 * ## Avatar with Image
 *
 * Displays an avatar with a profile image.
 */
export const WithImage = {
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "John Doe",
    size: 36,
    alt: "John Doe's profile picture",
  },
};

/**
 * ## Avatar Sizes
 *
 * Different predefined sizes for various use cases.
 */

/**
 * ### Small Avatar (24px)
 * Perfect for compact layouts like comment threads or small user lists.
 */
export const Small = {
  args: {
    name: "Alice Smith",
    size: 24,
  },
};

/**
 * ### Medium Avatar (32px)
 * Good balance between visibility and space efficiency.
 */
export const Medium = {
  args: {
    name: "Bob Johnson",
    size: 32,
  },
};

/**
 * ### Large Avatar (36px)
 * Default size, suitable for most user interface contexts.
 */
export const Large = {
  args: {
    name: "Charlie Brown",
    size: 36,
  },
};

/**
 * ### Extra Large Avatar (48px)
 * Ideal for profile pages or prominent user displays.
 */
export const ExtraLarge = {
  args: {
    name: "Diana Prince",
    size: 48,
  },
};

/**
 * ## Color Variations
 *
 * Demonstrates how different names generate different background colors.
 */
export const ColorVariations = () => (
  <div className="flex flex-wrap gap-4">
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Alice Johnson" size={36} />
      <span className="text-xs text-neutral-600">Alice Johnson</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Bob Smith" size={36} />
      <span className="text-xs text-neutral-600">Bob Smith</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Charlie Brown" size={36} />
      <span className="text-xs text-neutral-600">Charlie Brown</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Diana Prince" size={36} />
      <span className="text-xs text-neutral-600">Diana Prince</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Eve Wilson" size={36} />
      <span className="text-xs text-neutral-600">Eve Wilson</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Frank Miller" size={36} />
      <span className="text-xs text-neutral-600">Frank Miller</span>
    </div>
  </div>
);

/**
 * ## Name Variations
 *
 * Shows how different name formats are handled.
 */

/**
 * ### Single Name
 * Handles names with only one part.
 */
export const SingleName = {
  args: {
    name: "Madonna",
    size: 36,
  },
};

/**
 * ### Long Name
 * Handles names with multiple parts.
 */
export const LongName = {
  args: {
    name: "Christopher Alexander John Smith",
    size: 36,
  },
};

/**
 * ### Empty Name
 * Fallback behavior when no name is provided.
 */
export const EmptyName = {
  args: {
    name: "",
    size: 36,
  },
};

/**
 * ## Image States
 *
 * Demonstrates different image loading scenarios.
 */

/**
 * ### Image Loading
 * Shows avatar while image is loading.
 */
export const ImageLoading = {
  args: {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Loading User",
    size: 36,
  },
};

/**
 * ### Image Error Fallback
 * Shows how the component falls back to initials when image fails to load.
 */
export const ImageErrorFallback = {
  args: {
    src: "https://invalid-image-url-that-will-fail.jpg",
    name: "Error User",
    size: 36,
  },
};

/**
 * ### No Image Provided
 * Shows initials when no image source is provided.
 */
export const NoImage = {
  args: {
    name: "No Image User",
    size: 36,
  },
};

/**
 * ## Custom Styling
 *
 * Customize the appearance using the className prop.
 */
export const CustomStyling = {
  args: {
    name: "Custom User",
    size: 36,
    className: "ring-2 ring-primary-500 ring-offset-2",
  },
};

/**
 * ## Interactive Playground
 *
 * Experiment with all available props and see the results in real-time.
 */
export const Playground = {
  args: {
    src: "",
    name: "Playground User",
    size: 36,
    className: "",
    alt: "User avatar",
  },
};

/**
 * ## Props Documentation
 *
 * | Prop | Type | Default | Required | Description |
 * |------|------|---------|----------|-------------|
 * | `src` | `string` | `undefined` | No | URL of the avatar image |
 * | `name` | `string` | `""` | No | User's full name for generating initials and background color |
 * | `size` | `number` | `36` | No | Size of the avatar in pixels (24, 32, 36, 48) |
 * | `className` | `string` | `""` | No | Additional CSS classes |
 * | `alt` | `string` | `"avatar"` | No | Alt text for the avatar image |
 */

/**
 * ## How It Works
 *
 * ### Color Generation
 * The component uses a deterministic algorithm to generate background colors from the user's name:
 * ```javascript
 * function nameToColor(name) {
 *   // Hash the name to get a consistent color
 *   let hash = 0;
 *   for (let i = 0; i < name.length; i++) {
 *     hash = name.charCodeAt(i) + ((hash << 5) - hash);
 *   }
 *   return PALETTE[Math.abs(hash) % PALETTE.length];
 * }
 * ```
 *
 * ### Initials Generation
 * Initials are extracted from the name:
 * ```javascript
 * function initialsFromName(name) {
 *   const parts = name.trim().split(/\s+/).filter(Boolean);
 *   if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
 *   return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
 * }
 * ```
 */

/**
 * ## Accessibility Features
 *
 * - Uses semantic `img` element with proper `alt` text for images
 * - Provides `title` attribute with full name for initials fallback
 * - Maintains consistent aspect ratio (square)
 * - Supports keyboard navigation (when used in interactive contexts)
 * - Color contrast meets WCAG guidelines for text readability
 * - Screen reader friendly with meaningful alt text
 *
 * ## Best Practices
 *
 * ✅ **DO:**
 * - Provide meaningful `alt` text for images
 * - Use consistent sizes from the predefined options
 * - Include full names when available for better initials generation
 * - Test with various name formats (single, multiple parts, long names)
 * - Use the component in contexts where user identification is important
 *
 * ❌ **DON'T:**
 * - Use arbitrary sizes not in the predefined list
 * - Rely solely on images without providing names for fallback
 * - Use generic alt text like "avatar" or "user"
 * - Override default styling unless absolutely necessary
 * - Use for decorative purposes where user identification isn't needed
 *
 * ## Performance Considerations
 *
 * - Images are loaded lazily and only when `src` is provided
 * - Fallback to initials happens immediately without network requests
 * - Color calculation is done client-side with minimal computation
 * - Component re-renders only when props change
 */

/**
 * ## Edge Cases
 *
 * ### Very Long Names
 * Handles names with many parts gracefully.
 */
export const VeryLongName = {
  args: {
    name: "Dr. Maria Consuela Rodriguez Garcia Hernandez",
    size: 36,
  },
};

/**
 * ### Special Characters in Names
 * Handles names with special characters and diacritics.
 */
export const SpecialCharacters = {
  args: {
    name: "José María González",
    size: 36,
  },
};

/**
 * ### Numbers in Names
 * Handles names that include numbers.
 */
export const NumbersInName = {
  args: {
    name: "John Doe 123",
    size: 36,
  },
};

/**
 * ## Usage Examples
 *
 * ### User Profile Card
 * Common pattern for displaying user information.
 */
export const UserProfileCard = () => (
  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
    <Avatar
      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      name="Sarah Johnson"
      size={48}
      alt="Sarah Johnson's profile"
    />
    <div>
      <h3 className="font-semibold text-neutral-900">Sarah Johnson</h3>
      <p className="text-sm text-neutral-600">Product Manager</p>
    </div>
  </div>
);

/**
 * ### Comment Thread
 * Small avatars in comment sections.
 */
export const CommentThread = () => (
  <div className="space-y-3">
    <div className="flex gap-3">
      <Avatar name="Alice Cooper" size={32} />
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">Alice Cooper</span> Great work on this
          feature!
        </p>
      </div>
    </div>
    <div className="flex gap-3">
      <Avatar name="Bob Dylan" size={32} />
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">Bob Dylan</span> I agree, this looks
          amazing.
        </p>
      </div>
    </div>
  </div>
);

/**
 * ### User List
 * Grid layout with multiple avatars.
 */
export const UserList = () => (
  <div className="grid grid-cols-4 gap-4">
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Emma Watson" size={48} />
      <span className="text-center text-xs">Emma Watson</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Tom Hanks" size={48} />
      <span className="text-center text-xs">Tom Hanks</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Natalie Portman" size={48} />
      <span className="text-center text-xs">Natalie Portman</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Avatar name="Leonardo DiCaprio" size={48} />
      <span className="text-center text-xs">Leonardo DiCaprio</span>
    </div>
  </div>
);
