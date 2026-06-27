const KEY = 'java-lernen-progress'

interface ProgressRow {
  chapter_id: number
  exercise_type: string
  correct: number
  total: number
}

export function localGetProgress(): ProgressRow[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function localUpdateProgress(chapterId: number, exerciseType: string, correct: boolean) {
  if (typeof window === 'undefined') return
  const rows = localGetProgress()
  const existing = rows.find(r => r.chapter_id === chapterId && r.exercise_type === exerciseType)
  if (existing) {
    existing.correct += correct ? 1 : 0
    existing.total += 1
  } else {
    rows.push({ chapter_id: chapterId, exercise_type: exerciseType, correct: correct ? 1 : 0, total: 1 })
  }
  localStorage.setItem(KEY, JSON.stringify(rows))
}
