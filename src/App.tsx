import { useRef, useState } from "react";
import "./App.css";
import { useVirtualScrollHook } from "./hooks";
import {
  VirtualScrollList,
  VirtualScrollRow,
} from "./components/virtual-scroll";

const testData = new Array(100).fill("test").map((v, i) => ({
  text: `test-${i}`,
  value: `test-${i}`,
}));

function App() {
  const [cacheIng] = useState<{ text: string; value: string }[]>(testData);

  const tableRef = useRef<HTMLDivElement>(null);
  const { virtualRows, totalHeight } = useVirtualScrollHook<{
    text: string;
    value: string;
  }>({
    data: cacheIng,
    dataListRef: tableRef,
  });

  return (
    <div className="App items-center justify-center">
      <div className="w-[500px] h-[500px] border border-black relative">
        <VirtualScrollList ref={tableRef} totalHeight={totalHeight}>
          {!!virtualRows.length &&
            virtualRows.map((v) => (
              <VirtualScrollRow rowStart={v.rowStart} key={v.rowIndex}>
                {v.data.text}
              </VirtualScrollRow>
            ))}
        </VirtualScrollList>
      </div>
    </div>
  );
}

export default App;
