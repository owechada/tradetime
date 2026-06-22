import React, { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";

const MiniChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
    });

    // Add line series (instead of old addLineSeries)
    const lineSeries = chartRef.current.addSeries({
      type: "Line",
      isBuiltIn: true,
      defaultOptions: {
        color: "blue",
        lineWidth: 2,
        lineStyle: 0,
        lineType: 0,
        lineVisible: true,
        pointMarkersVisible: false,
        lastPriceAnimation: 0,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: "blue",
        crosshairMarkerBorderWidth: 1,
        crosshairMarkerBackgroundColor: "blue"
      }
    });

    // Dummy data
    lineSeries.setData([
      { time: "2025-09-21", value: 80 },
      { time: "2025-09-22", value: 96 },
      { time: "2025-09-23", value: 70 },
      { time: "2025-09-24", value: 120 },
      { time: "2025-09-25", value: 105 },
      { time: "2025-09-26", value: 115 },
    ]);

    return () => chartRef.current?.remove();
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "300px" }}
    />
  );
};

export default MiniChart;
