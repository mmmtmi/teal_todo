 <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const register = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        email: email.value,
        password: password.value,
      });
      alert('登録成功！ログインしてください');
      router.push('/');
    } catch (error) {
      alert('登録に失敗しました');
    }
  };
  </script>

  <template>
    <div class="container-fulid vh-100 w-100 d-flex justify-content-center align-items-center bg-dark">
      <div class="card shadow-lg p-4" style="width: 100%; max-width: 400px;">
        <div class="text-center mb-4">
          <h1 class="h4 text-white">ユーザー登録</h1>
        </div>
        <form @submit.prevent="register">
          <div class="form-group mb-3">
            <input v-model="email" type="email" class="form-control" placeholder="メールアドレス" required />
          </div>
          <div class="form-group mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="パスワード" required />
          </div>
          <button class="btn btn-primary btn-block" type="submit">登録</button>
        </form>
      </div>
    </div>
  </template>