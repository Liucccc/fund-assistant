// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	let login = (code) =>
		vm.$u.get("/wx/user/wx7dff4cdb9a86f303/login?code=" + code,
			code
		);

	// 获得用户自选基金
	let getUserFund = () =>
		vm.$u.get("userFund/getUserFund");

	// 编辑用户自选基金
	let editUserFund = (userFund = {}) =>
		vm.$u.post("userFund/editUserFund",
			userFund
		);

	// 删除用户自选基金
	let delUserFund = (fundCode = "") =>
		vm.$u.delete("userFund/delUserFund/" + fundCode, );

	// 获取指数数据
	let getIndFundData = (seciList = []) =>
		vm.$u.post("fund/getIndFundData",
			seciList
		);

	// 获得自选基金数据
	let getFundData = (codeList = []) =>
		vm.$u.post("fund/getFundData",
			codeList
		);

	let fundSearch = (keyword) =>
		vm.$u.get("fund/fundSearch/" + keyword,
			keyword
		);



	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		login,
		getUserFund,
		editUserFund,
		delUserFund,
		getIndFundData,
		getFundData,
		fundSearch
	};
}

export default {
	install
}
