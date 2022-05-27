import { RefObject, useEffect, useRef, useState } from "react";
import {
  fromEvent,
  map,
  merge,
  Observable,
  pluck,
  Subscription,
  throttleTime,
} from "rxjs";

interface UseVirtualScrollHookProps<T> {
  data: Array<T>;
  rowHeight?: number;
  rowExtraLength?: number;
}

interface VirtualRow<T> {
  rowIndex: number;
  rowStart: number;
  data: T;
}

export const useVirtualScrollHook = <T>({
  data,
  rowHeight = 30,
  rowExtraLength = 3,
  dataListRef,
}: UseVirtualScrollHookProps<T> & {
  dataListRef: RefObject<HTMLDivElement>;
}) => {
  const [virtualRows, setVirtualRows] = useState<VirtualRow<T>[]>([]);
  const totalHeight = useRef<number>(0);
  const listData = useRef<VirtualRow<T>[]>([]);

  useEffect(() => {
    let scroll$: Observable<WheelEvent>;
    let wheel$: Observable<WheelEvent>;
    let scrollEvent$: Subscription;

    const calculateDataViewRange = (scrollTop: number) => {
      if (dataListRef.current) {
        const clientHeight = dataListRef.current.clientHeight;
        const dataTotalHeight = totalHeight.current;
        const extraRowSize = rowHeight * rowExtraLength;

        const start =
          scrollTop - extraRowSize > 0 ? scrollTop - extraRowSize : 0;
        const end =
          scrollTop + clientHeight + extraRowSize >= dataTotalHeight
            ? dataTotalHeight
            : scrollTop + clientHeight + extraRowSize;

        return {
          start,
          end,
        };
      }
      return {
        start: 0,
        end: 0,
      };
    };

    totalHeight.current = data.length * rowHeight;
    listData.current = data.map((v, i) => ({
      rowIndex: i,
      data: v,
      rowStart: i * rowHeight,
    }));

    if (dataListRef.current) {
      scroll$ = fromEvent<WheelEvent>(dataListRef.current, "scroll");
      wheel$ = fromEvent<WheelEvent>(dataListRef.current, "scroll");

      setVirtualRows(
        listData.current.filter(
          (v) =>
            0 <= v.rowIndex * rowHeight &&
            (dataListRef.current?.clientHeight ?? 0) >= v.rowIndex * rowHeight
        )
      );

      scrollEvent$ = merge(scroll$, wheel$)
        .pipe(
          throttleTime(10),
          pluck("target", "scrollTop"),
          map((top) => calculateDataViewRange(top as number))
        )
        .subscribe((range) => {
          setVirtualRows(
            listData.current.filter(
              (v) =>
                range.start <= v.rowIndex * rowHeight &&
                range.end >= v.rowIndex * rowHeight
            )
          );
        });
    }

    return () => scrollEvent$ && scrollEvent$.unsubscribe();
  }, [data, rowHeight, dataListRef, rowExtraLength]);

  return {
    virtualRows,
    totalHeight: totalHeight.current,
  };
};
