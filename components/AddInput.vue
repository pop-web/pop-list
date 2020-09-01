<template>
  <form @submit.prevent="addTodo">
    <input
      v-model="newTodo"
      class="bg-black bg-opacity-50 appearance-none rounded w-full p-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus\:focus:shadow-outline"
      :class="{ 'border-red-500': errorMessage, border: errorMessage }"
      type="text"
      placeholder="＋ ToDoを追加…"
    />
    <span v-show="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </span>
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
      errorMessage: null
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
        this.errorMessage = `何か入力してください`
        return
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
