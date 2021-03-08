import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// import { Loading } from 'quasar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    destination: [],
    ports: [],
    routeJsonPorts: './data/ports.json',
    routeJsonDestinations: './data/shorex.json',
    destinationFilter: []
  },
  mutations: {

    setPorts (state, payload) {
      payload.map(({ label, value }) => {
        const index = state.ports.findIndex((element) => element.label === label)
        if (index >= 0) { state.ports[index].value.push(value) } else { state.ports.push({ label, value: [value] }) }
      })
    },

    setDestinations (state, payload) {
      state.destination = payload
    },

    updateDestinationFilter (state, payload) {
      state.destinationFilter = payload
    }

  },
  actions: {

    async actionSetsData ({ commit, state }, object) {
      const { data } = await axios.get(object.route)
      const result = data.map(obj => {
        if (object.ports) { var { code: value, destination: label } = obj } else { var { port: { code }, title, imagePath } = obj }
        return (object.ports ? { value, label } : { code, title, imagePath })
      })
      commit(object.mutation, result)
    },

    filterData ({ commit, state }, { value: code }) {
      var hash = {}
      commit('updateDestinationFilter', state.destination.filter(row => {
        var exists = !hash[row.title]
        hash[row.title] = true
        return (exists && code.indexOf(row.code) >= 0)
      }))
      // commit('updateDestinationFilter', state.destination.filter(row => code.indexOf(row.code) >= 0))
    }

  },
  modules: {
  }
})
