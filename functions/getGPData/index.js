// 云函数入口文件
const cloud = require('wx-server-sdk')
// npm install request-promise
const request = require('request-promise');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
	traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
	let url =
		"https://push2.eastmoney.com/api/qt/ulist.np/get?fields=f1,f2,f3,f4,f12,f13,f14,f292&fltt=2&secids=" +
		event.secids +
		"&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=";
	const res = await request({
		method: 'GET',
		url: url,
	})

	return res
}
