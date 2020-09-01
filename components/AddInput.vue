<template>
  <form @submit.prevent="addTodo">
    <input
      v-model="newTodo"
      class="bg-black bg-opacity-50 appearance-none rounded w-full p-4 text-white placeholder-gray-400 leading-tight focus:outline-none"
      :class="{
        'border-red-500': errorBorder,
        border: errorBorder,
        tremble: tremble
      }"
      type="text"
      placeholder="＋ ToDoを追加…"
    />
  </form>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // エラーメッセージ
      errorBorder: null,
      // エラーの震え
      tremble: false
    }
  },
  computed: {
    newTodo: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    // リストへ追加
    async addTodo() {
      if (!this.newTodo) {
        this.tremble = true
        this.errorBorder = true
        setTimeout(() => {
          this.tremble = false
        }, 100)
        return
      } else {
        this.errorBorder = false
      }
      const user = await this.$auth()
      const params = {
        comment: this.newTodo,
        state: false,
        uid: user.uid,
        createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
      }
      try {
        await this.$firestore.collection('todos').add(params)
      } catch (e) {
        alert(e)
      }
      this.newTodo = ''
      this.errorMessage = null
    }
  }
}
</script>

<style scoped>
.tremble {
  animation: tremble 0.1s infinite;
}
@keyframes tremble {
  0% {
    transform: translate(0px, 0px) rotateZ(0deg);
  }
  25% {
    transform: translate(1px, 1px) rotateZ(1deg);
  }
  50% {
    transform: translate(0px, 1px) rotateZ(0deg);
  }
  75% {
    transform: translate(1px, 0px) rotateZ(-1deg);
  }
  100% {
    transform: translate(0px, 0px) rotateZ(0deg);
  }
}
</style>
