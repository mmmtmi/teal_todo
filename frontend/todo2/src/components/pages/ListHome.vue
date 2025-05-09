<script setup lang="ts">

import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import { usePersistedState } from '../usePersistedState'; // 相対パスで読み込む！
import  DOMPurify from 'dompurify';

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
  const start = (state.value.currentPage - 1) * itemsPerPage;
  return sortedTodos.value.slice(start, start + itemsPerPage);
});

const sortedTodos = computed(() => {
  const sorted = [...filteredTodos.value];

  switch (sortOption.value) {
    case 'nameAsc':
      sorted.sort((a, b) => a.todo.localeCompare(b.todo));
      break;
    case 'nameDesc':
      sorted.sort((a, b) => b.todo.localeCompare(a.todo));
      break;
    case 'addAsc':
      sorted.sort((a, b) => new Date(a.addDate).getTime() - new Date(b.addDate).getTime());
      break; // ← これが必要！
    case 'addDesc':
      sorted.sort((a, b) => new Date(b.addDate).getTime() - new Date(a.addDate).getTime());
      break;
    case 'dateAsc':
      sorted.sort((a, b) => new Date(a.changeDate).getTime() - new Date(b.changeDate).getTime());
      break;
    case 'dateDesc':
      sorted.sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime());
      break;
    default:
      break;
  }

  return sorted;
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

function formatMemoSafe(memo: string | undefined | null): string {
  if (!memo) return '(なし)';
  return DOMPurify.sanitize(memo.replace(/\n/g, '<br>'));
}
</script>

<template>
  <div class="container">

    <!-- 検索とフィルタ -->
    <div class="mb-3">
      <input v-model="searchQuery" type="text" placeholder="検索" class="form-control mb-2" />
      <select v-model="selectedStatus" class="form-select mb-2">
        <option value="all">すべて</option>
        <option value="未着手">未着手</option>
        <option value="進行中">進行中</option>
        <option value="完了">完了</option>
      </select>
      <select v-model="sortOption" class="form-select form-select-sm mb-2">
      <option value="">並び替えなし</option>
      <option value="nameAsc">名前（昇順）</option>
      <option value="nameDesc">名前（降順）</option>
      <option value="addAsc">追加日（古い順）</option>
      <option value="addDesc">追加日（新しい順）</option>
      <option value="dateAsc">更新日（古い順）</option>
      <option value="dateDesc">更新日（新しい順）</option>
</select>
    </div>

    <!-- 表示切り替え -->
    <div class="text-end mb-3">
      <button class="btn btn-outline-secondary btn-sm" @click="toggleView">
        <i class="bi" :class="state.isAccordion ? 'bi-table' : 'bi-list-task'"></i>
        {{ state.isAccordion ? '表形式に切り替え' : 'アコーディオン形式に切り替え' }}
      </button>
    </div>

    <!-- タブ -->
    <ul class="nav nav-pills mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">すべて</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'public' }" @click="activeTab = 'public'">公開</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'private' }" @click="activeTab = 'private'">非公開</button>
      </li>
    </ul>

    <!-- ページネーション -->
    <div v-if="totalPage > 1" class="pagination mt-3 mb-3">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-light btn-sm me-1">前へ</button>
      <button
        v-for="page in totalPage"
        :key="page"
        @click="changePage(page)"
        :class="['btn btn-sm', currentPage === page ? 'btn-primary' : 'btn-outline-secondary', 'me-1']">
        {{ page }}
      </button>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPage" class="btn btn-light btn-sm">次へ</button>
    </div>

    <!-- 表示内容 -->
    <p v-if="paginatedTodos.length === 0">ToDoがありません</p>

    <!-- 表形式 -->
    <table v-if="!state.isAccordion" class="table table-striped">
      <thead>
        <tr>
          <th>ToDo</th><th>状態</th><th>追加日</th><th>更新日</th><th>編集</th><th>削除</th><th>公開</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="todo in paginatedTodos" :key="todo.id">
          <td :class="{ 'text-decoration-line-through': todo.status === '完了' }">{{ todo.todo }}</td>
          <td>{{ todo.status }}</td>
          <td>{{ formatDate(todo.addDate) }}</td>
          <td>{{ formatDate(todo.changeDate) }}</td>
          <td><button class="btn btn-primary btn-sm" @click="goToEdit(todo)">編集</button></td>
          <td><button class="btn btn-danger btn-sm" @click="deleteTodo(todo.id)">削除</button></td>
          <td>
            <span :class="todo.isPublic ? 'badge bg-success' : 'badge bg-secondary'">
              <i :class="todo.isPublic ? 'bi bi-check-circle' : 'bi bi-lock'"></i>
              {{ todo.isPublic ? '公開' : '非公開' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- アコーディオン形式 -->
    <div v-else class="accordion" id="todoAccordion">
      <div class="accordion-item" v-for="(todo, i) in paginatedTodos" :key="todo.id">
        <h2 class="accordion-header" :id="'heading' + i">
          <button class="accordion-button collapsed" type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse' + i"
                  :aria-controls="'collapse' + i">
            {{ todo.todo }}（{{ todo.status }}）
          </button>
        </h2>
        <div :id="'collapse' + i" class="accordion-collapse collapse"
             :aria-labelledby="'heading' + i" data-bs-parent="#todoAccordion">
          <div class="accordion-body">
            <p><strong>メモ:</strong> <br> <span v-html="formatMemoSafe(todo.memo)"></span></p>
            <p><strong>状態:</strong> {{ todo.status }}</p>
            <p><strong>追加日:</strong> {{ formatDate(todo.addDate) }}</p>
            <p><strong>更新日:</strong> {{ formatDate(todo.changeDate) }}</p>
            <p>
              <strong>公開:</strong>
              <span :class="todo.isPublic ? 'badge bg-success' : 'badge bg-secondary'">
                <i :class="todo.isPublic ? 'bi bi-check-circle' : 'bi bi-lock'"></i>
                {{ todo.isPublic ? '公開' : '非公開' }}
              </span>
            </p>
            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-primary btn-sm" @click="goToEdit(todo)">編集</button>
              <button class="btn btn-danger btn-sm" @click="deleteTodo(todo.id)">削除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ページネーション -->
    <div v-if="totalPage > 1" class="pagination mt-3">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-light btn-sm me-1">前へ</button>
      <button v-for="page in totalPage" :key="page" @click="changePage(page)"
              :class="['btn btn-sm', currentPage === page ? 'btn-primary' : 'btn-outline-secondary']"
              class="me-1">
        {{ page }}
      </button>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPage" class="btn btn-light btn-sm">次へ</button>
    </div>
  </div>
</template>


<style scoped>
.todo-done {
  text-decoration: line-through;
}

.pagination .btn {
  min-width: 2.5rem;
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

/* .pagination button {
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
} */


</style>