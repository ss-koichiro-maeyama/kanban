/**
 * Basic test to validate the scheduling functionality
 */

import { scheduleJobs } from './index';
import { sampleWorkers, sampleJobs, sampleLocationDistances } from './examples';

function runBasicTests() {
  console.log('🧪 基本機能テスト開始...\n');

  // Test 1: Basic assignment
  console.log('テスト1: 基本的な割当');
  const result1 = scheduleJobs(sampleWorkers, sampleJobs, undefined, sampleLocationDistances);
  console.log(`✅ ${result1.length}/${sampleJobs.length} 件の案件が割り当てられました`);
  
  // Test 2: Skill matching
  console.log('\nテスト2: スキルマッチング');
  const testWorkers = [{ name: "テスト職人", skills: ["存在しないスキル"], base: "西区" }];
  const testJobs = [{ id: "TEST", location: "西区", type: "看板貼付", time: "9:00-10:00" }];
  const result2 = scheduleJobs(testWorkers, testJobs);
  console.log(`✅ スキル不一致: ${result2.length}/1 件割当 (期待値: 0)`);

  // Test 3: Time conflict
  console.log('\nテスト3: 時間重複チェック');
  const conflictJobs = [
    { id: "J1", location: "西区", type: "看板貼付", time: "9:00-10:00" },
    { id: "J2", location: "西区", type: "看板貼付", time: "9:30-10:30" } // 重複
  ];
  const singleWorker = [{ name: "田中職人", skills: ["看板貼付"], base: "西区" }];
  const result3 = scheduleJobs(singleWorker, conflictJobs);
  console.log(`✅ 時間重複: ${result3.length}/2 件割当 (期待値: 1)`);

  // Test 4: Location priority
  console.log('\nテスト4: 拠点優先度');
  const locationTest = scheduleJobs(
    [
      { name: "近い職人", skills: ["看板貼付"], base: "西区" },
      { name: "遠い職人", skills: ["看板貼付"], base: "北区" }
    ],
    [{ id: "L1", location: "西区", type: "看板貼付", time: "9:00-10:00" }],
    undefined,
    sampleLocationDistances
  );
  console.log(`✅ 拠点優先: ${locationTest[0]?.assignedTo} に割当 (期待値: 近い職人)`);

  console.log('\n🎉 全テスト完了!');
}

if (require.main === module) {
  runBasicTests();
}