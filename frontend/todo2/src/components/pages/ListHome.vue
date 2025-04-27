<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import { getTextOfJSDocComment } from 'typescript';

const router = useRouter();

const todos = ref([]);
const newTodo = ref('');
const newMemo = ref('');
const currentPage = ref(1);
const todoPage = ref(1);
const limit = 10;
const searchQuery = ref('');
const selectedStatus = ref('all'); // 'all', '未着手', '進行中', '完了'

onMounted(() => {
  const{ search, status, page } = router.currentRoute.value.query;
  if(search) searchQuery.value = search||"";
  if(status) selectedStatus.value = status||"all";
  if(page) currentPage.value =page? parseInt(page,10):1;
  
  fetchTodos();
});


async function fetchTodos() {
  try {
    const response = await axios.get('http://localhost:3000/todo2', {
      params: {
        page: currentPage.value,
        limit: limit,
        search: searchQuery.value,
        status: selectedStatus.value,
      },
    });
    todos.value = response.data.todos;
    console.log('取得したデータ:', todos.value);
    todoPage.value = Math.ceil(response.data.total / limit);
  } catch (error) {
    console.error('データの取得に失敗:', error);
  }
}
async function changePage(page) {
  if (page < 1 || page > todoPage.value) return;
  currentPage.value = page;
  await fetchTodos();
}

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
    const response = await axios.post('http://localhost:3000/todo2', payload);
    todos.value.push(response.data);
    newTodo.value = '';
    newMemo.value = '';
  } catch (error) {
    console.error('追加に失敗:', error);
  }
}

async function deleteTodo(id) {
  if (!confirm('本当に削除しますか？')) return;
  try {
    await axios.delete(`http://localhost:3000/todo2/${id}`);
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
import { computed } from 'vue';
const todoCount = computed(() => {
  return todos.value.filter(todo => {
    const matchesSearch = todo.todo.includes(searchQuery.value);
    const matchesStatus =
      selectedStatus.value === 'all' || todo.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});


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
    <!-- <input v-model="newTodo" type="text" placeholder="新しいToDoを入力" />
    <input v-model="newMemo" type="text" placeholder="メモを入力" /> -->
    <button @click="goToAdd">追加</button>

    <p v-if="todos.length === 0">ToDoがありません</p>

    <table v-else>
        <tbody>
      <tr>
        <th>ToDo</th>
        <th>状態</th>
        <th>追加日</th>
        <th>更新日</th>
        <th>編集</th>
        <th>削除</th>
      </tr>
      <tr v-for="(todo, index) in todoCount" :key="index">
      <td><span :class="{ 'todo-done': todo.status === '完了' }">{{ todo.todo }}</span></td>
      <td>{{ todo.status }}</td>
      <td>{{ formatDate(todo.addDate) }}</td>
      <td>{{ formatDate(todo.changeDate) }}</td>
      <td><button @click="goToEdit(todo)">編集</button></td>
      <td><button @click="deleteTodo(todo.id)">削除</button></td>
      </tr>
    </tbody>
    </table>
    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">前へ</button>
      <button 
        v-for="page in todoPage"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
        >
          {{ page }}</button>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === todoPage">次へ</button>
    </div>
  </div>
</template>

<style scoped>
.todo-done {
  text-decoration: line-through;
}

table {
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