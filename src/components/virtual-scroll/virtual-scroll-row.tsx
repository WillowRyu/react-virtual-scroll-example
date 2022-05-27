import { ReactNode } from "react";

interface VirtualScrollRowProps {
  rowStart: number;
  rowHeight?: number;
  children?: ReactNode;
}

export const VirtualScrollRow = ({
  rowStart,
  rowHeight = 30,
  children,
}: VirtualScrollRowProps) => {
  return (
    <div
      style={{
        transform: `translateY(${rowStart}px)`,
      }}
      className={`absolute top-0 left-0 flex items-center h-[${rowHeight}px]`}
    >
      {children}
    </div>
  );
};
