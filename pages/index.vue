<template>
  <div>
    <nav
      class="flex items-center justify-between flex-wrap bg-red-600 px-5 py-2"
    >
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
      <div class="block lg:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
        >
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div class="relative">
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
          class="w-96 bg-white bg-opacity-50 appearance-none rounded p-2 pl-10 leading-tight focus:outline-none focus\:focus:shadow-outline"
        />
      </div>
      <div class="w-full block lg:flex lg:items-center lg:w-auto">
        <div>
          <a
            href="#responsive-header"
            class="block mt-4 lg:inline-block lg:mt-0 text-red-200 hover:text-white mr-4"
          >
            Docs
          </a>
          <a
            href="#responsive-header"
            class="block mt-4 lg:inline-block lg:mt-0 text-red-200 hover:text-white mr-4"
          >
            Examples
          </a>
          <a
            href="#responsive-header"
            class="block mt-4 lg:inline-block lg:mt-0 text-red-200 hover:text-white"
          >
            Blog
          </a>
        </div>
      </div>
    </nav>
    <div class="flex m-5">
      <div class="w-full">
        <form @submit.prevent="addTodo">
          <input
            v-model="newTodo"
            class="bg-black bg-opacity-50 appearance-none rounded w-full p-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus\:focus:shadow-outline"
            type="text"
            placeholder="＋ ToDoを追加…"
          />
        </form>
        <transition-group name="todo-list" tag="ul">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="mt-3"
            :class="{ editing: todo == editedTodo, 'todo-list-item': true }"
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
                  :checked="todo.state"
                  @click="completeTodo(todo)"
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
                @blur="doneEdit(todo)"
                @keyup.enter="doneEdit(todo)"
                @keyup.esc="cancelEdit(todo)"
              />
            </div>
          </li>
        </transition-group>
        <div class="text-center mt-5">
          <button
            v-if="isCompleteList"
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
          <template v-if="isCompleteOpen">
            <transition-group name="todo-list" tag="ul">
              <li
                v-for="todo in completeList"
                :key="todo.id"
                class="mt-3 todo-list-item"
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
                      :checked="todo.state"
                      @click="cancelTodo(todo)"
                    />
                  </label>
                  <button
                    type="button"
                    class="view-todo w-full p-4 text-left text-gray-600 focus:outline-none focus:box-shadow line-through"
                  >
                    {{ todo.comment }}
                  </button>
                </div>
              </li>
            </transition-group>
          </template>
        </div>
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
      todos: [],
      // 完了リスト
      completeList: [],
      // 編集中のtodo
      editedTodo: null,
      // 編集前のキャッシュ
      beforeEditCache: null,
      // 新しいToDo
      newTodo: '',
      // 完了済みリストの表示非表示
      isCompleteOpen: false,
      // 検索ワード
      searchWord: ''
    }
  },
  computed: {
    isCompleteList() {
      if (this.completeList.length) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.$firestore
      .collection('todos')
      .orderBy('createdAt', 'desc')
      .onSnapshot((roomsSnapShot) => {
        this.todos = []
        roomsSnapShot.forEach((doc) => {
          this.todos.push({
            id: doc.id,
            ...doc.data()
          })
        })
      })
  },
  methods: {
    // リストへ追加
    async addTodo() {
      const params = {
        comment: this.newTodo,
        state: false,
        createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
      }
      try {
        await this.$firestore.collection('todos').add(params)
      } catch (e) {
        alert(e)
      }
      this.newTodo = ''
    },
    async removeTodo(todo) {
      try {
        const res = this.$firestore.collection('todos').doc(todo.id)
        await res.delete()
      } catch (e) {
        alert(e)
      }
    },
    editTodo(todo) {
      this.beforeEditCache = todo.comment
      this.editedTodo = todo
    },
    async doneEdit(todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.comment = todo.comment.trim()
      try {
        const res = this.$firestore.collection('todos').doc(todo.id)
        await res.update({
          comment: todo.comment
        })
      } catch (e) {
        alert(e)
      }
      if (!todo.comment) {
        this.removeTodo(todo)
      }
    },
    cancelEdit(todo) {
      this.editedTodo = null
      todo.comment = this.beforeEditCache
    },
    cancelTodo(todo) {
      todo.state = false
      this.completeList.splice(this.completeList.indexOf(todo), 1)
      this.todos.push(todo)
    },
    completeTodo(todo) {
      todo.state = true
      this.todos.splice(this.todos.indexOf(todo), 1)
      this.completeList.push(todo)
    },
    compListOpen() {
      this.isCompleteOpen = !this.isCompleteOpen
    }
  }
}
</script>

<style scoped>
.editing .view-todo {
  display: none;
}
.editing .input-edit {
  display: block;
}
.search {
  top: 0.5rem;
  left: 0.5rem;
}
.todo-list-item {
  transition: all 0.3s;
}
.todo-list-enter,
.todo-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.todo-list-leave-active {
  width: 100%;
  position: absolute;
}
</style>
