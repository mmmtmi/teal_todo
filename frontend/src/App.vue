<script>
export default {
  data() {
    return {
        todos: [
          // { text: 'Vueをマスターする', done: true },
          // { text: '牛乳を買う', done: false },
          // { text: '家賃を払う', done: false },
        ],
        newTodo: { 
          text: '',
          done: false,
        },
    }
  },
  mounted(){
    this.fetchTodos();
  },
  methods: {
    async fetchTodos(){
      try{
        const response = await this.$axios.get('http://localhost:3000/todos');
        this.todos = response.data;
      }catch(error){
        console.error('取得に失敗:', error);
      }
    },
    async addTodo(){
      if(!this.newTodo.text)return alert('ToDoを入力してください')
      try{
        const response  = await this.$axios.post('http://localhost:3000/todos', this.newTodo);
        this.todos.push(response.data);
        this.newTodo = {
            text: '',
            done: false,
        }
    }catch(error){
        console.error('追加に失敗:', error);
        alert('追加に失敗しました');
      }
    },
    async cleanTodo(){
      const compleatedTodos = this.todos.filter((todo) => todo.done);
      for(const todo of compleatedTodos) {
        try{
          await this.$axios.delete(`http://localhost:3000/todos/${todo.id}`);
        }catch(error){
          console.error('削除に失敗:', error);
          alert('削除に失敗しました');
        }
      }
      this.todos = this.todos.filter((todo) => !todo.done);
      
      
    },
    
  },
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
