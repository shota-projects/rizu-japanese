import { createLocalRepository, createStore, type ProgressStore } from './progress'
import type { Course } from './content/course'

export const progress: ProgressStore = createStore(createLocalRepository(localStorage))

export let course: Course

export function setCourse(next: Course): void {
  course = next
}
