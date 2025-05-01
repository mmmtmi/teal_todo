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

onMounted(() => {
  fetchTodos();
});

// 現在のページ
const currentPage = ref(1);
const limit = 10;

const searchQuery = ref('');
const selectedStatus = ref('all'); // 'all', '未着手', '進行中', '完了'

async function fetchTodos() {
  try {
    const response = await axios.get(`${apiUrl}/todo2`);
    console.log('todo2 response:', response.data);
    todos.value = response.data;
  } catch (error) {
    console.error('データの取得に失敗:', error);
  }
}

const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    const matchesSearch = todo.todo.includes(searchQuery.value);  // 検索条件
    const matchesStatus = selectedStatus.value === 'all' || todo.status === selectedStatus.value;  // ステータス条件
    return matchesSearch && matchesStatus;
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
    <button class="btn btn-primary" @click="goToAdd">追加</button>

    <p v-if="todos.length === 0">ToDoがありません</p>

    <table v-else class="table" >
      <tbody>
        <tr>
          <th>ToDo</th>
          <th>状態</th>
          <th>追加日</th>
          <th>更新日</th>
          <th>編集</th>
          <th>削除</th>
        </tr>
        <tr v-for="todo in paginatedTodos" :key="todo.id">
          <td><span :class="{ 'todo-done': todo.status === '完了' }">{{ todo.todo }}</span></td>
          <td>{{ todo.status }}</td>
          <td>{{ formatDate(todo.addDate) }}</td>
          <td>{{ formatDate(todo.changeDate) }}</td>
          <td><button class="btn btn-primary" @click="goToEdit(todo)">編集</button></td>
          <td><button class="btn btn-primary" @click="deleteTodo(todo.id)">削除</button></td>
        </tr>
      </tbody>
    </table>

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