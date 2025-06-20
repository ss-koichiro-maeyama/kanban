# 職人スケジュール再配置AIアシスタント

AI技術を活用した職人のスケジュール最適化システムです。案件情報と職人の情報から、スキル・距離・時間制約を考慮した最適な割当を自動提案します。

## 🚀 特徴

- **スキルベース割当**: 職人のスキルと案件要件を自動マッチング
- **距離最適化**: 職人の拠点と現場の距離を考慮した効率的な割当
- **時間管理**: 時間競合の回避と日次作業量制限の遵守
- **柔軟な設定**: 制約条件のカスタマイズが可能
- **TypeScript**: 型安全性とコード保守性を重視

## 📦 インストール

```bash
# リポジトリのクローン
git clone https://github.com/ss-koichiro-maeyama/kanban.git
cd kanban

# 依存関係のインストール
npm install

# ビルド
npm run build
```

## 🎯 使用方法

### 基本的な使い方

```typescript
import { ScheduleAllocationAI, Worker, Job } from './src';

// 職人データの定義
const workers: Worker[] = [
  { name: "田中職人", skills: ["看板貼付"], base: "西区" },
  { name: "佐藤職人", skills: ["電飾施工"], base: "北区" },
  { name: "鈴木職人", skills: ["看板貼付", "電飾施工"], base: "中央区" },
];

// 案件データの定義
const jobs: Job[] = [
  { id: "A", location: "西区", type: "看板貼付", time: "9:00-10:00" },
  { id: "B", location: "北区", type: "電飾施工", time: "10:30-11:30" },
  { id: "C", location: "此花区", type: "看板貼付", time: "13:00-14:00" },
];

// AIアシスタントのインスタンス作成
const ai = new ScheduleAllocationAI();

// 割当実行
const assignments = ai.allocate(workers, jobs);

// 結果の表示
assignments.forEach(assignment => {
  console.log(`案件${assignment.jobId}: ${assignment.assignedTo} (${assignment.reason})`);
});
```

### 制約条件のカスタマイズ

```typescript
const customConstraints = {
  maxJobsPerWorkerPerDay: 6,    // 1日最大6件
  maxMorningJobs: 3,            // 午前最大3件
  maxAfternoonJobs: 3,          // 午後最大3件
  afternoonStartHour: 13        // 午後開始を13時に設定
};

const ai = new ScheduleAllocationAI(customConstraints);
```

## 🏗️ アーキテクチャ

### 主要コンポーネント

- **ScheduleAllocationAI**: メインの割当ロジック
- **Types**: データ型定義（Worker, Job, Assignment等）
- **Utils**: ユーティリティ関数（時間解析、距離計算等）

### 割当アルゴリズム

1. **事前ソート**: 案件をスキルマッチ数と時間順でソート
2. **制約チェック**: 各職人に対してスキル・時間・日次制限をチェック
3. **距離最適化**: 候補の中から最も近い拠点の職人を選択
4. **理由生成**: 割当の根拠を自動生成

### 制約条件

- ✅ スキルマッチング必須
- ✅ 時間競合の回避
- ✅ 1人あたり最大4件/日（午前2件・午後2件）
- ✅ 拠点と現場の距離を考慮
- ✅ 未対応スキルの案件は除外

## 🧪 テスト

```bash
# テストの実行
npm run test

# 開発モードでの実行
npm run dev
```

テストケース:
- 基本的な割当動作
- スキルマッチング
- 時間競合回避
- 距離による優先度
- 日次制限の遵守

## 📊 出力例

```
案件A: 田中職人 (スキルマッチ・拠点一致・空き時間あり)
案件B: 佐藤職人 (スキルマッチ・拠点一致・空き時間あり)
案件C: 田中職人 (スキルマッチ・空き時間あり)
```

## 🔧 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクション実行
npm start
```

## 🚀 今後の拡張予定

- [ ] 地理情報APIとの連携（Google Maps API等）
- [ ] Kintone APIとの統合
- [ ] Slack通知機能
- [ ] Google Sheets出力機能
- [ ] Webダッシュボードの作成
- [ ] 機械学習による割当精度の向上

## 📄 ライセンス

ISC

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題が発生した場合は、GitHubのIssueページにて報告してください。