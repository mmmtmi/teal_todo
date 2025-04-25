<script>
    export default {
        props:['text'],
        emits: ['update:text','clean-todo', 'add-todo']

        }
    
</script>
<template>
    <div>
        <input type="text" :value="text" @input="$emit('update:text', $event.target.value)"/>
  <button @click="$emit('add-todo')">追加</button>
  <button @click="$emit('clean-todo')">完了済みを削除する</button>
  </div>
</template>