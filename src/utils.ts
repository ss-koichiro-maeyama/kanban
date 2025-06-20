import { TimeSlot } from './types';

/**
 * 時間文字列（"9:00-10:00"）をTimeSlotオブジェクトに変換
 */
export function parseTimeSlot(timeString: string): TimeSlot {
  const [startTime, endTime] = timeString.split('-');
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  
  return { start, end };
}

/**
 * 2つの時間スロットが重複しているかチェック
 */
export function hasTimeConflict(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return slot1.start < slot2.end && slot2.start < slot1.end;
}

/**
 * 時間スロットが午前か午後かを判定
 */
export function isAfternoon(timeSlot: TimeSlot, afternoonStartHour: number = 12): boolean {
  return timeSlot.start >= afternoonStartHour;
}

/**
 * 拠点と作業場所の距離を計算（簡易版）
 * 実際のプロジェクトでは地理情報APIを使用することを想定
 */
export function calculateDistance(base: string, location: string): number {
  if (base === location) {
    return 0; // 同じ区域
  }
  
  // 簡易的な距離計算（隣接区域は距離1、その他は距離2）
  const adjacentAreas: Record<string, string[]> = {
    '西区': ['中央区', '港区'],
    '北区': ['中央区', '此花区'],
    '中央区': ['西区', '北区', '港区'],
    '此花区': ['北区', '港区'],
    '港区': ['西区', '中央区', '此花区']
  };
  
  if (adjacentAreas[base]?.includes(location)) {
    return 1; // 隣接
  }
  
  return 2; // 遠距離
}