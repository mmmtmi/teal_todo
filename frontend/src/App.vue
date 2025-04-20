<script>
export default {
  data() {
    return {
        todos: [
          { text: 'Vueをマスターする', done: true },
          { text: '牛乳を買う', done: false },
          { text: '家賃を払う', done: false },
        ],
        newTodo: {
          text: '',
          done: false,
        },
    }
  },
  methods: {
    addTodo(){
      if(!this.newTodo.text)return alert('ToDoを入力してください')
        this.todos.push({...this.newTodo})
        this.newTodo = {
            text: '',
            done: false,
        }
    },
    cleanTodo(){
      this.todos = this.todos.filter((todo) => !todo.done)
    }
    
  }
}
</script>

<template>
  <h1>My ToDo App</h1>

  <input type="text" v-model="newTodo.text"/><button @click="addTodo">追加</button>
  <button @click="cleanTodo">完了済みを削除する</button>
  <p v-if="todos.length === 0">
    ToDoがありません
    </p>
  <ul v-else> 
    <li v-for="(todo, index) in todos" :key="index">
      <input type="checkbox" v-model="todo.done">
      <span :class="{'todo-done': todo.done}">{{ todo.text }}</span>
    </li>
  </ul>
</template>

<style>
body {
  background-color: #eee;
}

.todo-done {
  text-decoration: line-through;
}
</style>
