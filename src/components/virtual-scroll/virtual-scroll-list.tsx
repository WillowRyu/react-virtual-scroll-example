import { forwardRef, ReactNode } from "react";

interface VirtualScrollListProps {
  height?: number;
  totalHeight: number;
  children?: ReactNode;
}

export const VirtualScrollList = forwardRef<
  HTMLDivElement,
  VirtualScrollListProps
>(({ height, totalHeight, children }, ref) => {
  return (
    <div
      className="overflow-auto"
      style={{
        height: `${height ? `${height}px` : "100%"}`,
      }}
      ref={ref}
    >
      <div
        className="relative"
        style={{
          height: `${totalHeight ? `${totalHeight}px` : "100%"}`,
        }}
      >
        {children}
      </div>
    </div>
  );
});
