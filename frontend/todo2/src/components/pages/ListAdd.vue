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

function flexTextarea(el) {
  const dummy = el.querySelector('.FlexTextarea__dummy')
  el.querySelector('.FlexTextarea__textarea').addEventListener('input', e => {
    dummy.textContent = e.target.value + '\u200b'
  })
}

document.querySelectorAll('.FlexTextarea').forEach(flexTextarea)

</script>

<template>
    <div>
    <h2>ToDo編集</h2>
    </div>
    <div><label>ToDo:</label></div>
    <div>
      <textarea v-model="todo" id="todoCss" ></textarea>
   </div>
    
   <label for="FlexTextarea">メモ</label>
<div> 
  <textarea id="textarea" v-model="memo" ></textarea>

</div>


    
    <dev><label>状態:</label></dev>
    <div>
    <select v-model="status">
      <option>未着手</option>
      <option>進行中</option>
      <option>完了</option>
    </select>
    </div>
    <div>
    <button @click="addTodo">保存</button>
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