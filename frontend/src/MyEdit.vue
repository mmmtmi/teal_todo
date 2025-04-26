<script>
export default {
  data() {
    return {
      todo: {
        text: '',
        isCompleted: false,
      },
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const response = await this.$axios.get(`http://localhost:3000/todos/${id}`);
      this.todo = response.data;
    } catch (error) {
      console.error('取得に失敗:', error);
    }
  },
  methods: {
    async updateTodo() {
      try {
        await this.$axios.patch(`http://localhost:3000/todos/${this.todo.id}`, this.todo);
        alert('更新しました');
        this.$router.push('/'); // 一覧に戻る
      } catch (error) {
        console.error('更新に失敗:', error);
        alert('更新に失敗しました');
      }
    },
  },
};
</script>

<template>
  <div>
    <h2>ToDo 編集</h2>
    <div>
      <label>内容：</label>
      <input v-model="todo.text" type="text" />
    </div>
    <div>
      <label>完了：</label>
      <input type="checkbox" v-model="todo.isCompleted" />
    </div>
    <button @click="updateTodo">保存</button>
    <button @click="$router.push('/')">キャンセル</button>
  </div>
</template>

<style scoped>
input[type="text"] {
  margin-bottom: 1rem;
  width: 300px;
}
</style>
