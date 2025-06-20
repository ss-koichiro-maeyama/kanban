/**
 * Main entry point for the job scheduling system
 */

export { Worker, Job, Assignment, SchedulingContext, ScheduleConstraint, LocationDistance } from './types';
export { JobScheduler } from './scheduler';
export { ConstraintValidator } from './constraints';
export { parseTimeSlot, timeToMinutes, minutesToTime, timeSlotsOverlap } from './utils';
export { sampleWorkers, sampleJobs, sampleLocationDistances } from './examples';

// Re-export main scheduling function for convenience
import { JobScheduler } from './scheduler';
import { Worker, Job, Assignment, ScheduleConstraint, LocationDistance } from './types';

/**
 * Convenience function to schedule jobs
 * @param workers Array of available workers
 * @param jobs Array of jobs to be assigned
 * @param constraints Optional scheduling constraints
 * @param locationDistances Optional location distance mappings
 * @returns Array of job assignments
 */
export function scheduleJobs(
  workers: Worker[],
  jobs: Job[],
  constraints?: ScheduleConstraint,
  locationDistances?: LocationDistance[]
): Assignment[] {
  return JobScheduler.schedule(workers, jobs, constraints, locationDistances);
}

// Example usage
if (require.main === module) {
  import('./examples').then(({ sampleWorkers, sampleJobs, sampleLocationDistances }) => {
    console.log('🔧 職人スケジュール割当システム');
    console.log('================================');
    
    console.log('\n📋 入力データ:');
    console.log('職人:', JSON.stringify(sampleWorkers, null, 2));
    console.log('案件:', JSON.stringify(sampleJobs, null, 2));
    
    const assignments = scheduleJobs(sampleWorkers, sampleJobs, undefined, sampleLocationDistances);
    
    console.log('\n✅ 割当結果:');
    console.log(JSON.stringify(assignments, null, 2));
    
    console.log('\n📊 割当統計:');
    console.log(`割当済み案件: ${assignments.length}/${sampleJobs.length}`);
    console.log(`未割当案件: ${sampleJobs.length - assignments.length}`);
  });
}