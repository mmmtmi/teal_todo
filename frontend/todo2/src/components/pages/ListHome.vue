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

onMounted(() => {
  fetchTodos();
});

async function fetchTodos() {
  try {
    const response = await axios.get('http://localhost:3000/todo2');
    todos.value = response.data;
  } catch (error) {
    console.error('データの取得に失敗:', error);
  }
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
</script>

<template>
  <router-view />
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
      <tr v-for="(todo, index) in todos" :key="index">
        <td><span :class="{ 'todo-done': todo.status === '完了' }">{{ todo.todo }}</span></td>
        <td>{{ todo.status }}</td>
        <td>{{ formatDate(todo.addDate) }}</td>
        <td> {{formatDate (todo.changeDate) }}</td>
        <td><button @click="goToEdit(todo)">詳細</button></td>
        <td><button @click="deleteTodo(todo.id)">削除</button></td>
      </tr>
    </tbody>
    </table>
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
  border: 1px solid #ccc;
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
</style>
