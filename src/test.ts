import { ScheduleAllocationAI, Worker, Job } from './index';

/**
 * テストデータ
 */
const workers: Worker[] = [
  { name: "田中職人", skills: ["看板貼付"], base: "西区" },
  { name: "佐藤職人", skills: ["電飾施工"], base: "北区" },
  { name: "鈴木職人", skills: ["看板貼付", "電飾施工"], base: "中央区" },
];

const jobs: Job[] = [
  { id: "A", location: "西区", type: "看板貼付", time: "9:00-10:00" },
  { id: "B", location: "北区", type: "電飾施工", time: "10:30-11:30" },
  { id: "C", location: "此花区", type: "看板貼付", time: "13:00-14:00" },
  { id: "D", location: "西区", type: "電飾施工", time: "14:00-15:00" },
  { id: "E", location: "中央区", type: "看板貼付", time: "15:00-16:00" },
];

/**
 * メインテスト
 */
function runTests() {
  console.log("🔧 職人スケジュール割当AIアシスタント テスト開始\n");
  
  const ai = new ScheduleAllocationAI();
  const assignments = ai.allocate(workers, jobs);
  
  console.log("📥 入力データ:");
  console.log("職人:", JSON.stringify(workers, null, 2));
  console.log("案件:", JSON.stringify(jobs, null, 2));
  
  console.log("\n📤 割当結果:");
  assignments.forEach(assignment => {
    console.log(`案件${assignment.jobId}: ${assignment.assignedTo} (${assignment.reason})`);
  });
  
  console.log("\n🧪 テストケース:");
  testBasicAllocation(assignments);
  testSkillMatching();
  testTimeConflicts();
  testLocationPreference();
  testDailyLimits();
  
  console.log("\n✅ 全テスト完了!");
}

/**
 * 基本割当テスト
 */
function testBasicAllocation(assignments: any[]) {
  console.log("1. 基本割当テスト");
  
  // 全ての案件が割り当てられているかチェック
  const assignedJobIds = assignments.map(a => a.jobId);
  const expectedJobs = ["A", "B", "C", "D", "E"];
  
  const allAssigned = expectedJobs.every(jobId => assignedJobIds.includes(jobId));
  console.log(`   - 全案件割当: ${allAssigned ? "✅" : "❌"}`);
  
  // スキルマッチングチェック
  const skillMatched = assignments.every(assignment => {
    const job = jobs.find(j => j.id === assignment.jobId);
    const worker = workers.find(w => w.name === assignment.assignedTo);
    return worker?.skills.includes(job?.type || "") || false;
  });
  console.log(`   - スキルマッチング: ${skillMatched ? "✅" : "❌"}`);
}

/**
 * スキルマッチングテスト
 */
function testSkillMatching() {
  console.log("2. スキルマッチングテスト");
  
  const testJobs: Job[] = [
    { id: "X", location: "西区", type: "未対応スキル", time: "9:00-10:00" }
  ];
  
  const ai = new ScheduleAllocationAI();
  const assignments = ai.allocate(workers, testJobs);
  
  console.log(`   - 未対応スキル除外: ${assignments.length === 0 ? "✅" : "❌"}`);
}

/**
 * 時間競合テスト
 */
function testTimeConflicts() {
  console.log("3. 時間競合テスト");
  
  const conflictJobs: Job[] = [
    { id: "Y1", location: "西区", type: "看板貼付", time: "9:00-10:00" },
    { id: "Y2", location: "西区", type: "看板貼付", time: "9:30-10:30" }, // 競合
  ];
  
  const ai = new ScheduleAllocationAI();
  const assignments = ai.allocate([workers[0]], conflictJobs); // 田中職人のみ
  
  console.log(`   - 時間競合回避: ${assignments.length === 1 ? "✅" : "❌"}`);
}

/**
 * 場所優先度テスト
 */
function testLocationPreference() {
  console.log("4. 場所優先度テスト");
  
  const locationJobs: Job[] = [
    { id: "Z", location: "西区", type: "看板貼付", time: "9:00-10:00" }
  ];
  
  const ai = new ScheduleAllocationAI();
  const assignments = ai.allocate(workers, locationJobs);
  
  // 西区の案件なので田中職人（西区拠点）が選ばれるべき
  const assignedToTanaka = assignments[0]?.assignedTo === "田中職人";
  console.log(`   - 拠点優先: ${assignedToTanaka ? "✅" : "❌"}`);
}

/**
 * 日次制限テスト
 */
function testDailyLimits() {
  console.log("5. 日次制限テスト");
  
  // 5件の同じタイプの案件（制限4件を超える）
  const manyJobs: Job[] = [
    { id: "M1", location: "西区", type: "看板貼付", time: "9:00-10:00" },
    { id: "M2", location: "西区", type: "看板貼付", time: "10:00-11:00" },
    { id: "M3", location: "西区", type: "看板貼付", time: "13:00-14:00" },
    { id: "M4", location: "西区", type: "看板貼付", time: "14:00-15:00" },
    { id: "M5", location: "西区", type: "看板貼付", time: "15:00-16:00" }, // 制限超過
  ];
  
  const ai = new ScheduleAllocationAI();
  const assignments = ai.allocate([workers[0]], manyJobs); // 田中職人のみ
  
  console.log(`   - 日次制限遵守: ${assignments.length <= 4 ? "✅" : "❌"} (割当: ${assignments.length}/5件)`);
}

// テスト実行
if (require.main === module) {
  runTests();
}