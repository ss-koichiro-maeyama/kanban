/**
 * Utility functions for time parsing and validation
 */

import { TimeSlot } from './types';

export function parseTimeSlot(timeString: string): TimeSlot {
  const [startTime, endTime] = timeString.split('-');
  return {
    start: timeToMinutes(startTime),
    end: timeToMinutes(endTime)
  };
}

export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function timeSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return slot1.start < slot2.end && slot2.start < slot1.end;
}

export function isTimeSlotInMorning(timeSlot: TimeSlot, morningEnd: number): boolean {
  return timeSlot.start < morningEnd;
}

export function isTimeSlotInAfternoon(timeSlot: TimeSlot, morningEnd: number): boolean {
  return timeSlot.start >= morningEnd;
}