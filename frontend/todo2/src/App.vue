<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  
  data() {
    return {
      todos: [
        // { id: 1, todo: '買い物', memo: '牛乳を買う', status: '未着手', addDate: '2023-10-01' },
        // { id: 2, todo: '掃除', memo: '部屋を掃除する', status: '完了', addDate: '2023-10-02' },
      ],
      newTodo: '',
      newMemo: '',
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
  async fetchTodos() {
    try {
      const response = await axios.get('http://localhost:3000/todo2');
      this.todos = response.data;
    } catch (error) {
      console.error('データの取得に失敗:', error);
    }

  },
    async addTodo() {
    if (!this.newTodo) return alert('ToDoを入力してください');
    const payload = {
      todo: this.newTodo,
      memo: this.newMemo || null,
      status: '未着手',
      addDate: new Date().toISOString(),
    };
    try {
      const response = await axios.post('http://localhost:3000/todo2', payload);
      this.todos.push(response.data);
      this.newTodo = '';
      this.newMemo = '';
    } catch (error) {
      console.error('追加に失敗:', error);
    }
   },
    async deleteTodo(id) {
      if (!confirm('本当に削除しますか？')) return;
      try {
        await axios.delete(`http://localhost:3000/todo2/${id}`);
        this.todos = this.todos.filter(todo => todo.id !== id);
      } catch (error) {
        console.error('削除に失敗:', error);
      }
    },
  },
  
};
</script>
<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  todo: Object
})

function formatDate(dateStr) {
  return dayjs(dateStr).format('YYYY/M/D HH:mm');
}
</script>


<template>
  <div>
    <h1>ToDoリスト</h1>
    <input v-model="newTodo" type="text" placeholder="新しいToDoを入力" />
    <input v-model="newMemo" type="text" placeholder="メモを入力" />
    <button @click="addTodo">追加</button>

    <p v-if="todos.length === 0">ToDoがありません</p>

    <table v-else>
      <tr v-for="(todo, index) in todos" :key="index">
        <td>
          <span :class="{ 'todo-done': todo.status === '完了' }">{{ todo.todo }}</span>
        </td>
        <td>{{ todo.status }}</td>
        <td>{{ formatDate(todo.addDate) }}</td>
        <td>
          <button @click="deleteTodo(todo.id)">削除</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>

</style>