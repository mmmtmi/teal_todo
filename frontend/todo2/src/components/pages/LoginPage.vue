  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: email.value,
        password: password.value,
      });
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      router.push('/home'); // ログイン後のリダイレクト先
    } catch (error) {
      alert('ログインに失敗しました。');
    }
  };

  function gotoRegister(){
    router.push({ name: 'Register'});
  }
  </script>

  <template>
   
<div class="container-fluid vh-100 w-100 d-flex justify-content-center align-items-center bg-dark">
  <div class="card shadow-lg p-4" style="width: 100%; max-width: 400px;">
    <div class="text-center mb-4">
      <img src="/logo2.svg" alt="テストロゴ" width="250" />
      <h1 class="h4 text-gray-900">ログイン</h1>
      
    </div>
    <form @submit.prevent="handleLogin">
      <div class="form-group mb-3">
        <input type="email" v-model="email" class="form-control" placeholder="メールアドレス" required />
      </div>
      <div class="form-group mb-3">
        <input type="password" v-model="password" class="form-control" placeholder="パスワード" required />
      </div>
     <div class="d-flex justify-content-between">
  <button type="submit" class="btn btn-primary w-100 me-3">ログイン</button>
  <button type="button" class="btn btn-secondary w-100" @click="gotoRegister">ユーザー登録</button>
</div>
    </form>
  </div>
</div>

  </template>
  

  