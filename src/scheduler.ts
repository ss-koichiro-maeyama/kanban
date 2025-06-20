/**
 * Main job scheduling algorithm implementation
 */

import { 
  Worker, 
  Job, 
  Assignment, 
  SchedulingContext, 
  WorkerSchedule, 
  ScheduleConstraint,
  LocationDistance 
} from './types';
import { parseTimeSlot, isTimeSlotInMorning } from './utils';
import { ConstraintValidator } from './constraints';

export class JobScheduler {
  private validator: ConstraintValidator;
  private workers: Worker[] = [];
  private defaultConstraints: ScheduleConstraint = {
    maxJobsPerDay: 4,
    maxMorningJobs: 2,
    maxAfternoonJobs: 2,
    morningEnd: 12 * 60 // 12:00 in minutes
  };

  constructor() {
    this.validator = new ConstraintValidator(this.defaultConstraints);
  }

  /**
   * Main scheduling method
   */
  public scheduleJobs(context: SchedulingContext): Assignment[] {
    const constraints = context.constraints || this.defaultConstraints;
    this.validator = new ConstraintValidator(constraints);
    this.workers = context.workers;

    const assignments: Assignment[] = [];
    const workerSchedules = this.initializeWorkerSchedules(context.workers);
    
    // Sort jobs by priority (you can customize this logic)
    const sortedJobs = this.sortJobsByPriority(context.jobs);

    for (const job of sortedJobs) {
      const assignment = this.assignJob(
        job, 
        workerSchedules, 
        context.locationDistances
      );
      
      if (assignment) {
        assignments.push(assignment);
        this.updateWorkerSchedule(workerSchedules, assignment, job, constraints);
      }
    }

    return assignments;
  }

  /**
   * Initialize worker schedules
   */
  private initializeWorkerSchedules(workers: Worker[]): Map<string, WorkerSchedule> {
    const schedules = new Map<string, WorkerSchedule>();
    
    for (const worker of workers) {
      schedules.set(worker.name, {
        workerName: worker.name,
        assignedJobs: [],
        timeSlots: [],
        morningJobCount: 0,
        afternoonJobCount: 0
      });
    }

    return schedules;
  }

  /**
   * Sort jobs by priority (can be customized)
   */
  private sortJobsByPriority(jobs: Job[]): Job[] {
    // For now, sort by time (earlier jobs first)
    return [...jobs].sort((a, b) => {
      const timeA = parseTimeSlot(a.time);
      const timeB = parseTimeSlot(b.time);
      return timeA.start - timeB.start;
    });
  }

  /**
   * Assign a single job to the best available worker
   */
  private assignJob(
    job: Job, 
    workerSchedules: Map<string, WorkerSchedule>,
    locationDistances?: LocationDistance[]
  ): Assignment | null {
    let bestWorker: string | null = null;
    let bestScore = Infinity;

    // Find the best worker for this job
    for (const [workerName, schedule] of workerSchedules) {
      const worker = this.findWorkerByName(workerName);
      if (!worker) continue;

      const score = this.validator.calculateAssignmentScore(
        worker,
        job,
        schedule,
        locationDistances
      );

      if (score < bestScore) {
        bestScore = score;
        bestWorker = workerName;
      }
    }

    if (bestWorker && bestScore !== Infinity) {
      const worker = this.findWorkerByName(bestWorker);
      if (worker) {
        return {
          jobId: job.id,
          assignedTo: bestWorker,
          reason: this.validator.generateAssignmentReason(worker, job, locationDistances)
        };
      }
    }

    return null;
  }

  /**
   * Update worker schedule after assignment
   */
  private updateWorkerSchedule(
    workerSchedules: Map<string, WorkerSchedule>,
    assignment: Assignment,
    job: Job,
    constraints: ScheduleConstraint
  ): void {
    const schedule = workerSchedules.get(assignment.assignedTo);
    if (!schedule) return;

    const timeSlot = parseTimeSlot(job.time);
    
    schedule.assignedJobs.push(job);
    schedule.timeSlots.push(timeSlot);

    if (isTimeSlotInMorning(timeSlot, constraints.morningEnd)) {
      schedule.morningJobCount++;
    } else {
      schedule.afternoonJobCount++;
    }
  }

  /**
   * Helper method to find worker by name
   */
  private findWorkerByName(name: string): Worker | null {
    return this.workers.find(worker => worker.name === name) || null;
  }

  /**
   * Static convenience method for quick scheduling
   */
  public static schedule(
    workers: Worker[], 
    jobs: Job[], 
    constraints?: ScheduleConstraint,
    locationDistances?: LocationDistance[]
  ): Assignment[] {
    const scheduler = new JobScheduler();
    const context: SchedulingContext = {
      workers,
      jobs,
      constraints: constraints || scheduler.defaultConstraints,
      locationDistances
    };
    
    return scheduler.scheduleJobs(context);
  }
}