import { ScheduleAllocationAI, Worker, Job } from './index';

/**
 * 使用例：職人スケジュール割当AIアシスタントの基本的な使い方
 */

// 職人データ（実際のプロジェクトではKintoneやAPIから取得）
const workers: Worker[] = [
  { name: "田中職人", skills: ["看板貼付"], base: "西区" },
  { name: "佐藤職人", skills: ["電飾施工"], base: "北区" },
  { name: "鈴木職人", skills: ["看板貼付", "電飾施工"], base: "中央区" },
  { name: "山田職人", skills: ["看板貼付", "電飾施工", "配線工事"], base: "港区" },
];

// 案件データ（実際のプロジェクトではKintoneやAPIから取得）
const jobs: Job[] = [
  { id: "JOB001", location: "西区", type: "看板貼付", time: "9:00-10:00" },
  { id: "JOB002", location: "北区", type: "電飾施工", time: "10:30-11:30" },
  { id: "JOB003", location: "此花区", type: "看板貼付", time: "13:00-14:00" },
  { id: "JOB004", location: "西区", type: "電飾施工", time: "14:00-15:00" },
  { id: "JOB005", location: "中央区", type: "看板貼付", time: "15:00-16:00" },
  { id: "JOB006", location: "港区", type: "配線工事", time: "16:00-17:00" },
];

/**
 * 基本的な使用例
 */
function basicExample() {
  console.log("=== 基本的な使用例 ===\n");
  
  // デフォルト設定でAIアシスタントを作成
  const ai = new ScheduleAllocationAI();
  
  // 割当実行
  const assignments = ai.allocate(workers, jobs);
  
  // 結果表示
  console.log("📅 割当結果:");
  assignments.forEach(assignment => {
    const job = jobs.find(j => j.id === assignment.jobId);
    console.log(`${job?.time} | 案件${assignment.jobId} → ${assignment.assignedTo}`);
    console.log(`         理由: ${assignment.reason}\n`);
  });
  
  return assignments;
}

/**
 * カスタム制約での使用例
 */
function customConstraintsExample() {
  console.log("=== カスタム制約での使用例 ===\n");
  
  // 制約条件をカスタマイズ
  const customConstraints = {
    maxJobsPerWorkerPerDay: 6,  // 1日最大6件に増加
    maxMorningJobs: 3,          // 午前最大3件
    maxAfternoonJobs: 3,        // 午後最大3件
    afternoonStartHour: 13      // 午後開始を13時に変更
  };
  
  const ai = new ScheduleAllocationAI(customConstraints);
  const assignments = ai.allocate(workers, jobs);
  
  console.log("📊 カスタム制約での結果:");
  console.log(`設定: 1日最大${customConstraints.maxJobsPerWorkerPerDay}件、午後開始${customConstraints.afternoonStartHour}時`);
  console.log(`割当件数: ${assignments.length}/${jobs.length}件\n`);
  
  return assignments;
}

/**
 * 統計情報の表示
 */
function showStatistics(assignments: any[]) {
  console.log("=== 統計情報 ===\n");
  
  // 職人別の割当件数
  const workerStats = new Map<string, number>();
  assignments.forEach(assignment => {
    const current = workerStats.get(assignment.assignedTo) || 0;
    workerStats.set(assignment.assignedTo, current + 1);
  });
  
  console.log("👥 職人別割当件数:");
  workerStats.forEach((count, worker) => {
    console.log(`${worker}: ${count}件`);
  });
  
  // 未割当案件
  const assignedJobIds = assignments.map(a => a.jobId);
  const unassignedJobs = jobs.filter(job => !assignedJobIds.includes(job.id));
  
  console.log(`\n📋 割当済み: ${assignments.length}/${jobs.length}件`);
  if (unassignedJobs.length > 0) {
    console.log("❌ 未割当案件:");
    unassignedJobs.forEach(job => {
      console.log(`  - ${job.id}: ${job.type} (${job.location}, ${job.time})`);
    });
  }
}

/**
 * メイン実行
 */
function main() {
  console.log("🔧 職人スケジュール割当AIアシスタント - 使用例\n");
  
  // 基本例
  const basicResults = basicExample();
  
  // カスタム制約例
  const customResults = customConstraintsExample();
  
  // 統計情報
  showStatistics(basicResults);
  
  console.log("\n✅ 使用例完了!");
  console.log("\n💡 ヒント:");
  console.log("- 実際のプロジェクトでは、KintoneやAPIからデータを取得");
  console.log("- SlackやGoogle Sheetsに結果を自動送信");
  console.log("- 地理情報APIで距離計算をより正確に");
}

// 実行
if (require.main === module) {
  main();
}