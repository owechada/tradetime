interface SignalItemDTO {
  explanation: string;
  invalidation_level?: number;
  target_zone_1?: number;
  target_zone_2?: number;
  target_zone_3?: number;
  trade_type: string;
  kindoff?: string;
  pair: string;
  userid: string;
  win_confidence: string; // Changed from Number
  time_frame?: string;
  signal_strength?: string;
  suggested_entry_zone?: string;
  disclaimer?: string;
  trade_duration?: string;
  signal_type?: string; 
  id?: string;
}
interface ScanItemDTO {
  pairs?: string[];
  items?: string[];
  details: string[];
}
export type { SignalItemDTO, ScanItemDTO }