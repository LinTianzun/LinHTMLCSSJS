import { ref } from 'vue'

/**
 * 贪吃蛇最高分排行榜（localStorage 持久化，保留前 5 名）
 */

export interface ScoreRecord {
  score: number
  time: string
  date: string // YYYY-MM-DD
}

const STORAGE_KEY = 'dsh-snake-scores'
const MAX_RECORDS = 5

function load(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r): r is ScoreRecord =>
        typeof r === 'object' && r !== null
          && typeof (r as ScoreRecord).score === 'number'
          && typeof (r as ScoreRecord).time === 'string'
          && typeof (r as ScoreRecord).date === 'string',
    )
  } catch {
    return []
  }
}

const records = ref<ScoreRecord[]>(load())

function save(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
}

/** 提交一局成绩；进入前 5 名返回名次（1 起），否则返回 null */
export function submitScore(score: number, time: string): number | null {
  const date = new Date().toISOString().slice(0, 10)
  const record: ScoreRecord = { score, time, date }
  const next = [...records.value, record]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RECORDS)
  const rank = next.indexOf(record)
  records.value = next
  save()
  return rank >= 0 && rank < MAX_RECORDS ? rank + 1 : null
}

/** 当前最高分 */
export function bestScore(): number {
  return records.value[0]?.score ?? 0
}

export function useSnakeScores() {
  return { records, submitScore, bestScore, MAX_RECORDS }
}
