<script>
	export default {
		onLaunch: function() {
			// 登录
			// uni.login({
			// 	success: res => {
			// 		// 发送 res.code 到后台换取 openId, sessionKey, unionId
			// 		this.$u.api.login(res.code).then(userId => {
			// 			this.$store.commit('SET_USER_ID', userId)
			// 		})
			// 	}
			// })
			wx.cloud.init({
				// env 参数说明：
				//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
				//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
				//   如不填则使用默认环境（第一个创建的环境）
				// env: 'my-env-id',
				traceUser: true,
			})
			wx.cloud.callFunction({
				// 云函数名称
				name: 'login',
				// 传给云函数的参数
				data: {},
			}).then(res => {
				this.$store.commit('SET_OPEN_ID', res.result.openid)
			})
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
