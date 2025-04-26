<script setup>
import{ ref } from 'vue';
import axios from 'axios';
import {useRouter } from 'vue-router';

const router = useRouter();

const todo = ref('');
const memo = ref('');
const status = ref('未着手');

async function addTodo() {
  if (!todo.value) return alert('ToDoを入力してください');
  const payload = {
    todo: todo.value,
    memo: memo.value || null,
    status: status.value,
    addDate: new Date().toISOString(),
    changeDate: new Date().toISOString(),
  };
  try {
    const response = await axios.post('http://localhost:3000/todo2', payload);
    router.push('/'); // 一覧に戻るなど
  } catch (error) {
    console.error('追加に失敗:', error);
  }
  
}
</script>

<template>
    <div>
    <h2>ToDo編集</h2>
    <label>ToDo:</label>
    <input v-model="todo" />

    <label>メモ:</label>
    <input v-model="memo" />

    <label>状態:</label>
    <select v-model="status">
      <option>未着手</option>
      <option>進行中</option>
      <option>完了</option>
    </select>

    <button @click="addTodo">保存</button>
    </div>
</template>

