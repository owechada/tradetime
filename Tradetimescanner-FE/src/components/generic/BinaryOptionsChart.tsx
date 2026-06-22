import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  ColorType,
  Time
} from 'lightweight-charts';

// Type definitions
interface CandlestickData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ChartMarker {
  time: string;
  position: 'belowBar' | 'aboveBar' | 'inBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown' | 'circle' | 'square';
  text: string;
  size: number;
}

interface ChartAnnotations {
  markers?: ChartMarker[];
}

interface MiniTradingChartProps {
  chartData?: CandlestickData[];
  chartAnnotations?: ChartAnnotations;
  width?: number;
  height?: number;
}

const MiniTradingChart: React.FC<MiniTradingChartProps> = ({ 
  chartData = [], 
  chartAnnotations = {},
  width = 400,
  height = 250 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<any>(null);

  // Default dummy data
  const defaultData: CandlestickData[] = [
    { time: '2024-01-01 10:00', open: 1.0950, high: 1.0980, low: 1.0940, close: 1.0975 },
    { time: '2024-01-01 10:01', open: 1.0975, high: 1.0995, low: 1.0965, close: 1.0985 },
    { time: '2024-01-01 10:02', open: 1.0985, high: 1.1010, low: 1.0975, close: 1.0995 },
    { time: '2024-01-01 10:03', open: 1.0995, high: 1.1005, low: 1.0980, close: 1.0990 },
    { time: '2024-01-01 10:04', open: 1.0990, high: 1.1020, low: 1.0985, close: 1.1015 },
    { time: '2024-01-01 10:05', open: 1.1015, high: 1.1035, low: 1.1005, close: 1.1025 },
    { time: '2024-01-01 10:06', open: 1.1025, high: 1.1040, low: 1.1010, close: 1.1020 },
    { time: '2024-01-01 10:07', open: 1.1020, high: 1.1030, low: 1.1000, close: 1.1005 },
    { time: '2024-01-01 10:08', open: 1.1005, high: 1.1025, low: 1.0995, close: 1.1010 },
    { time: '2024-01-01 10:09', open: 1.1010, high: 1.1035, low: 1.1000, close: 1.1030 },
    { time: '2024-01-01 10:10', open: 1.1030, high: 1.1045, low: 1.1020, close: 1.1040 },
    { time: '2024-01-01 10:11', open: 1.1040, high: 1.1050, low: 1.1025, close: 1.1035 },
    { time: '2024-01-01 10:12', open: 1.1035, high: 1.1055, low: 1.1030, close: 1.1045 },
    { time: '2024-01-01 10:13', open: 1.1045, high: 1.1060, low: 1.1035, close: 1.1050 },
    { time: '2024-01-01 10:14', open: 1.1050, high: 1.1065, low: 1.1040, close: 1.1055 },
  ];

  // Default markers
  const defaultMarkers: ChartMarker[] = [
    {
      time: '2024-01-01 10:03',
      position: 'belowBar',
      color: '#00FF00',
      shape: 'arrowUp',
      text: 'CALL',
      size: 1
    },
    {
      time: '2024-01-01 10:08',
      position: 'aboveBar',
      color: '#FF0000',
      shape: 'arrowDown',
      text: 'PUT',
      size: 1
    },
    {
      time: '2024-01-01 10:13',
      position: 'belowBar',
      color: '#00FF00',
      shape: 'arrowUp',
      text: 'CALL',
      size: 1
    }
  ];

  // Convert time to timestamp
  const convertTime = (timeStr: string | number): Time => {
    if (typeof timeStr === 'string') {
      return (new Date(timeStr).getTime() / 1000) as Time;
    }
    return timeStr as Time;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart with minimal styling
    chart.current = createChart(chartContainerRef.current, {
      width: width,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333333',
      },
      grid: {
        vertLines: { color: '#e1e1e1' },
        horzLines: { color: '#e1e1e1' },
      },
      rightPriceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Use provided data or default data
    const dataToUse = chartData.length > 0 ? chartData : defaultData;
    const processedData = dataToUse.map(item => ({
      time: convertTime(item.time),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close
    }));

    candlestickSeries.setData(processedData);

    // Add markers - use provided markers or default ones
    const markersToUse = chartAnnotations?.markers?.length ? chartAnnotations.markers : defaultMarkers;
    
    if (markersToUse.length > 0) {
      const markers = markersToUse.map(marker => ({
        time: convertTime(marker.time),
        position: marker.position,
        color: marker.color,
        shape: marker.shape === 'arrowUp' ? 'arrowUp' : 'arrowDown',
        text: marker.text,
        size: marker.size
      }));

      candlestickSeries.setMarkers(markers);
    }

    // Auto-fit content
    chart.current.timeScale().fitContent();

    // Cleanup
    return () => {
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, [chartData, chartAnnotations, width, height]);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default MiniTradingChart;