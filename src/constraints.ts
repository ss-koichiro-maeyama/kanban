/**
 * Constraint validation functions for job scheduling
 */

import { Worker, Job, WorkerSchedule, ScheduleConstraint, LocationDistance } from './types';
import { parseTimeSlot, timeSlotsOverlap, isTimeSlotInMorning, isTimeSlotInAfternoon } from './utils';

export class ConstraintValidator {
  constructor(private constraints: ScheduleConstraint) {}

  /**
   * Check if worker has required skill for the job
   */
  hasRequiredSkill(worker: Worker, job: Job): boolean {
    return worker.skills.includes(job.type);
  }

  /**
   * Check if worker can take this job without violating time constraints
   */
  canScheduleJob(workerSchedule: WorkerSchedule, job: Job): boolean {
    const jobTimeSlot = parseTimeSlot(job.time);
    
    // Check for time slot conflicts
    for (const existingSlot of workerSchedule.timeSlots) {
      if (timeSlotsOverlap(existingSlot, jobTimeSlot)) {
        return false;
      }
    }

    // Check daily job limits
    if (workerSchedule.assignedJobs.length >= this.constraints.maxJobsPerDay) {
      return false;
    }

    // Check morning/afternoon limits
    const isMorning = isTimeSlotInMorning(jobTimeSlot, this.constraints.morningEnd);
    const isAfternoon = isTimeSlotInAfternoon(jobTimeSlot, this.constraints.morningEnd);

    if (isMorning && workerSchedule.morningJobCount >= this.constraints.maxMorningJobs) {
      return false;
    }

    if (isAfternoon && workerSchedule.afternoonJobCount >= this.constraints.maxAfternoonJobs) {
      return false;
    }

    return true;
  }

  /**
   * Calculate location priority score (lower is better)
   */
  calculateLocationPriority(worker: Worker, job: Job, locationDistances?: LocationDistance[]): number {
    // If worker's base matches job location exactly, highest priority
    if (worker.base === job.location) {
      return 0;
    }

    // If location distances are provided, use them
    if (locationDistances) {
      const distance = locationDistances.find(
        d => d.from === worker.base && d.to === job.location
      );
      if (distance) {
        return distance.priority;
      }
    }

    // Default priority for unknown locations
    return 100;
  }

  /**
   * Calculate overall assignment score for worker-job pair (lower is better)
   */
  calculateAssignmentScore(
    worker: Worker, 
    job: Job, 
    workerSchedule: WorkerSchedule,
    locationDistances?: LocationDistance[]
  ): number {
    // Cannot assign if skill doesn't match
    if (!this.hasRequiredSkill(worker, job)) {
      return Infinity;
    }

    // Cannot assign if scheduling constraints are violated
    if (!this.canScheduleJob(workerSchedule, job)) {
      return Infinity;
    }

    // Calculate score based on location priority and current workload
    const locationScore = this.calculateLocationPriority(worker, job, locationDistances);
    const workloadScore = workerSchedule.assignedJobs.length; // Prefer less loaded workers

    return locationScore + workloadScore * 0.1;
  }

  /**
   * Generate assignment reason
   */
  generateAssignmentReason(
    worker: Worker, 
    job: Job, 
    locationDistances?: LocationDistance[]
  ): string {
    const reasons: string[] = [];

    if (worker.skills.includes(job.type)) {
      reasons.push(`${job.type}スキルあり`);
    }

    if (worker.base === job.location) {
      reasons.push('拠点一致');
    } else {
      const priority = this.calculateLocationPriority(worker, job, locationDistances);
      if (priority <= 10) {
        reasons.push('近い拠点');
      }
    }

    reasons.push('空き時間あり');

    return reasons.join('・');
  }
}