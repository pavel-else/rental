<template>
  <div>
    <form class="login login-form" @submit.prevent="login">
      <h1>Sign in</h1>
      <label  class="login-form__label">Email
        <input required v-model="email" type="text"/>
      </label>
      <label class="login-form__label">Password
        <input required v-model="password" type="password"/>
      </label>
        <hr/>
        <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      password: null,
      email: null,
      message: ''
    }
  },
  methods: {
    login() {
      const { email, password } = this;

      this.$store.dispatch('AUTH_REQUEST', { email, password })
      .then(() => {
        this.$router.push('/');
      })
      .catch((err) => {
        this.message = 'Не верный логин или пароль!'
      });
    },
    register() {
      this.$router.push('/Pages/Register');
    }
  }
}
</script>

<style scoped>
  .login-form {
    display: flex;
    flex-direction: column;
  }
  .login-form__label {
    display: inline-flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .login-form__label input {
    margin-left: 10px;
  }
  .login-form button {
    box-sizing: border-box;
    margin-right: 0;
  }
</style>
