<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const todo = ref('')
const memo = ref('')
const status = ref('未着手') // 初期状態
const id = route.params.id

onMounted(async () => {
  const response = await axios.get(`http://localhost:3000/todo2/${id}`)
  const data = response.data
  todo.value = data.todo
  memo.value = data.memo
  status.value = data.status
})

async function updateTodo() {
  await axios.put(`http://localhost:3000/todo2/${id}`, {
    todo: todo.value,
    memo: memo.value,
    status: status.value,
    changeDate: new Date().toISOString()
  })
  alert('更新しました！')
  router.push('/') // 一覧に戻るなど
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

    <button @click="updateTodo">保存</button>
  </div>
</template>