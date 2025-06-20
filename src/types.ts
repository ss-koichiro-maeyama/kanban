/**
 * 職人の情報
 */
export interface Worker {
  /** 職人の名前 */
  name: string;
  /** 職人のスキルリスト */
  skills: string[];
  /** 職人の拠点（区域） */
  base: string;
}

/**
 * 案件の情報
 */
export interface Job {
  /** 案件ID */
  id: string;
  /** 作業場所（区域） */
  location: string;
  /** 作業タイプ（スキル要件） */
  type: string;
  /** 作業時間 */
  time: string;
}

/**
 * 割当結果
 */
export interface Assignment {
  /** 案件ID */
  jobId: string;
  /** 割当職人名 */
  assignedTo: string;
  /** 割当理由 */
  reason: string;
}

/**
 * 時間スロット（9:00-10:00 → {start: 9, end: 10}）
 */
export interface TimeSlot {
  start: number;
  end: number;
}

/**
 * 割当制約設定
 */
export interface AllocationConstraints {
  /** 1人あたりの最大案件数/日 */
  maxJobsPerWorkerPerDay: number;
  /** 午前の最大案件数 */
  maxMorningJobs: number;
  /** 午後の最大案件数 */
  maxAfternoonJobs: number;
  /** 午後の開始時刻 */
  afternoonStartHour: number;
}