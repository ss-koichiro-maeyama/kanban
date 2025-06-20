import { Worker, Job, Assignment, AllocationConstraints, TimeSlot } from './types';
import { parseTimeSlot, hasTimeConflict, isAfternoon, calculateDistance } from './utils';

/**
 * 職人スケジュール割当AIアシスタント
 */
export class ScheduleAllocationAI {
  private constraints: AllocationConstraints;

  constructor(constraints?: Partial<AllocationConstraints>) {
    this.constraints = {
      maxJobsPerWorkerPerDay: 4,
      maxMorningJobs: 2,
      maxAfternoonJobs: 2,
      afternoonStartHour: 12,
      ...constraints
    };
  }

  /**
   * 案件を職人に割り当てる
   */
  public allocate(workers: Worker[], jobs: Job[]): Assignment[] {
    const assignments: Assignment[] = [];
    const workerSchedules = new Map<string, TimeSlot[]>();
    
    // 職人ごとのスケジュールを初期化
    workers.forEach(worker => {
      workerSchedules.set(worker.name, []);
    });

    // 案件をソート（優先度: スキルマッチ数 > 距離の近さ > 時間順）
    const sortedJobs = this.sortJobsByPriority(jobs, workers);

    for (const job of sortedJobs) {
      const jobTimeSlot = parseTimeSlot(job.time);
      const bestWorker = this.findBestWorker(job, workers, workerSchedules, jobTimeSlot);
      
      if (bestWorker) {
        const reason = this.generateAssignmentReason(job, bestWorker, workers);
        assignments.push({
          jobId: job.id,
          assignedTo: bestWorker.name,
          reason
        });
        
        // 職人のスケジュールに追加
        const schedule = workerSchedules.get(bestWorker.name)!;
        schedule.push(jobTimeSlot);
      }
    }

    return assignments;
  }

  /**
   * 案件の優先度でソート
   */
  private sortJobsByPriority(jobs: Job[], workers: Worker[]): Job[] {
    return [...jobs].sort((a, b) => {
      const aMatchCount = this.countSkillMatches(a, workers);
      const bMatchCount = this.countSkillMatches(b, workers);
      
      if (aMatchCount !== bMatchCount) {
        return aMatchCount - bMatchCount; // スキルマッチが少ない案件を優先
      }
      
      // 時間順
      const aTime = parseTimeSlot(a.time);
      const bTime = parseTimeSlot(b.time);
      return aTime.start - bTime.start;
    });
  }

  /**
   * 案件にマッチするスキルを持つ職人の数をカウント
   */
  private countSkillMatches(job: Job, workers: Worker[]): number {
    return workers.filter(worker => worker.skills.includes(job.type)).length;
  }

  /**
   * 案件に最適な職人を見つける
   */
  private findBestWorker(
    job: Job,
    workers: Worker[],
    workerSchedules: Map<string, TimeSlot[]>,
    jobTimeSlot: TimeSlot
  ): Worker | null {
    const eligibleWorkers = workers.filter(worker => {
      // スキルチェック
      if (!worker.skills.includes(job.type)) {
        return false;
      }

      const schedule = workerSchedules.get(worker.name)!;
      
      // 時間競合チェック
      if (schedule.some(slot => hasTimeConflict(slot, jobTimeSlot))) {
        return false;
      }

      // 日次制限チェック
      if (schedule.length >= this.constraints.maxJobsPerWorkerPerDay) {
        return false;
      }

      // 午前/午後制限チェック
      const isJobAfternoon = isAfternoon(jobTimeSlot, this.constraints.afternoonStartHour);
      const relevantSlots = schedule.filter(slot => 
        isAfternoon(slot, this.constraints.afternoonStartHour) === isJobAfternoon
      );
      
      const maxSlots = isJobAfternoon ? 
        this.constraints.maxAfternoonJobs : 
        this.constraints.maxMorningJobs;
      
      if (relevantSlots.length >= maxSlots) {
        return false;
      }

      return true;
    });

    if (eligibleWorkers.length === 0) {
      return null;
    }

    // 最適な職人を選択（距離が近い順）
    return eligibleWorkers.reduce((best, current) => {
      const bestDistance = calculateDistance(best.base, job.location);
      const currentDistance = calculateDistance(current.base, job.location);
      return currentDistance < bestDistance ? current : best;
    });
  }

  /**
   * 割当理由を生成
   */
  private generateAssignmentReason(job: Job, worker: Worker, allWorkers: Worker[]): string {
    const reasons: string[] = [];
    
    // スキルマッチ
    if (worker.skills.includes(job.type)) {
      reasons.push("スキルマッチ");
    }
    
    // 拠点の近さ
    const distance = calculateDistance(worker.base, job.location);
    if (distance === 0) {
      reasons.push("拠点一致");
    } else if (distance === 1) {
      reasons.push("拠点近い");
    }
    
    // 空き時間
    reasons.push("空き時間あり");
    
    return reasons.join("・");
  }
}