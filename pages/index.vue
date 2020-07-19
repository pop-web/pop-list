<template>
  <div class="flex m-5">
    <div class="w-full">
      <form @submit.prevent="addTodo">
        <input
          v-model="newTodo"
          class="bg-black bg-opacity-50 appearance-none rounded w-full p-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="＋ ToDoを追加…"
        />
      </form>
      <ul>
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="mt-3"
          :class="{ editing: todo == editedTodo }"
        >
          <div
            class="w-full bg-white hover:bg-gray-200 rounded inline-flex items-center cursor-pointer"
          >
            <label
              class="w-10 h-10 flex items-center justify-center cursor-pointer"
            >
              <input
                type="checkbox"
                class="leading-tight focus:outline-none cursor-pointer"
              />
            </label>
            <button
              type="button"
              class="view-todo w-full p-4 text-left focus:outline-none focus:box-shadow"
              @dblclick="editTodo(todo)"
            >
              {{ todo.comment }}
            </button>
            <input
              v-model="todo.comment"
              v-todo-focus="todo == editedTodo"
              class="input-edit hidden w-full p-4 relative"
              type="text"
            />
          </div>
        </li>
      </ul>
      <div class="text-center mt-5">
        <button
          class="bg-black bg-opacity-50 rounded px-5 py-1 text-white inline-flex items-center"
          @click="compListOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
          </svg>
          <svg
            class="fill-current w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path v-if="isCompleteOpen" d="M9 13l1 1 6-6-2-1-4 4-4-4-2 1z" />
            <path v-else d="M13 11l1-1-6-6-1 2 4 4-4 4 1 2 5-5z" />
          </svg>
          <span>完了済み</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // v-todo-focusカスタムディレクティブ
  directives: {
    'todo-focus'(el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  data() {
    return {
      // todoリスト
      todos: [
        { id: 0, comment: 'あいうえお', state: 0 },
        { id: 1, comment: 'かきくけこ', state: 1 },
        { id: 2, comment: 'んんんん', state: 0 }
      ],
      // 完了リスト
      complieteTodo: [],
      editedTodo: null,
      newTodo: '',
      isCompleteOpen: false
    }
  },
  methods: {
    // リストへ追加
    addTodo() {
      this.todos.push(this.newTodo)
    },
    compListOpen() {
      this.isCompleteOpen = !this.isCompleteOpen
    },
    editTodo(todo) {
      // this.beforeEditCache = todo.comment
      this.editedTodo = todo
    }
  }
}
</script>

<style>
.editing .view-todo {
  display: none;
}
.editing .input-edit {
  display: block;
}
</style>
