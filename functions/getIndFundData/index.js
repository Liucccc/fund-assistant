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
	const res = await request({
		method: 'GET',
		url: 'https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f13,f14&secids=' +
			event.seciListStr +
			"&_=" + new Date().getTime(),
	})

	return res
}
