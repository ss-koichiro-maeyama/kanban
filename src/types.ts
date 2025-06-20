/**
 * Type definitions for the job scheduling system
 */

export interface Worker {
  name: string;
  skills: string[];
  base: string;
}

export interface Job {
  id: string;
  location: string;
  type: string;
  time: string; // Format: "HH:MM-HH:MM"
}

export interface Assignment {
  jobId: string;
  assignedTo: string;
  reason: string;
}

export interface TimeSlot {
  start: number; // minutes from start of day
  end: number;   // minutes from start of day
}

export interface ScheduleConstraint {
  maxJobsPerDay: number;
  maxMorningJobs: number;
  maxAfternoonJobs: number;
  morningEnd: number; // minutes from start of day (e.g., 12:00 = 720)
}

export interface LocationDistance {
  from: string;
  to: string;
  priority: number; // lower number = higher priority (closer)
}

export interface SchedulingContext {
  workers: Worker[];
  jobs: Job[];
  constraints: ScheduleConstraint;
  locationDistances?: LocationDistance[];
}

export interface WorkerSchedule {
  workerName: string;
  assignedJobs: Job[];
  timeSlots: TimeSlot[];
  morningJobCount: number;
  afternoonJobCount: number;
}