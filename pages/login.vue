<template>
  <div class="flex justify-center">
    <div
      class="flex items-center flex-col mt-20 w-84 p-5 bg-white shadow rounded"
    >
      <div class="flex items-center mb-5 flex-shrink-0 text-red-600">
        <svg
          class="fill-current h-8 w-8 mr-2"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
        <span class="font-semibold text-3xl tracking-tight">POP LIST</span>
      </div>
      <div class="w-full border-b pb-2 mb-4">
        <p class="text-center">ログイン</p>
      </div>
      <form class="w-full" @submit.prevent="login('google')">
        <button
          type="submit"
          class="w-full bg-red-600 py-3 px-10 text-white rounded focus:outline-none focus:shadow-outline border"
        >
          <div class="flex items-center justify-center">
            <svg
              class="fill-current h-4 w-4 mr-2"
              viewBox="0 0 488 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M488 262c0 141-97 242-240 242A248 248 0 11414 73l-67 65C259 53 94 117 94 256c0 87 69 157 154 157 98 0 135-71 141-107H248v-86h236c2 13 4 25 4 42z"
              />
            </svg>
            <span>Googleでログイン</span>
          </div>
        </button>
      </form>
      <form class="w-full mt-1" @submit.prevent="login('twitter')">
        <button
          type="submit"
          class="w-full bg-blue-600 py-3 px-10 text-white rounded focus:outline-none focus:shadow-outline border"
        >
          <div class="flex items-center justify-center">
            <svg
              class="fill-current h-4 w-4 mr-2"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M459 152l1 13c0 139-106 299-299 299-59 0-115-17-161-47a217 217 0 00156-44c-47-1-85-31-98-72l19 1c10 0 19-1 28-3-48-10-84-52-84-103v-2c14 8 30 13 47 14A105 105 0 0136 67c51 64 129 106 216 110-2-8-2-16-2-24a105 105 0 01181-72c24-4 47-13 67-25-8 24-25 45-46 58 21-3 41-8 60-17-14 21-32 40-53 55z"
              />
            </svg>
            <span>Twitterでログイン</span>
          </div>
        </button>
      </form>
      <form class="w-full" @submit.prevent="login('guest')">
        <button
          type="submit"
          class="w-full bg-orange-500 py-3 px-10 mt-1 text-white rounded focus:outline-none focus:shadow-outline border"
        >
          ゲストログイン
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['checkLogin'],
  methods: {
    async login(auth) {
      if (auth === 'google') {
        const provider = new this.$firebase.auth.GoogleAuthProvider()
        this.$fireAuth.signInWithRedirect(provider)
      } else if (auth === 'twitter') {
        const provider = new this.$firebase.auth.TwitterAuthProvider()
        this.$fireAuth.signInWithRedirect(provider)
      } else if (auth === 'guest') {
        await this.$fireAuth.signInWithEmailAndPassword(
          'demo@popweb.dev',
          'password'
        )
        location.reload()
      }
    }
  }
}
</script>
