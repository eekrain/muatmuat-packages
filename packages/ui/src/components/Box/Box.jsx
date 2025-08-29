import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const boxVariants = cva('', {
  variants: {
    display: {
      block: 'block',
      inline: 'inline',
      'inline-block': 'inline-block',
      flex: 'flex',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      hidden: 'hidden',
    },
    position: {
      static: 'static',
      fixed: 'fixed',
      absolute: 'absolute',
      relative: 'relative',
      sticky: 'sticky',
    },
    overflow: {
      visible: 'overflow-visible',
      hidden: 'overflow-hidden',
      auto: 'overflow-auto',
      scroll: 'overflow-scroll',
    },
  },
  defaultVariants: {
    display: 'block',
    position: 'static',
    overflow: 'visible',
  },
});

/**
 * @typedef {Object} BoxProps
 * @property {React.ElementType} [as='div'] - The HTML element or component to render
 * @property {'block'|'inline'|'inline-block'|'flex'|'inline-flex'|'grid'|'hidden'} [display] - Display property
 * @property {'static'|'fixed'|'absolute'|'relative'|'sticky'} [position] - Position property
 * @property {string|number} [p] - Padding all sides
 * @property {string|number} [px] - Padding horizontal
 * @property {string|number} [py] - Padding vertical
 * @property {string|number} [pt] - Padding top
 * @property {string|number} [pb] - Padding bottom
 * @property {string|number} [pl] - Padding left
 * @property {string|number} [pr] - Padding right
 * @property {string|number} [m] - Margin all sides
 * @property {string|number} [mx] - Margin horizontal
 * @property {string|number} [my] - Margin vertical
 * @property {string|number} [mt] - Margin top
 * @property {string|number} [mb] - Margin bottom
 * @property {string|number} [ml] - Margin left
 * @property {string|number} [mr] - Margin right
 * @property {string|number} [w] - Width
 * @property {string|number} [h] - Height
 * @property {string|number} [maxW] - Max width
 * @property {string|number} [maxH] - Max height
 * @property {string|number} [minW] - Min width
 * @property {string|number} [minH] - Min height
 * @property {string} [bg] - Background color
 * @property {boolean|string} [border] - Border
 * @property {string} [borderRadius] - Border radius
 * @property {string} [shadow] - Box shadow
 * @property {'visible'|'hidden'|'auto'|'scroll'} [overflow] - Overflow property
 * @property {string} [flex] - Flex property
 * @property {'row'|'row-reverse'|'col'|'col-reverse'} [flexDirection] - Flex direction
 * @property {'start'|'center'|'end'|'stretch'|'baseline'} [alignItems] - Align items
 * @property {'start'|'center'|'end'|'between'|'around'|'evenly'} [justifyContent] - Justify content
 * @property {string|number} [gap] - Gap between flex/grid items
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [children] - Child elements
 */

/**
 * Box component for layout and spacing
 * @param {BoxProps & React.HTMLAttributes<HTMLElement>} props
 */
const Box = ({
  as: Component = 'div',
  display,
  position,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  w,
  h,
  maxW,
  maxH,
  minW,
  minH,
  bg,
  border,
  borderRadius,
  shadow,
  overflow,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  className,
  children,
  ...props
}) => {
  const dynamicClasses = [];

  // Padding
  if (p !== undefined) dynamicClasses.push(`p-${p}`);
  if (px !== undefined) dynamicClasses.push(`px-${px}`);
  if (py !== undefined) dynamicClasses.push(`py-${py}`);
  if (pt !== undefined) dynamicClasses.push(`pt-${pt}`);
  if (pb !== undefined) dynamicClasses.push(`pb-${pb}`);
  if (pl !== undefined) dynamicClasses.push(`pl-${pl}`);
  if (pr !== undefined) dynamicClasses.push(`pr-${pr}`);

  // Margin
  if (m !== undefined) dynamicClasses.push(`m-${m}`);
  if (mx !== undefined) dynamicClasses.push(`mx-${mx}`);
  if (my !== undefined) dynamicClasses.push(`my-${my}`);
  if (mt !== undefined) dynamicClasses.push(`mt-${mt}`);
  if (mb !== undefined) dynamicClasses.push(`mb-${mb}`);
  if (ml !== undefined) dynamicClasses.push(`ml-${ml}`);
  if (mr !== undefined) dynamicClasses.push(`mr-${mr}`);

  // Width & Height
  if (w !== undefined) {
    if (w === 'full') dynamicClasses.push('w-full');
    else if (w === 'screen') dynamicClasses.push('w-screen');
    else if (w === 'auto') dynamicClasses.push('w-auto');
    else dynamicClasses.push(`w-${w}`);
  }
  if (h !== undefined) {
    if (h === 'full') dynamicClasses.push('h-full');
    else if (h === 'screen') dynamicClasses.push('h-screen');
    else if (h === 'auto') dynamicClasses.push('h-auto');
    else dynamicClasses.push(`h-${h}`);
  }
  if (maxW !== undefined) dynamicClasses.push(`max-w-${maxW}`);
  if (maxH !== undefined) dynamicClasses.push(`max-h-${maxH}`);
  if (minW !== undefined) dynamicClasses.push(`min-w-${minW}`);
  if (minH !== undefined) dynamicClasses.push(`min-h-${minH}`);

  // Background
  if (bg !== undefined) {
    if (bg === 'transparent') dynamicClasses.push('bg-transparent');
    else if (bg === 'white') dynamicClasses.push('bg-white');
    else if (bg === 'black') dynamicClasses.push('bg-black');
    else dynamicClasses.push(`bg-${bg}`);
  }

  // Border
  if (border !== undefined) {
    if (border === true) dynamicClasses.push('border');
    else if (border === false) dynamicClasses.push('border-0');
    else dynamicClasses.push(`border-${border}`);
  }

  // Border Radius
  if (borderRadius !== undefined) {
    const radiusMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };
    dynamicClasses.push(radiusMap[borderRadius] || `rounded-${borderRadius}`);
  }

  // Shadow
  if (shadow !== undefined) {
    const shadowMap = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };
    dynamicClasses.push(shadowMap[shadow] || `shadow-${shadow}`);
  }

  // Flexbox
  if (flex !== undefined) dynamicClasses.push(`flex-${flex}`);
  if (flexDirection !== undefined) {
    const directionMap = {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      col: 'flex-col',
      'col-reverse': 'flex-col-reverse',
    };
    dynamicClasses.push(directionMap[flexDirection]);
  }
  if (alignItems !== undefined) {
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };
    dynamicClasses.push(alignMap[alignItems]);
  }
  if (justifyContent !== undefined) {
    const justifyMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };
    dynamicClasses.push(justifyMap[justifyContent]);
  }
  if (gap !== undefined) dynamicClasses.push(`gap-${gap}`);

  return (
    <Component
      className={cn(
        boxVariants({ display, position, overflow }),
        dynamicClasses.join(' '),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Box;