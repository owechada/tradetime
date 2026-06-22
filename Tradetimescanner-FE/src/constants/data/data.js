import { MdAnalytics, MdDashboard } from "react-icons/md";
import { HiOutlineSignal } from "react-icons/hi2";
import { FaInstalod, FaTelegramPlane } from "react-icons/fa";
import { VscGithubAction } from "react-icons/vsc";

const sidebarItems = [
  {
    name: "Dashboard",
    title: "/",
    url: "/dashboard",
    icon: <MdDashboard className="inline" />,
  },
  {
    name: "Analysis",
    url: "/analysis",
    title: "/analysis",
    icon: <MdAnalytics className="inline" />,
  },
  {
    name: "Strategy Builder",
    url: "/strategy",
    title: "/strategy",
    icon: <VscGithubAction className="inline" />,
  },
  {
    name: "AI Signal Lab",
    url: "/aisignallab",
    title: "/AI signal lab",
    icon: <HiOutlineSignal
    className="inline" />,
  },
  {
    name: "Pro Chart Analysis",
    url: "/pro-chart",
    title: "/Pro chat analysis",
    icon: <FaInstalod
    className="inline" />,
  },

  {
    name: "Join Telegram",
    url: "https://t.me/tradetimescanner",
    title: "/telegram",
    icon: <FaTelegramPlane className="inline" />,
  },



];

  const indicators = [
  {
    categoryname: "Options Strategy",
    items: [
      { name: "Accelerator Oscillator", code: 1 },
      { name: "ADX", code: 2 },
      { name: "Alligator", code: 3 },
      { name: "Aroon", code: 4 },
      { name: "Average True Range", code: 5 },
      { name: "Awesome Oscillator", code: 6 },
      { name: "Bears Power", code: 7 },
      { name: "Bollinger Bands", code: 8 },
      { name: "Bollinger Bands Width", code: 9 },
      { name: "Bulls Power", code: 10 },
      { name: "CCI", code: 11 },
      { name: "Donchian Channels", code: 12 },
      { name: "DeMarker", code: 13 },
      { name: "Envelopes", code: 14 },
      { name: "Fractal", code: 15 },
      { name: "Fractal Chaos Bands", code: 16 },
      { name: "Ichimoku Kinko Hyo", code: 17 },
      { name: "Keltner Channel", code: 18 },
      { name: "MACD", code: 19 },
      { name: "Momentum", code: 20 },
      { name: "Moving Average", code: 21 },
      { name: "OsMA", code: 22 },
      { name: "Parabolic SAR", code: 23 },
      { name: "RSI", code: 24 },
      { name: "Rate of Change", code: 25 },
      { name: "Schaff Trend Cycle", code: 26 },
      { name: "Stochastic Oscillator", code: 27 },
      { name: "SuperTrend", code: 28 },
      { name: "Vortex", code: 29 },
      { name: "Williams %R", code: 30 },
      { name: "ZigZag", code: 31 }
     
    ]
  },
  {
    categoryname: "Forex Strategy",
    items: [
      // { name: "EURUSD", code: 32 },
      // { name: "GBPUSD", code: 33 },
      // { name: "USDJPY", code: 34 },
      // { name: "USDCAD", code: 35 },
      // { name: "AUDUSD", code: 36 },
      // { name: "NZDUSD", code: 37 },
      { name: "Moving Averages (SMA)", code: 38 },
      { name: "Moving Averages (EMA)", code: 39 },
      { name: "MACD", code: 40 },
      { name: "RSI", code: 41 },
      { name: "Stochastic Oscillator", code: 42 },
      { name: "ADX", code: 43 },
      { name: "Bollinger Bands", code: 44 },
      { name: "Fibonacci Retracement", code: 45 },
      { name: "Pivot Points", code: 46 }
    ]
  },
  {
    categoryname: "Crypto Strategy",
    items: [
      // { name: "BTCUSD", code: 47 },
      // { name: "ETHUSD", code: 48 },
      // { name: "XRPUSD", code: 49 },
      // { name: "LTCUSD", code: 50 },
      { name: "EMA (20)", code: 51 },
      { name: "EMA (50)", code: 52 },
      { name: "EMA (200)", code: 53 },
      { name: "RSI", code: 54 },
      { name: "MACD", code: 55 },
      { name: "Bollinger Bands", code: 56 },
      { name: "ATR", code: 57 },
      { name: "OBV", code: 58 },
      { name: "MFI", code: 59 },
      { name: "Fibonacci Levels", code: 60 }
    ]
  },
  {
    categoryname: "Gold Strategy (XAUUSD)",
    items: [
      // { name: "XAUUSD", code: 61 },
      { name: "EMA (50)", code: 62 },
      { name: "EMA (200)", code: 63 },
      { name: "Ichimoku Kinko Hyo", code: 64 },
      { name: "RSI", code: 65 },
      { name: "MACD", code: 66 },
      { name: "ATR", code: 67 },
      { name: "Fibonacci Retracement", code: 68 },
      { name: "Pivot Points (Daily)", code: 69 },
      { name: "Pivot Points (Weekly)", code: 70 }
    ]
  },
  {
    categoryname: "Indices Strategy",
    items: [
      // { name: "US30 (Dow)", code: 71 },
      // { name: "US100 (Nasdaq)", code: 72 },
      // { name: "US500 (S&P 500)", code: 73 },
      // { name: "GER30 (DAX)", code: 74 },
      { name: "EMA (20)", code: 75 },
      { name: "EMA (50)", code: 76 },
      { name: "EMA (200)", code: 77 },
      { name: "MACD", code: 78 },
      { name: "RSI", code: 79 },
      { name: "Stochastic Oscillator", code: 80 },
      { name: "Bollinger Bands", code: 81 },
      { name: "ADX", code: 82 },
      { name: "Fibonacci Retracement", code: 83 }
    ]
  }
];


const Brokers_list =[{ name: "IQ OPTION", code: "IQ OPTION" },
  {name:"POCKET OPTION",code:"POCKET OPTION"},
  {name:"DERIV",code:"DERIV"},
  {name:"QUOTEX",code:"QUOTEX"},
  {name:"OLYMP TRADE",code:"OLYMP TRADE"},
  {name:"EXPERT OPTION",code:"FEXPERT OPTION"},
  {name:"NADEX",code:"NADEX"} ]
 
export { sidebarItems, indicators, Brokers_list };
