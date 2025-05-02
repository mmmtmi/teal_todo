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

const apiUrl = import.meta.env.VITE_API_URL;

onMounted(async () => {
  const response = await axios.get(`${apiUrl}/todo2/${id}`)
  const data = response.data
  todo.value = data.todo
  memo.value = data.memo
  status.value = data.status
})

async function updateTodo() {
  await axios.put(`${apiUrl}/todo2/${id}`, {
    todo: todo.value,
    memo: memo.value,
    status: status.value,
    changeDate: new Date().toISOString()
  })
  alert('更新しました！')
  router.push('/') // 一覧に戻るなど
}
function goHome() {
  router.push({ name: 'ListHome' });
}
</script>

<template>
  
  <div>
    <div>
      <h2 class="display-6">ToDo編集</h2>
    </div>
    <div><label>ToDo:</label></div>
    <div>
    <textarea v-model="todo" id="todoCss" ></textarea>
   </div>
    
    <label>メモ:</label>
<div> 
  <textarea id="textarea" v-model="memo" ></textarea>

</div>
    
    <dev><label>状態:</label></dev>
    <p>
    <div>
    <select v-model="status">
      <option>未着手</option>
      <option>進行中</option>
      <option>完了</option>
    </select>
    </div> </p>
    <div>
   
    </div  class="btn-toolbar" role="toolbar">
    <div class="btn-group me-2" role="group" aria-label="第一グループ">
    <button class="btn btn-primary" @click="updateTodo">保存</button>
  </div>
  <div class="btn-group me-2" role="group" aria-label="第二グループ">
    <button class="btn btn-danger" @click="goHome">キャンセル</button>
  </div>
  </div>
</template>

<style scoped>

#todoCss {
  resize: none;
  line-height: 1.8;
  height: 50px;
  width: 50%;
  padding: 2px;
} 

#textarea {
  resize: none;
  line-height: 1.8;
  height: 200px;
  width: 50%;
  padding: 2px;
} 

</style>