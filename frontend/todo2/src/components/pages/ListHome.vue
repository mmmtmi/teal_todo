<script setup lang="ts">

import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import { usePersistedState } from '../usePersistedState'; // 相対パスで読み込む！

interface Todo {
  id: number;
  todo: string;
  memo?: string;
  status: string;
  addDate: string;
  changeDate: string;
  isPublic: boolean;
}

interface TodoListSettings {
  searchQuery: string;
  selectedStatus: string;
  currentPage: number;
  sortOption: string;
  activeTab: string;
  isAccordion: boolean;
}

const router = useRouter();
const apiUrl = import.meta.env.VITE_API_URL;

const state = usePersistedState<TodoListSettings>('todo-list-settings', {
  searchQuery: '',
  selectedStatus: 'all',
  currentPage: 1,
  sortOption: '',
  activeTab: 'all',
  isAccordion: false,
});

const searchQuery = computed({
  get: () => state.value.searchQuery,
  set: (v) => (state.value.searchQuery = v),
});
const selectedStatus = computed({
  get: () => state.value.selectedStatus,
  set: (v) => (state.value.selectedStatus = v),
});
const currentPage = computed({
  get: () => state.value.currentPage,
  set: (v) => (state.value.currentPage = v),
});
const sortOption = computed({
  get: () => state.value.sortOption,
  set: (v) => (state.value.sortOption = v),
});
const activeTab = computed({
  get: () => state.value.activeTab,
  set: (v) => (state.value.activeTab = v),
});

const todos = ref<Todo[]>([]);
const itemsPerPage = 10;

onMounted(() => {
  console.log('🟢 onMounted 実行');
  fetchTodos();
});

async function fetchTodos() {
  console.log('📣 fetchTodos() 呼ばれた！');

  const token = localStorage.getItem('token');
  console.log('🔐 使用するトークン:', token);

  try {
    const res = await axios.get(`${apiUrl}/todo2`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        sort: sortOption.value,
        timestamp: Date.now(),
      },
    });

    console.log('📦 fetchTodos response:', res.data);
    todos.value = res.data;
  } catch (err) {
    console.error('❌ fetchTodos エラー:', err);
  }
}

console.log('🟡 state:', state);
console.log('🟡 state.value:', state.value);
console.log('✅ 確認:', state.value);


const filteredTodos = computed(() =>
  todos.value.filter((todo) => {
    const matchSearch = todo.todo.includes(searchQuery.value);
    const matchStatus = selectedStatus.value === 'all' || todo.status === selectedStatus.value;
    const matchTab =
      activeTab.value === 'all' ||
      (activeTab.value === 'public' && todo.isPublic) ||
      (activeTab.value === 'private' && !todo.isPublic);
    return matchSearch && matchStatus && matchTab;
  })
);

const totalPage = computed(() =>
  Math.max(1, Math.ceil(filteredTodos.value.length / itemsPerPage))
);

const paginatedTodos = computed(() => {
  if (!state.value || !Array.isArray(todos.value)) return [];
  const start = (state.value.currentPage - 1) * itemsPerPage;
  return todos.value.slice(start, start + itemsPerPage);
});

function changePage(p: number) {
  if (p < 1 || p > totalPage.value) return;
  currentPage.value = p;
}

function goToAdd() {
  router.push({ name: 'ListAdd' });
}
function goToEdit(todo: Todo) {
  router.push({ name: 'ListEdit', params: { id: todo.id } });
}
async function deleteTodo(id: number) {
  if (!confirm('削除しますか？')) return;
  await axios.delete(`${apiUrl}/todo2/${id}`);
  todos.value = todos.value.filter((t) => t.id !== id);
}
function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '日付不明';
  return dayjs(dateStr).format('YYYY/M/D HH:mm');
}
function toggleView() {
  state.value.isAccordion = !state.value.isAccordion;
}
const isStateReady = computed(() => {
  const val = state.value;
  return val && typeof val.isAccordion === 'boolean';
});
console.log('🟢 isStateReady:', isStateReady.value);
console.log('🧾 paginatedTodos:', paginatedTodos.value);

</script>

<template>
  <div style="background: yellow; padding: 2rem;">
    🧪 ListAdd テンプレート表示チェック！
  </div>
</template>


<style scoped>
.todo-done {
  text-decoration: line-through;
}

/* table {
  width: 70%;
  border-collapse: collapse;
}
th, td:first-child {
  border-collapse: collapse;
  word-break: break-all;
  text-align: left;
}
th,td {
 
  text-align: center;
}

tr {
  border: 1px solid #ddd;
}
th:first-child   {
    width: 500px;
    word-wrap: break-word;
}
th:nth-child(2) {
  width: 100px;
}
th:nth-child(3) {
  width: 150px;
}
th:nth-child(4) {
  width: 150px;
}
th:nth-child(5) {
  width: 100px;
}
th:nth-child(6) {
  width: 100px;
} */

/* 共通スタイル */
.todo-table {
  width: 100%;
  border-collapse: collapse;
}
.todo-table th,
.todo-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

/* モバイル（画面幅 600px 以下） */
@media (max-width: 600px) {
  .todo-table thead {
    display: none; /* ヘッダー行は非表示 */
  }
  .todo-table tbody tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.75rem;
  }
  .todo-table tbody td {
    display: flex;
    justify-content: space-between;
    /* 任意でラベルを追加 */
  }
  .todo-table tbody td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 0.5rem;
    white-space: nowrap;
  }
  .todo-table .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
}

input, button {
  margin: 5px;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.pagination button.active {
  background-color: #007BFF;
  color: white;
  border-color: #007BFF;
}

.pagination button:disabled {
  background-color: #eee;
  cursor: not-allowed;
}


</style>