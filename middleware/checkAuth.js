export default async function({ redirect, app }) {
  if (!(await app.$auth())) {
    // ログインしていなければログイン画面へ遷移
    redirect('/login')
  }
}
