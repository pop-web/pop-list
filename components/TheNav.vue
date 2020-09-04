<template>
  <nav class="flex items-center justify-between bg-red-600 px-5 py-2">
    <div class="flex items-center flex-shrink-0 text-white">
      <svg
        class="fill-current h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
      </svg>
      <span class="font-semibold text-xl tracking-tight">To Do</span>
    </div>
    <div class="relative w-3/5 lg:w-auto">
      <label class="search absolute">
        <svg
          class="fill-current w-5 h-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M13 14a8 8 0 111-1l6 5-2 2-5-6zm-5 0A6 6 0 108 2a6 6 0 000 12z"
          />
        </svg>
      </label>
      <input
        v-model="searchWord"
        type="text"
        class="w-full lg:w-96 bg-white bg-opacity-50 appearance-none rounded p-2 pl-10 leading-tight focus:outline-none focus\:focus:shadow-outline"
      />
    </div>
    <div class="block flex items-center w-auto">
      <div>
        <button
          class="block text-red-200 hover:text-white focus:outline-none"
          @click="logout()"
        >
          <span class="text-sm">ログアウト</span>
        </button>
      </div>
    </div>
    <!-- <div class="block flex items-center w-auto">
      <div>
        <button
          class="block text-red-200 hover:text-white focus:outline-none"
          @click="drawer"
        >
          <div class="w-10">
            <img :src="userInfo.photoURL" class="rounded-full" />
          </div>
        </button>
      </div>
    </div>
    <transition
      enter-class="opacity-0"
      enter-active-class="ease-out transition-medium"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-active-class="ease-out transition-medium"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isOpen"
        class="z-10 fixed inset-0 transition-opacity"
        @keydown.esc="isOpen = false"
      >
        <div
          class="absolute inset-0 bg-black opacity-50"
          tabindex="0"
          @click="isOpen = false"
        ></div>
      </div>
    </transition>
    <aside
      class="transform top-0 right-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <button
        class="w-full flex items-center p-4 hover:bg-red-600 hover:text-white"
        @click="isOpen = false"
      >
        <span class="mr-2">
          <svg
            class="fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 7L2 4l2-2 3 2 1-1 1-3h2l1 3 2 1 2-2 2 2-2 3 1 1 3 1v2l-3 1-1 2 2 2-2 2-3-2-1 1-1 3H9l-1-3-2-1-2 2-2-2 2-3-1-1-3-1V9l3-1 1-2zm6 6a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </span>
        <span>設定</span>
      </button>
      <button
        class="w-full flex items-center p-4 hover:bg-red-600 hover:text-white"
        @click="logout()"
      >
        <span class="mr-2">
          <svg
            class="fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 8V6a6 6 0 1112 0h-3v2h4a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2v-8l2-2h1zm5 7v2h2v-2a2 2 0 10-2 0zM7 6v2h6V6a3 3 0 00-6 0z"
            />
          </svg>
        </span>
        <span>ログアウト</span>
      </button>
    </aside> -->
  </nav>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    doingUnsubscribe: {
      type: Function,
      required: true
    },
    doneUnsubscribe: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      // メニューの開閉
      isOpen: false
    }
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    // 検索ワード
    searchWord: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    // メニュードロワーの開閉
    drawer() {
      this.isOpen = !this.isOpen
    },
    // ログアウト
    async logout() {
      this.doingUnsubscribe()
      this.doneUnsubscribe()
      try {
        await this.$fireAuth.signOut()
        this.$router.push('/login')
      } catch (e) {}
    }
  }
}
</script>
<style scoped>
.search {
  top: 0.5rem;
  left: 0.5rem;
}
</style>
