import Vue from 'vue'
import Vuex from 'vuex'
import tabbar from './modules/tabbar.js'
import user from './modules/user.js'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		tabbar,
		user
	},
	getters
})

export default store
