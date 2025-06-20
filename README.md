# 職人スケジュール割当システム (Kanban Job Scheduler)

職人のスケジュール再配置を提案するAIアシスタントの割当ロジック（TypeScript）実装です。

## 🔧 概要

このシステムは、複数の職人と案件を効率的に割り当てるためのスケジューリングアルゴリズムを提供します。制約条件を満たしながら、最適な割り当てを自動で提案します。

## ✨ 特徴

- **制約ベース割当**: 複数の制約条件を考慮した最適化
- **拡張可能設計**: 新しい制約条件を簡単に追加可能
- **TypeScript実装**: 型安全性と可読性を重視
- **距離優先**: 拠点と現場の距離を考慮した効率的な割当
- **スキルマッチング**: 必要スキルと職人のスキルを厳密にマッチング

## 📋 制約条件

1. **スキル要件**: 職人が案件に必要なスキルを持っている必要があります
2. **時間制約**: 
   - 1人最大4件/日（午前2件・午後2件）
   - 同時間帯の重複不可
3. **距離優先**: 拠点（base）と現場（location）が近い職人を優先
4. **効率性**: 既に多くの案件を割り当てられている職人より、空いている職人を優先

## 🚀 クイックスタート

### インストール

```bash
npm install
npm run build
```

### 基本的な使用方法

```typescript
import { scheduleJobs } from './src/index';

const workers = [
  { name: "田中職人", skills: ["看板貼付"], base: "西区" },
  { name: "佐藤職人", skills: ["電飾施工"], base: "北区" },
];

const jobs = [
  { id: "A", location: "西区", type: "看板貼付", time: "9:00-10:00" },
  { id: "B", location: "北区", type: "電飾施工", time: "10:30-11:30" },
];

const assignments = scheduleJobs(workers, jobs);
console.log(assignments);
```

### サンプル実行

```bash
npm start
```

## 📖 API ドキュメント

### 主要な型定義

```typescript
interface Worker {
  name: string;      // 職人名
  skills: string[];  // 持っているスキル一覧
  base: string;      // 拠点
}

interface Job {
  id: string;        // 案件ID
  location: string;  // 現場の場所
  type: string;      // 必要なスキル
  time: string;      // 時間帯 ("HH:MM-HH:MM" 形式)
}

interface Assignment {
  jobId: string;     // 案件ID
  assignedTo: string; // 割り当てられた職人名
  reason: string;    // 割当理由
}
```

### メイン関数

#### `scheduleJobs(workers, jobs, constraints?, locationDistances?)`

**パラメータ:**
- `workers: Worker[]` - 利用可能な職人リスト
- `jobs: Job[]` - 割り当てる案件リスト
- `constraints?: ScheduleConstraint` - スケジュール制約（オプション）
- `locationDistances?: LocationDistance[]` - 距離情報（オプション）

**戻り値:**
- `Assignment[]` - 割当結果のリスト

## 🎯 入力・出力例

### 入力例

```javascript
const workers = [
  { name: "田中職人", skills: ["看板貼付"], base: "西区" },
  { name: "佐藤職人", skills: ["電飾施工"], base: "北区" },
  { name: "鈴木職人", skills: ["看板貼付", "電飾施工"], base: "中央区" },
  { name: "高橋職人", skills: ["看板貼付"], base: "此花区" }
];

const jobs = [
  { id: "A", location: "西区", type: "看板貼付", time: "9:00-10:00" },
  { id: "B", location: "北区", type: "電飾施工", time: "10:30-11:30" },
  { id: "C", location: "此花区", type: "看板貼付", time: "13:00-14:00" },
  { id: "D", location: "中央区", type: "電飾施工", time: "14:30-15:30" },
  { id: "E", location: "西区", type: "看板貼付", time: "16:00-17:00" }
];
```

### 出力例

```javascript
[
  { jobId: "A", assignedTo: "田中職人", reason: "看板貼付スキルあり・拠点一致・空き時間あり" },
  { jobId: "B", assignedTo: "佐藤職人", reason: "電飾施工スキルあり・拠点一致・空き時間あり" },
  { jobId: "C", assignedTo: "高橋職人", reason: "看板貼付スキルあり・拠点一致・空き時間あり" },
  { jobId: "D", assignedTo: "鈴木職人", reason: "電飾施工スキルあり・拠点一致・空き時間あり" },
  { jobId: "E", assignedTo: "田中職人", reason: "看板貼付スキルあり・拠点一致・空き時間あり" }
]
```

## 🏗️ 設計方針・アーキテクチャ

### コア設計原則

1. **単一責任原則**: 各クラスは特定の責任のみを持つ
2. **拡張性**: 新しい制約やロジックを簡単に追加できる
3. **可読性**: コードが自己文書化され、理解しやすい
4. **型安全性**: TypeScriptを活用した堅牢な実装

### アーキテクチャ構成

```
src/
├── types.ts          # 型定義
├── utils.ts          # ユーティリティ関数
├── constraints.ts    # 制約チェック・バリデーション
├── scheduler.ts      # メインスケジューリングロジック
├── examples.ts       # サンプルデータ
└── index.ts          # エントリーポイント
```

### スケジューリングアルゴリズム

1. **事前処理**: 職人のスケジュールを初期化
2. **案件ソート**: 時間順で案件をソート（早い時間が優先）
3. **割当ループ**: 各案件に対して最適な職人を探索
4. **スコア計算**: 制約違反、距離、既存ワークロードを考慮
5. **割当実行**: 最高スコアの職人に案件を割当

### スコア計算ロジック

```typescript
// スコア = 距離スコア + ワークロードスコア * 0.1
// より低いスコア = より良い割当
const score = locationScore + workloadScore * 0.1;
```

## 🔧 カスタマイズ・拡張

### 新しい制約の追加

1. `ConstraintValidator` クラスに新しいメソッドを追加
2. `calculateAssignmentScore` メソッドでスコア計算に組み込み

例：最大移動距離制約の追加

```typescript
// constraints.ts に追加
checkMaxTravelDistance(worker: Worker, job: Job, maxDistance: number): boolean {
  const distance = this.calculateLocationPriority(worker, job);
  return distance <= maxDistance;
}
```

### カスタム制約の設定

```typescript
const customConstraints = {
  maxJobsPerDay: 6,        // 1日最大6件
  maxMorningJobs: 3,       // 午前最大3件
  maxAfternoonJobs: 3,     // 午後最大3件
  morningEnd: 13 * 60      // 午前終了を13:00に設定
};

const assignments = scheduleJobs(workers, jobs, customConstraints);
```

### 距離マッピングのカスタマイズ

```typescript
const locationDistances = [
  { from: "西区", to: "中央区", priority: 5 },   // 隣接エリア
  { from: "西区", to: "北区", priority: 10 },    // 遠いエリア
  // ... 他の距離定義
];

const assignments = scheduleJobs(workers, jobs, undefined, locationDistances);
```

## 📁 ファイル構成

```
kanban/
├── package.json           # プロジェクト設定
├── tsconfig.json         # TypeScript設定
├── src/                  # ソースコード
│   ├── types.ts          # 型定義
│   ├── utils.ts          # ユーティリティ
│   ├── constraints.ts    # 制約ロジック
│   ├── scheduler.ts      # メインロジック
│   ├── examples.ts       # サンプルデータ
│   └── index.ts          # エントリーポイント
├── examples/             # サンプルファイル
│   ├── input.json        # 入力例
│   └── output.json       # 出力例
├── dist/                 # ビルド成果物
└── README.md             # このファイル
```

## 🔍 使用例とテストケース

### 基本的な割当

```typescript
import { scheduleJobs } from './src/index';

const workers = [
  { name: "職人A", skills: ["スキル1"], base: "エリア1" }
];

const jobs = [
  { id: "1", location: "エリア1", type: "スキル1", time: "9:00-10:00" }
];

const result = scheduleJobs(workers, jobs);
// 期待結果: 職人Aに案件1が割り当てられる
```

### 制約違反のテスト

```typescript
// 時間重複のテスト
const jobs = [
  { id: "1", location: "エリア1", type: "スキル1", time: "9:00-10:00" },
  { id: "2", location: "エリア1", type: "スキル1", time: "9:30-10:30" }  // 重複
];
// 期待結果: 2件目は割り当てられない
```

## 🛠️ トラブルシューティング

### よくある問題

1. **案件が割り当てられない**
   - スキルマッチングを確認
   - 時間重複がないか確認
   - 1日の最大案件数に達していないか確認

2. **期待と異なる割当結果**
   - 距離マッピングが正しいか確認
   - 制約設定を見直し

## 📝 開発・コントリビューション

### 開発環境の設定

```bash
git clone <repository>
cd kanban
npm install
npm run build
npm start
```

### コード品質

- TypeScriptの型チェックを活用
- 可読性の高い変数名・関数名を使用
- 適切なコメントを記述

## 📄 ライセンス

MIT License