<template>
  <div>
    <TheNav v-model="searchWord" />
    <div class="flex m-5">
      <div class="w-full">
        <form v-if="!searchListMode" @submit.prevent="addTodo">
          <input
            v-model="newTodo"
            class="bg-black bg-opacity-50 appearance-none rounded w-full p-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus\:focus:shadow-outline"
            :class="{ 'border-red-500': errorMessage, border: errorMessage }"
            type="text"
            placeholder="＋ ToDoを追加…"
          />
          <span v-show="errorMessage" class="text-red-500 text-sm ">
            {{ errorMessage }}
          </span>
        </form>
        <template v-if="searchListMode">
          <p class="text-lg font-bold text-red-600">
            "{{ searchWord }}" を検索しています
          </p>
          <transition-group name="todo-list" tag="ul">
            <li
              v-for="todo in filterKeyWord"
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
                <span class="p-4 text-gray-500" @click="removeTodo(todo)">
                  <svg
                    class="fill-current w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"
                    />
                  </svg>
                </span>
              </div>
            </li>
          </transition-group>
        </template>
        <template v-if="!searchListMode">
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
                  <span class="tooltip relative">
                    <input
                      type="checkbox"
                      class="leading-tight focus:outline-none cursor-pointer"
                      :checked="todo.state"
                      @click="completeTodo(todo)"
                    />
                    <span
                      class="tooltip-text text-xs bg-red-600 rounded text-white -mt-12 -ml-3"
                    >
                      完了済みにする
                    </span>
                  </span>
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
                <span class="p-4 text-gray-500" @click="removeTodo(todo)">
                  <svg
                    class="fill-current w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"
                    />
                  </svg>
                </span>
              </div>
            </li>
          </transition-group>
          <div class="text-center mt-5">
            <button
              v-if="isCompleteList"
              class="bg-black bg-opacity-50 rounded px-5 py-1 text-white inline-flex items-center"
              @click="compListOpen"
            >
              <svg
                class="fill-current w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  v-if="isCompleteOpen"
                  d="M9 13l1 1 6-6-2-1-4 4-4-4-2 1z"
                />
                <path v-else d="M13 11l1-1-6-6-1 2 4 4-4 4 1 2 5-5z" />
              </svg>
              <span>完了済み</span>
            </button>
          </div>
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
                    <span class="tooltip relative">
                      <input
                        type="checkbox"
                        class="leading-tight focus:outline-none cursor-pointer"
                        :checked="todo.state"
                        @click="cancelTodo(todo)"
                      />
                      <span
                        class="tooltip-text text-xs bg-red-600 rounded text-white -mt-12 -ml-3"
                      >
                        未完了に戻す
                      </span>
                    </span>
                  </label>
                  <button
                    type="button"
                    class="view-todo w-full p-4 text-left text-gray-600 focus:outline-none focus:box-shadow line-through"
                  >
                    {{ todo.comment }}
                  </button>
                  <span class="p-4 text-gray-500" @click="removeTodo(todo)">
                    <svg
                      class="fill-current w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"
                      />
                    </svg>
                  </span>
                </div>
              </li>
            </transition-group>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import TheNav from '~/components/TheNav'

export default {
  middleware: ['checkAuth'],
  // v-todo-focusカスタムディレクティブ
  directives: {
    'todo-focus'(el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  components: {
    TheNav
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
      searchWord: '',
      // エラーメッセージ
      errorMessage: null
    }
  },
  computed: {
    isCompleteList() {
      if (this.completeList.length) {
        return true
      } else {
        return false
      }
    },
    filterKeyWord() {
      if (this.searchWord === '') return
      const searchList = this.todos.filter((todo) => {
        // eslint-disable-next-line
        return todo.comment.indexOf(this.searchWord) !== -1
      })
      return searchList
    },
    searchListMode() {
      if (this.searchWord === '') return false
      if (this.searchWord) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.$firestore
      .collection('todos')
      .where('state', '==', false)
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
    this.$firestore
      .collection('todos')
      .where('state', '==', true)
      .orderBy('createdAt', 'desc')
      .onSnapshot((roomsSnapShot) => {
        this.completeList = []
        roomsSnapShot.forEach((doc) => {
          this.completeList.push({
            id: doc.id,
            ...doc.data()
          })
        })
      })
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
    // 完了済みへ移動
    async completeTodo(todo) {
      try {
        const res = this.$firestore.collection('todos').doc(todo.id)
        await res.update({
          state: true
        })
      } catch (e) {
        alert(e)
      }
    },
    // ToDoリストに戻す
    async cancelTodo(todo) {
      try {
        const res = this.$firestore.collection('todos').doc(todo.id)
        await res.update({
          state: false
        })
      } catch (e) {
        alert(e)
      }
    },
    // 完了済みの開閉
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
.tooltip .tooltip-text {
  opacity: 0;
  visibility: hidden;
  text-align: center;
  padding: 2px 6px;
  position: absolute;
  top: 15px;
  left: -2px;
  display: block;
  width: 9em;
  z-index: 100;
  transition: visibility 0.3s ease-out, opacity 0.3s ease-in-out;
  filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.2));
}
.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
.tooltip:hover .tooltip-text::before {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 20%;
  width: 0;
  height: 0;
  margin-left: -10px;
  border: 10px solid transparent;
  border-top-color: #e53e3e;
}
</style>
