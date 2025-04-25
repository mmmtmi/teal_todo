<script>
    export default {
        props: ['todos'],
        emits: ['update-todo']
    }
</script>

<template>

<p v-if="todos.length === 0">
    ToDoがありません
    </p>
<ul v-else> 
    <li v-for="(todo, index) in todos" :key="index">
      <input type="checkbox" v-model="todo.isCompleted" @change="$emit('update-todo',todo)"/>
      <span :class="{'todo-done': todo.isCompleted}">{{ todo.text }}</span>
    </li>
  </ul>
  </template>