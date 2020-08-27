<template>
  <div class="flex justify-center">
    <div
      class="flex items-center flex-col mt-20 w-72 p-5 bg-white shadow rounded"
    >
      <div class="flex items-center mb-5 flex-shrink-0 text-red-600">
        <svg
          class="fill-current h-8 w-8 mr-2"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
        <span class="font-semibold text-3xl tracking-tight">To Do</span>
      </div>
      <div class="w-full border-b pb-2 mb-4">
        <p class="text-center">ログイン</p>
      </div>
      <form class="w-full" @submit.prevent="login">
        <button
          type="submit"
          class="w-full bg-red-600 py-3 px-10 text-white rounded focus:outline-none focus:shadow-outline border"
        >
          Googleでログイン
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['checkLogin'],
  methods: {
    login() {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$fireAuth.signInWithRedirect(provider)
    }
  }
}
</script>
