/**
 * Sample data for testing the job scheduler
 */

import { Worker, Job, LocationDistance } from './types';

export const sampleWorkers: Worker[] = [
  { name: "田中職人", skills: ["看板貼付"], base: "西区" },
  { name: "佐藤職人", skills: ["電飾施工"], base: "北区" },
  { name: "鈴木職人", skills: ["看板貼付", "電飾施工"], base: "中央区" },
  { name: "高橋職人", skills: ["看板貼付"], base: "此花区" }
];

export const sampleJobs: Job[] = [
  { id: "A", location: "西区", type: "看板貼付", time: "9:00-10:00" },
  { id: "B", location: "北区", type: "電飾施工", time: "10:30-11:30" },
  { id: "C", location: "此花区", type: "看板貼付", time: "13:00-14:00" },
  { id: "D", location: "中央区", type: "電飾施工", time: "14:30-15:30" },
  { id: "E", location: "西区", type: "看板貼付", time: "16:00-17:00" }
];

export const sampleLocationDistances: LocationDistance[] = [
  // Same location = priority 0
  { from: "西区", to: "西区", priority: 0 },
  { from: "北区", to: "北区", priority: 0 },
  { from: "中央区", to: "中央区", priority: 0 },
  { from: "此花区", to: "此花区", priority: 0 },
  
  // Adjacent areas = priority 5
  { from: "西区", to: "中央区", priority: 5 },
  { from: "中央区", to: "西区", priority: 5 },
  { from: "北区", to: "中央区", priority: 5 },
  { from: "中央区", to: "北区", priority: 5 },
  
  // Distant areas = priority 10
  { from: "西区", to: "北区", priority: 10 },
  { from: "北区", to: "西区", priority: 10 },
  { from: "西区", to: "此花区", priority: 8 },
  { from: "此花区", to: "西区", priority: 8 },
  { from: "北区", to: "此花区", priority: 12 },
  { from: "此花区", to: "北区", priority: 12 },
  { from: "中央区", to: "此花区", priority: 7 },
  { from: "此花区", to: "中央区", priority: 7 }
];