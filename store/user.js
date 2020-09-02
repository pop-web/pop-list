export const state = () => ({
  user: {}
})

export const getters = {
  userInfo: (state) => state.user
}

export const actions = {
  setInfo({ commit }, user) {
    commit('setUser', user)
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}
