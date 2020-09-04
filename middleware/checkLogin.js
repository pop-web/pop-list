export default async function({ redirect, app }) {
  const res = await app.$auth()
  if (res) {
    const user = {
      displayName: res.displayName,
      uid: res.uid,
      photoURL: res.photoURL
    }
    // ユーザ情報をストアにセット
    self.$nuxt.$store.dispatch('user/setInfo', user)
    // ログイン中だったらTOPページに遷移する
    redirect('/')
  }
}
