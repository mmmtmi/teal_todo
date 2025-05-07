<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';

const router = useRouter();

const todos = ref([]);
const newTodo = ref('');
const newMemo = ref('');

const todoPage = ref(1);

const allTodos = ref([]); // すべてのToDoを格納する配列
const itemsPerPage = ref(10); // 1ページあたりのアイテム数

const apiUrl = import.meta.env.VITE_API_URL;

const sortOption = ref(''); 

onMounted(() => {
  fetchTodos();
});

watch(sortOption,() => {
  fetchTodos();
});

// 現在のページ
const currentPage = ref(1);
const limit = 10;

const searchQuery = ref('');
const selectedStatus = ref('all'); // 'all', '未着手', '進行中', '完了'

const fetchTodos = async() => {
  try {
    const response = await axios.get(`${apiUrl}/todo2`, {
      params: {
        sort : sortOption.value,
        timestamp: new Date().getTime()
      }
    });
    todos.value = response.data;
  } catch (error) {
    console.error('データの取得に失敗:', error);
  }
}

const activeTab = ref('all'); // 初期タブは「すべて」

// フィルタリング処理
const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    const matchesSearch = todo.todo.includes(searchQuery.value);  // 検索条件
    const matchesStatus = selectedStatus.value === 'all' || todo.status === selectedStatus.value;  // ステータス条件

    // タブに基づくフィルター
    const matchesTab =
      activeTab.value === 'all' ||
      (activeTab.value === 'public' && todo.isPublic) ||
      (activeTab.value === 'private' && !todo.isPublic);

    return matchesSearch && matchesStatus && matchesTab;
  });
});

const totalpage = computed(() => {
  const total = Math.ceil(filteredTodos.value.length / itemsPerPage.value);
  return total > 1 ? total : 1;  // 1ページのみでも表示されるように
});

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTodos.value.slice(start, end);
});

// ページ変更
function changePage(page) {
  if (page < 1 || page > totalpage.value) return;  // ページが範囲外なら変更しない
  currentPage.value = page;
}

// 新しいToDo追加
async function addTodo() {
  if (!newTodo.value) return alert('ToDoを入力してください');
  const payload = {
    todo: newTodo.value,
    memo: newMemo.value || null,
    status: '未着手',
    addDate: new Date().toISOString(),
    changeDate: new Date().toISOString(),
  };
  try {
    const response = await axios.post(`${apiUrl}/todo2`, payload);
    todos.value.push(response.data);
    newTodo.value = '';
    newMemo.value = '';
  } catch (error) {
    console.error('追加に失敗:', error);
  }
}

// 削除
async function deleteTodo(id) {
  if (!confirm('本当に削除しますか？')) return;
  try {
    await axios.delete(`${apiUrl}/todo2/${id}`);
    todos.value = todos.value.filter(todo => todo.id !== id);
  } catch (error) {
    console.error('削除に失敗:', error);
  }
}



function formatDate(dateStr) {
  return dayjs(dateStr).format('YYYY/M/D HH:mm');
}

function goToEdit(todo) {
  router.push({ name: 'ListEdit', params: { id: todo.id } });
}

function goToAdd() {
  router.push({ name: 'ListAdd' });
}

// 表示切り替え
function toggleView() {
  state.value.isAccordion = !state.value.isAccordion;
}

</script>


<template>
  <router-view />
  <div>
    <input v-model="searchQuery" type="text" placeholder="検索" />
    <select v-model="selectedStatus">
      <option value="all">すべて</option>
      <option value="未着手">未着手</option>
      <option value="進行中">進行中</option>
      <option value="完了">完了</option>
    </select>
  </div>

  <div>
    <p>
    <button class="btn btn-primary" @click="goToAdd">追加</button>
    </p>

    <div>
      <label for="sort">ソート：</label>
      <select v-model="sortOption">
        <option value="createdAt_desc">追加日（新しい順）</option>
        <option value="createdAt_asc">追加日（古い順）</option>
        <option value="updatedAt_desc">更新日（新しい順）</option>
        <option value="updatedAt_asc">更新日（古い順）</option>
        <option value="name_asc">名前（A→z）</option>
        <option value="name_desc">名前（z→A）</option>
      </select>
    </div>

    <div v-if="totalpage > 1" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">前へ</button>

      <button
        v-for="page in totalpage"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalpage">次へ</button>
    </div>

    
    <div>
  <!-- タブ -->
  <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'" type="button">すべて</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" :class="{ active: activeTab === 'public' }" @click="activeTab = 'public'" type="button">公開</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" :class="{ active: activeTab === 'private' }" @click="activeTab = 'private'" type="button">非公開</button>
    </li>
  </ul>

  <!-- ToDoがない場合 -->
  <p v-if="paginatedTodos.length === 0">ToDoがありません</p>

  <!-- タブの中身（ToDo一覧） -->
  <table v-else class="table table-striped todo-table">
    <thead>
      <tr>
        <th>ToDo</th>
        <th>状態</th>
        <th>追加日</th>
        <th>更新日</th>
        <th>編集</th>
        <th>削除</th>
        <th>パブリック</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="todo in paginatedTodos" :key="todo.id">
        <td data-label="Todo"><span :class="{ 'text-decoration-line-through': todo.status === '完了' }">{{ todo.todo }}</span></td>
        <td data-label="状態">{{ todo.status }}</td>
        <td data-label="追加日">{{ formatDate(todo.addDate) }}</td>
        <td data-label="更新日">{{ formatDate(todo.changeDate) }}</td>
        <td class="action" data-label="編集">
          <button class="btn btn-primary btn-sm" @click="goToEdit(todo)">編集</button>
        </td>
        <td class="action" data-label="削除">
          <button class="btn btn-danger btn-sm" @click="deleteTodo(todo.id)">削除</button>
        </td>
        <td data-label="パブリック">
  <span :class="todo.isPublic ? 'badge bg-success' : 'badge bg-secondary'">
    <i :class="todo.isPublic ? 'bi bi-check-circle' : 'bi bi-lock'"></i>
    {{ todo.isPublic ? '公開' : '非公開' }}
  </span>
</td>
      </tr>
    </tbody>
  </table>
</div>

    <!-- ページネーション -->
    <div v-if="totalpage > 1" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">前へ</button>

      <button
        v-for="page in totalpage"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalpage">次へ</button>
    </div>
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