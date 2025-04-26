<script>
import TodoAdd from './components/TodoAdd.vue';
import TodoList from './components/TodoList.vue';
export default {
  components: {
    TodoAdd,
    TodoList,
  },
  data() {
    return {
        todos: [
          // { text: 'Vueをマスターする', done: true },
          // { text: '牛乳を買う', done: false },
          // { text: '家賃を払う', done: false },
        ],
        newTodoText: '',
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
      if(!this.newTodoText)return alert('ToDoを入力してください')
      try{
        const response  = await this.$axios.post('http://localhost:3000/todos',  {
          text: this.newTodoText,
          isCompleted: false,
        });
        this.todos.push(response.data);
        this.newTodo = {
            text: '',
            done: false,
        }
      }catch(error){
        console.error('追加に失敗:', error);
        alert('追加に失敗しました');
      }
      this.newTodoText = '';
    },
    async cleanTodo(){
      const compleatedTodos = this.todos.filter((todo) => todo.isCompleted);
      for(const todo of compleatedTodos) {
        try{
          await this.$axios.delete(`http://localhost:3000/todos/${todo.id}`);
        }catch(error){
          console.error('削除に失敗:', error);
          alert('削除に失敗しました');
        }
      }
      this.todos = this.todos.filter((todo) => !todo.isCompleted);
      
      
    },
    async updateTodo(todo){
      try{
        await this.$axios.patch(`http://localhost:3000/todos/${todo.id}`,{
          isCompleted: todo.isCompleted,
        });
      }catch(error){
        console.error('更新に失敗:', error);
        alert('更新に失敗しました');
      }
      
    }, 
    goToEdit(todo){
      this.$router.push({name: 'MyEdit', params: {id: todo.id}});
    },   
  },
}
</script>

<template>
  <TodoAdd
    :text="newTodoText"
    @update:text="newTodoText = $event"
    @add-todo="addTodo"
    @clean-todo="cleanTodo"
  />

  <TodoList
    :todos="todos"
    @update-todo="updateTodo"
    @open-edit-mode="goToEdit"
  />

</template>

<style>
body {
  background-color: #eee;
}

.todo-done {
  text-decoration: line-through;
}
</style>
