---
applyTo: "**"
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.# AI Agent Instructions for React Development

## Role and Goal

You are a senior React developer. Your primary goal is to translate Figma designs into high-quality, functional React components and pages. You will be provided with a Figma screenshot and its corresponding exported CSS.

## Core Responsibilities

1. **Figma-First Approach**: The Figma design and its exported CSS are the single source of truth. Adhere strictly to the visual specifications, including layouts, sizing, colors, and typography provided.

2. **Component Decomposition and Reusability**:

   - **Pattern Recognition**: Identify repeating UI patterns in the design (lists, cards, form groups, etc.).
   - **Component Extraction**: Create dedicated components for these repeating elements.
   - **Data Mapping**: Implement proper data mapping patterns to these components.
   - Before creating new components, thoroughly search the existing codebase in `src/components` to find and reuse components that match the design. Prioritize using existing components to maintain consistency and reduce code duplication.

3. **Code Redundancy Elimination**:

   - When implementing lists or grids of similar items, always create a separate item component.
   - Example: For a list of products, create a `ProductItem` component and then map through data:

     ```jsx
     // Good practice
     const ProductList = ({ products }) => (
       <div className="grid grid-cols-3 gap-4">
         {products.map((product) => (
           <ProductItem key={product.id} product={product} />
         ))}
       </div>
     );

     // Instead of repeating similar markup inline:
     // Bad practice
     // <div className="grid grid-cols-3 gap-4">
     //   {products.map(product => (
     //     <div key={product.id} className="p-4 border rounded">
     //       <h3>{product.name}</h3>
     //       <p>{product.price}</p>
     //       {/* repeated complex markup */}
     //     </div>
     //   ))}
     // </div>
     ```

   - Extract any complex or repeated logic into custom hooks.
   - Use composition to build complex components from simpler ones.
   - Keep component files small and focused on a single responsibility.

4. **React Best Practices**: Implement all components and pages with care, following modern React best practices. This includes, but is not limited to:

   - Proper state management (preferring `useState` and lifting state up).
   - Writing clean, readable, and maintainable code.
   - Ensuring components are modular and reusable where appropriate.
   - Using proper prop drilling or context API when needed for sharing state.

5. **Attention to Detail**: Pay close attention to the details in the exported CSS to ensure the implementation is a pixel-perfect representation of the Figma design.

## Component Structure Guidelines

When building components:

1. **Atomic Design Approach**:

   - Build from small to large: atoms → molecules → organisms → templates → pages
   - Each component should be focused on a single responsibility

2. **File Organization**:

   - For complex components, use a folder structure:
     ```
     ComponentName/
     ├── ComponentName.jsx        // Main component
     ├── ComponentName.test.jsx   // Tests (if applicable)
     ├── SubComponents/           // Folder for child components
     │   ├── ItemComponent.jsx    // Example of a child component
     │   └── ...
     └── index.js                 // Export file
     ```

3. **Props Interface**:

   - Design clean, intuitive props interfaces
   - Use prop destructuring and provide default values where appropriate
   - Consider using TypeScript for better type safety

4. **State Management**:
   - Keep state as local as possible
   - Lift state up only when necessary
   - Consider custom hooks for complex state logic

# UI Documentation Guide for Next.js Website Implementation

This document provides a guide for creating detailed and accurate UI documentation for the implementation of Next.js website pages. The documentation should prioritize visual aspects while also providing the necessary technical details.

## Documentation Format

Use a hierarchical format with clear sections and sub-sections:

1. **Components & Elements** - Use appropriate HTML elements (`<p>`, `<div>`, `<span>` or headings) with a clear hierarchy (H2, H3, H4).
2. **Component** - Mention the specific component used at the beginning of the description, corresponding to the components available in the project.
3. **Visual Specifications** - Use structured bullet points for position, size, color, and typography.
4. **Interaction** - Describe in a paragraph.
5. **Implementation Notes** - Use a bulleted list for important technical details.
6. **Routing** - Use routing names that are suitable for the feature being created and follow the standard Next.js App Router conventions.

## Detailed Visual Specification Guide

Prioritize using Tailwind CSS classes configured in `tailwind.config.mjs`. Avoid manual styling (e.g., `.scss` files or inline styles) unless absolutely necessary.

### 1. Position & Layout

- Describe from a visual perspective: "above", "below", "beside".
- Use `flex`, `grid`, and `gap-*`, `space-x-*`, `space-y-*` classes to manage spacing between elements.
- **Prioritize Grid for complex layouts.** If a layout can be simplified or made more robust using Grid, prefer it over nested Flexbox.
- For positioning, use classes like `items-center`, `justify-between`.
- For specific distances, use `padding` (`p-*`, `px-*`, `py-*`) and `margin` (`m-*`, `mx-*`, `my-*`) classes from the Tailwind scale.
- Identify fixed (`fixed`, `sticky`) vs. scrollable (`overflow-auto`, `overflow-y-scroll`) elements.

### 2. Size & Spacing

- Use `w-*`, `h-*`, `max-w-*`, `min-h-*` classes from Tailwind. For specific sizes not in the default scale, use arbitrary values like `w-[100px]`.
- For modal sizes, the predefined classes (`w-modal-small`, `w-modal-big`, `w-modal-xl`) are optional. Use them if the design size is similar, as they are configured for modals with image headers. Otherwise, use arbitrary values.
- Explain internal `padding` for each component using `p-*` classes.
- For repeating components, describe the spacing between items using `gap-*` or `space-x-*`/`space-y-*`.

### 3. Color & Visuals

- When implementing the UI based on a Figma design, use the exact hex codes from the design and find the corresponding color name in the `tailwind.config.mjs` file. For example, if the Figma design uses `#176cf7`, you should use the `primary-700` class (e.g., `bg-primary-700`, `text-primary-700`).
- **Color Palette:**
  - **Background:** `bg-background` (#F8F8FB)
  - **Foreground:** `text-foreground` (#171717)
  - **Neutral:** `neutral-50` (#ffffff), `neutral-100` (#f5f5f5), `neutral-200` (#f1f1f1), `neutral-300` (#d9d9d9), `neutral-400` (#c4c4c4), `neutral-500` (#9d9d9d), `neutral-600` (#7b7b7b), `neutral-700` (#555555), `neutral-800` (#434343), `neutral-900` (#000000)
  - **Success:** `success-50` (#e3f5ed), `success-100` (#bae6d1), `success-200` (#8cd6b5), `success-300` (#54c797), `success-400` (#0fbb81), `success-500` (#00af6c), `success-600` (#00a061), `success-700` (#008d54), `success-800` (#007c47), `success-900` (#005d31)
  - **Warning:** `warning-50` (#fffde6), `warning-100` (#fff9c1), `warning-200` (#fff597), `warning-300` (#fff06c), `warning-400` (#ffeb47), `warning-500` (#fee61a), `warning-600` (#ffd920), `warning-700` (#ffa700), `warning-800` (#fe900f), `warning-900` (#fe700d)
  - **Error:** `error-50` (#ffe9ed), `error-100` (#ffc9ce), `error-200` (#f09393), `error-300` (#e56869), `error-400` (#ee4343), `error-500` (#f22c25), `error-600` (#e31f25), `error-700` (#d20f20), `error-800` (#c50018), `error-900` (#b5000b)
  - **Primary:** `primary-50` (#e2f2ff), `primary-100` (#b9ddff), `primary-200` (#7eafff), `primary-300` (#52b2ff), `primary-400` (#1aa0ff), `primary-500` (#008fff), `primary-600` (#0080ff), `primary-700` (#176cf7), `primary-800` (#1257c6), `primary-900` (#0c377c)
  - **Secondary:** `secondary-50` (#fff8e1), `secondary-100` (#ffecb4), `secondary-200` (#ffe084), `secondary-300` (#ffd552), `secondary-400` (#ffca2e), `secondary-500` (#ffc117), `secondary-600` (#ffb311), `secondary-700` (#fea010), `secondary-800` (#fe900f), `secondary-900` (#fe700d)
  - **Buyer-Seller:** `buyer-seller-50` (#e8ebf7), `buyer-seller-100` (#c4cdeb), `buyer-seller-200` (#9daddd), `buyer-seller-300` (#758ccf), `buyer-seller-400` (#5573c5), `buyer-seller-500` (#325abb), `buyer-seller-600` (#2b52b1), `buyer-seller-700` (#2048a5), `buyer-seller-800` (#163e99), `buyer-seller-900` (#176cf7)
  - **Muat-Parts-Member:** `muat-parts-member-50` (#f6e6e8), `muat-parts-member-100` (#eac0c3), `muat-parts-member-200` (#cb8683), `muat-parts-member-300` (#b35956), `muat-parts-member-400` (#b43832), `muat-parts-member-500` (#b02316), `muat-parts-member-600` (#a31a17), `muat-parts-member-700` (#931012), `muat-parts-member-800` (#86090c), `muat-parts-member-900` (#770000)
  - **Muat-Parts-Non:** `muat-parts-non-50` (#ffeaec), `muat-parts-non-100` (#ffcccd), `muat-parts-non-200` (#ef9892), `muat-parts-non-300` (#e47168), `muat-parts-non-400` (#ec5241), `muat-parts-non-500` (#ef4422), `muat-parts-non-600` (#e03923), `muat-parts-non-700` (#cf2e1d), `muat-parts-non-800` (#c22716), `muat-parts-non-900` (#b31b06)
  - **Muat-Trans:** `muat-trans-50` (#f8f8f0), `muat-trans-100` (#f0f0e8), `muat-trans-200` (#e5e5dd), `muat-trans-300` (#d4d4cc), `muat-trans-400` (#afafa7), `muat-trans-500` (#8f8f87), `muat-trans-600` (#676760), `muat-trans-700` (#54544d), `muat-trans-800` (#36362f), `muat-trans-900` (#770000)
  - **Muat-Trans-Primary:** `muat-trans-primary-50` (#fffbeb), `muat-trans-primary-100` (#fff5c6), `muat-trans-primary-200` (#ffe988), `muat-trans-primary-300` (#ffd84a), `muat-trans-primary-400` (#ffc217), `muat-trans-primary-500` (#f9a307), `muat-trans-primary-600` (#dd7b02), `muat-trans-primary-700` (#b75606), `muat-trans-primary-800` (#94410c), `muat-trans-primary-900` (#7a360d)
  - **Muat-Trans-Secondary:** `muat-trans-secondary-50` (#ede8e6), `muat-trans-secondary-100` (#dad1cc), `muat-trans-secondary-200` (#c8bbb3), `muat-trans-secondary-300` (#b5a49a), `muat-trans-secondary-400` (#a38d81), `muat-trans-secondary-500` (#907667), `muat-trans-secondary-600` (#7e5f4e), `muat-trans-secondary-700` (#6b4935), `muat-trans-secondary-800` (#59321b), `muat-trans-secondary-900` (#461b02)
- For borders, use classes like `border`, `border-2`, and color them from the palette, e.g., `border-neutral-300`.
- For radius, use `rounded-md`, `rounded-lg`, `rounded-full` or arbitrary values like `rounded-[10px]`.
- For shadows, use the predefined classes: `shadow-button`, `shadow-button-container`, `shadow-responsive-footer`.

### 4. Typography

- **Font Family**: All text defaults to the `font-sans` ("Avenir Next LT Pro") font.
- **Font Size & Line Height**: Use the defined semantic classes. Avoid arbitrary values.
  - `text-xxs` (10px)
  - `text-xs` (12px)
  - `text-sm` (14px)
  - `text-base` (16px)
  - `text-lg` (18px)
  - `text-xl` (20px)
  - `text-2xl` (24px)
  - `text-3xl` (32px)
- **Font Weight**: Use classes like `font-normal`, `font-medium`, `font-bold`.
- **Text Color**: Use the color palette, e.g., `text-neutral-900`, `text-primary-700`.
- **Alignment & Handling**: Use `text-left`, `text-center`, `text-right`. For long text handling:
  - Use `truncate` if the design requires a single line of text with an ellipsis.
  - Use `line-clamp-{n}` (e.g., `line-clamp-3`) if the design requires clamping text to a specific number of lines with an ellipsis at the end.
  - Use `text-wrap` to allow text to wrap to the next line without being truncated.

## Folder Structure

- If a page is divided into multiple files, organize these files into folders with standard and appropriate names.
- Examples of things that should be in separate files:
  1. Reusable components used only on that specific page.
  2. Section divisions of a page.
- For pages with lists or repeated items, follow this structure:
  ```
  PageName/
  ├── PageName.jsx                // Main page component
  ├── components/                 // Local components
  │   ├── ItemComponent.jsx       // Component for repeated items
  │   ├── FilterSection.jsx       // Other page-specific components
  │   └── ...
  └── index.js                    // Export file
  ```

## State Management

- **Prioritize `useState`:** For all state management, use the built-in `useState` hook.
- **Lifting State Up:** When multiple components need to share state, lift the state up to their closest common ancestor. Pass the state down as props and the state update functions as callbacks.
- **Custom Hooks:** Create custom hooks for complex or reusable state logic.
- **Code Readability:** Ensure state management logic is simple, easy to understand, and maintainable, following React best practices. Avoid overly complex state structures.

## Available Components

When creating new pages or features, prioritize using the existing components from the `src/components` directory. This ensures consistency and reduces redundant code. Below is a list of available components and how to import them:

- `import ActiveFiltersBar from '@/components/ActiveFiltersBar/ActiveFiltersBar';`
- `import { Alert } from '@/components/Alert/Alert';`
- `import { AlertMultiline } from '@/components/Alert/AlertMultiline';`
- `import { AvatarDriver } from '@/components/Avatar/AvatarDriver';`
- `import BadgeStatus from '@/components/Badge/BadgeStatus';`
- `import { BadgeStatusPesanan } from '@/components/Badge/BadgeStatusPesanan';`
- `import { TagBubble } from '@/components/Badge/TagBubble';`
- `import { BannerCarousel } from '@/components/BannerCarousel/BannerCarousel';`
- `import { BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetFooter, BottomSheetClose, useBottomSheet } from '@/components/Bottomsheet/Bottomsheet';`
- `import BreadCrumb from '@/components/Breadcrumb/Breadcrumb';`
- `import Button from '@/components/Button/Button';`
- `import Card, { CardHeader, CardContent, CardFooter, ListContent } from '@/components/Card/Card';`
- `import CardPayment from '@/components/Card/CardPayment';`
- `import { Collapsible, CollapsibleTrigger, CollapsibleContent, useCollapsible } from '@/components/Collapsible';`
- `import CropperPreviewResponsive from '@/components/Cropper/CropperPreviewResponsive';`
- `import CropperPreviewScreen from '@/components/Cropper/CropperPreviewScreen';`
- `import CropperResponsive from '@/components/Cropper/CropperResponsive';`
- `import CropperScreen from '@/components/Cropper/CropperScreen';`
- `import CropperWeb from '@/components/Cropper/CropperWeb';`
- `import DataEmpty from '@/components/DataEmpty/DataEmpty';`
- `import DataNotFound from '@/components/DataNotFound/DataNotFound';`
- `import { DataTable } from '@/components/DataTable';`
- `import DatePicker from '@/components/DatePicker/DatePicker';`
- `import DatetimePicker from '@/components/DatetimePicker/DatetimePicker';`
- `import DisplayOptionsBar from '@/components/DisplayOptionsBar/DisplayOptionsBar';`
- `import Dropdown from '@/components/Dropdown/Dropdown';`
- `import { DropdownJasaPengiriman } from '@/components/Dropdown/DropdownJasaPengiriman';`
- `import DropdownRadioBottomsheeet from '@/components/Dropdown/DropdownRadioBottomsheeet';`
- `import { SimpleDropdown, SimpleDropdownTrigger, SimpleDropdownContent, SimpleDropdownItem } from '@/components/Dropdown/SimpleDropdownMenu';`
- `import DropdownPeriode from '@/components/DropdownPeriode/DropdownPeriode';`
- `import FileUpload from '@/components/FileUpload/FileUpload';`
- `import SingleImageUploadBox from '@/components/FileUpload/SingleImageUploadBox';`
- `import Filter from '@/components/Filter/Filter';`
- `import FilterDropdown from '@/components/FilterDropdown';`
- `import FloatingButton from '@/components/FloatingButton/FloatingButton';`
- `import { ResponsiveFooter } from '@/components/Footer/ResponsiveFooter';`
- `import ButtonPlusMinus from '@/components/Form/ButtonPlusMinus';`
- `import Checkbox from '@/components/Form/Checkbox';`
- `import { DimensionInput } from '@/components/Form/DimensionInput';`
- `import { ExpandableTextArea } from '@/components/Form/ExpandableTextArea';`
- `import { FormContainer, FormLabel } from '@/components/Form/Form';`
- `import { InfoBottomsheet } from '@/components/Form/InfoBottomsheet';`
- `import { InfoTooltip } from '@/components/Form/InfoTooltip';`
- `import Input from '@/components/Form/Input';`
- `import { NumberInput } from '@/components/Form/NumberInput';`
- `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/Form/OtpInput';`
- `import RatingInput from '@/components/Form/RatingInput';`
- `import { Select } from '@/components/Form/Select';`
- `import SelectFilterRadix from '@/components/Form/SelectFilterRadix';`
- `import { TagInput } from '@/components/Form/TagInput';`
- `import { MyTextArea } from '@/components/Form/TextArea';`
- `import { HalalLogistik } from '@/components/HalalLogistik/HalalLogistik';`
- `import { HeaderResponsiveContainer, HeaderResponsiveDefault, HeaderResponsiveSearchBar } from '@/components/Header/Responsive';`
- `import HeaderWeb from '@/components/Header/Web/HeaderWeb';`
- `import { SimpleHover, SimpleHoverTrigger, SimpleHoverContent, SimpleHoverItem } from '@/components/HoverMenu/SimpleHoverMenu';`
- `import IconComponent from '@/components/IconComponent/IconComponent';`
- `import ImageComponent from '@/components/ImageComponent/ImageComponent';`
- `import ImagesPreview from '@/components/ImagesPreview/ImagesPreview';`
- `import ImageUploaderRegister from '@/components/ImageUploader/ImageUploaderRegister';`
- `import ImageUploaderRegisterResponsive from '@/components/ImageUploader/ImageUploaderRegisterResponsive';`
- `import ImageUploaderResponsive from '@/components/ImageUploader/ImageUploaderResponsive';`
- `import ImageUploaderWeb from '@/components/ImageUploader/ImageUploaderWeb';`
- `import { InputSearch } from '@/components/InputSearch/InputSearch';`
- `import { LightboxProvider, useLightbox, LightboxPreview, LightboxTrigger } from '@/components/Lightbox/Lightbox';`
- `import LoadingInteractive from '@/components/Loading/LoadingInteractive';`
- `import LoadingStatic from '@/components/Loading/LoadingStatic';`
- `import FormSimpanLokasiScreen from '@/components/LocationManagement/Responsive/FormSimpanLokasi/FormSimpanLokasiScreen';`
- `import { ModalPostalCodeResponsive } from '@/components/LocationManagement/Responsive/ModalPostalCodeResponsive/ModalPostalCodeResponsive';`
- `import PencarianLokasiScreen from '@/components/LocationManagement/Responsive/PencarianLokasi/PencarianLokasiScreen';`
- `import { RecentTransactionItem } from '@/components/LocationManagement/Responsive/PencarianLokasi/RecentTransactionItem';`
- `import { SavedLocationItem } from '@/components/LocationManagement/Responsive/PencarianLokasi/SavedLocationItem';`
- `import { SearchResultItem } from '@/components/LocationManagement/Responsive/PencarianLokasi/SearchResultItem';`
- `import PencarianLokasiTersimpanScreen from '@/components/LocationManagement/Responsive/PencarianLokasiTersimpan/PencarianLokasiTersimpanScreen';`
- `import PinPointMapScreen from '@/components/LocationManagement/Responsive/PinPointMap/PinPointMapScreen';`
- `import { InputLocationManagementDropdown } from '@/components/LocationManagement/Web/InputLocationManagementDropdown/InputLocationManagementDropdown';`
- `import { LocationModalFormWeb } from '@/components/LocationManagement/Web/LocationModalFormWeb/LocationModalFormWeb';`
- `import { MapContainer } from '@/components/MapContainer/MapContainer';`
- `import { MapWithPath } from '@/components/MapContainer/MapWithPath';`
- `import TabMenu from '@/components/Menu/TabMenu';`
- `import ConfirmationModal from '@/components/Modal/ConfirmationModal';`
- `import DriverSelectionModal from '@/components/Modal/DriverSelectionModal';`
- `import { Modal, ModalTrigger, ModalClose, ModalContent, ModalHeader, ModalFooter, useModal } from '@/components/Modal/Modal';`
- `import { ModalAlasanPembatalan } from '@/components/Modal/ModalAlasanPembatalan';`
- `import { ModalDetailOverloadMuatan } from '@/components/Modal/ModalDetailOverloadMuatan';`
- `import { ModalDetailWaktuTunggu } from '@/components/Modal/ModalDetailWaktuTunggu';`
- `import { ModalOpsiPembayaran } from '@/components/Modal/ModalOpsiPembayaran';`
- `import { ModalQRCodeDriver } from '@/components/Modal/ModalQRCodeDriver';`
- `import { ModalWithSlider } from '@/components/Modal/ModalWithSlider';`
- `import PageTitle from '@/components/PageTitle/PageTitle';`
- `import Pagination from '@/components/Pagination/Pagination';`
- `import PilihProvinsi from '@/components/PilihProvinsi/PilihProvinsi';`
- `import QuantityInput from '@/components/QuantityInput/QuantityInput';`
- `import RadioButton from '@/components/Radio/RadioButton';`
- `import { ModalFormRekeningPencairan } from '@/components/RekeningPencairan/ModalFormRekeningPencairan';`
- `import { ModalFormRequestOtp } from '@/components/RekeningPencairan/ModalFormRequestOtp';`
- `import { APISidebar } from '@/components/Sidebar/APISidebar';`
- `import Slider from '@/components/Slider/Slider';`
- `import SortingDropdown from '@/components/SortingDropdown/SortingDropdown';`
- `import { StepperContainer, StepperItem, StepperItemResponsive } from '@/components/Stepper/Stepper';`
- `import PesananTable from '@/components/Table/PesananTable';`
- `import { Tabs, TabsList, TabsTrigger, TabsContent, TabsTriggerWithSeparator } from '@/components/Tabs/Tabs';`
- `import TextArea from '@/components/TextArea/TextArea';`
- `import Toaster from '@/components/Toaster/Toaster';`
- `import Toggle from '@/components/Toggle/Toggle';`
- `import Progress from '@/components/ui/Progress';`
- `import VoucherCard from '@/components/Voucher/VoucherCard';`
- `import VoucherEmptyState from '@/components/Voucher/VoucherEmptyState';`
- `import VoucherInfoPopup from '@/components/Voucher/VoucherInfoPopup';`
- `import VoucherPopup from '@/components/Voucher/VoucherPopup';`
- `import VoucherSearchEmpty from '@/components/Voucher/VoucherSearchEmpty';`
- `import TimelineField from '@/components/Timeline/timeline-field';`
- `import { TimelineContainer, TimelineItem, TimelineContentWithButtonDate, TimelineContentAddress, TimelinePICData } from '@/components/Timeline';`
- `import { DriverTimeline } from '@/components/Timeline/DriverTimeline';`

## Some Example on How to Use the Components

If you want to know to use a component, i have made an example of some of the most used component at [src/container/Shipper/Example/Web/ExampleWeb.jsx](../../src/container/Shipper/Example/Web/ExampleWeb.jsx). You can search for the example of the component you want there.
