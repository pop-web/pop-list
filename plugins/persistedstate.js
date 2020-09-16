import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
const ls = new SecureLS({ encodingType: 'aes' })

export default ({ store }) => {
  createPersistedState({
    // localStorageに保存したいstoreを入れます。
    // 認証情報をlocalStorageに含めるため、暗号化したうえで格納する
    paths: ['user'],
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key)
    }
  })(store)
}
