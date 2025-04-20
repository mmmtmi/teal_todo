<script>
export default {
  data() {
    return {
      title: 'My New Vue Title',
      message: 'Welcome to Vue',
      isRed: true,
      input: {
        firstName: '',
        lastName: '',
        isMember: true,
      },
      users: [
        {
          firstName: 'John',
          lastName: 'Smith',
          isMember: true,
        },
        {
          firstName: 'Taro',
          lastName: 'Shinjuku',
          isMember: false,
        },
        {
          firstName: 'Hanako',
          lastName: 'Shibuya',
          isMember: true,
        },
      ],
    }
  },
  methods: {
    addUser(){
      this.users.push(this.input)
      this.input = {
        firstName: '',
        lastName: '',
        isMember: true,
      }
    },
  },
}
</script>

<template>
  <h1 :title="message" :class="{ red: isRed }">{{ title }}</h1>
  <input type="text" v-model="input.firstName"/>
  <input type="text" v-model="input.lastName"/> 
  <input type="checkbox" v-model="input.isMember"/>
  <button @click="addUser">ユーザー追加</button>
  <h2>ユーザーのデータ</h2>
  <div v-for="(user,index) in users" :key="index">
    <p>Name: {{ user.firstName + ' ' + user.lastName }}</p>
    <p v-if="user.isMember">メンバーです</p>
    <p v-else>メンバーではありません</p>
  </div>
</template>

<style>
  .red {
    color: red;
  }
</style> 