<script setup>
import{ ref } from 'vue';
import axios from 'axios';
import {useRouter } from 'vue-router';

const router = useRouter();

const todo = ref('');
const memo = ref('');
const status = ref('未着手');
const isPublic = ref(false); 

const apiUrl = import.meta.env.VITE_API_URL;

async function addTodo() {
  if (!todo.value) return alert('ToDoを入力してください');
  const payload = {
    todo: todo.value,
    memo: memo.value || null,
    status: status.value,
    addDate: new Date().toISOString(),
    changeDate: new Date().toISOString(),
    isPublic: isPublic.value,
  };
  try {
    const response = await axios.post(`${apiUrl}/todo2`, payload);
    alert('追加しました！')
    router.push('/home'); // 一覧に戻るなど
  } catch (error) {
    console.error('追加に失敗:', error);
  }
  
}

function flexTextarea(el) {
  const dummy = el.querySelector('.FlexTextarea__dummy')
  el.querySelector('.FlexTextarea__textarea').addEventListener('input', e => {
    dummy.textContent = e.target.value + '\u200b'
  })
}

document.querySelectorAll('.FlexTextarea').forEach(flexTextarea)
function goHome() {
  router.push({ name: 'ListHome' });
}
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-header">
        <h2 class="h5 mb-0">ToDo追加</h2>
      </div>
      <div class="card-body">

        <div class="mb-3">
          <label for="todo" class="form-label">ToDo</label>
          <textarea id="todo" class="form-control" v-model="todo" rows="2"></textarea>
        </div>

        <div class="mb-3">
          <label for="memo" class="form-label">メモ</label>
          <textarea id="memo" class="form-control" v-model="memo" rows="3"></textarea>
        </div>

        <div class="mb-3">
          <label for="status" class="form-label">状態</label>
          <select id="status" class="form-select" v-model="status">
            <option>未着手</option>
            <option>進行中</option>
            <option>完了</option>
          </select>
        </div>

        <div class="form-check mb-3">
          <input
            class="form-check-input"
            type="checkbox"
            id="isPublic"
            v-model="isPublic"
          />
          <label class="form-check-label" for="isPublic">
            みんなに共有する（公開ToDo）
          </label>
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-primary me-2" @click="addTodo">保存</button>
          <button class="btn btn-secondary" @click="goHome">キャンセル</button>
        </div>

      </div>
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