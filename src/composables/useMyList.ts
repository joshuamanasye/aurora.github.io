import { ref, watch } from 'vue'

const STORAGE_KEY = 'aurora.mylist'

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const myList = ref<string[]>(load())

watch(
  myList,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true },
)

export function useMyList() {
  function has(id: string) {
    return myList.value.includes(id)
  }
  function toggle(id: string) {
    if (has(id)) myList.value = myList.value.filter((x) => x !== id)
    else myList.value = [...myList.value, id]
  }
  function add(id: string) {
    if (!has(id)) myList.value = [...myList.value, id]
  }
  function remove(id: string) {
    myList.value = myList.value.filter((x) => x !== id)
  }
  return { myList, has, toggle, add, remove }
}
