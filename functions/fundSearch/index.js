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
	let url = "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?&m=9&key=" +
		event.keyword +
		"&_=" +
		new Date().getTime();
	const res = await request({
		method: 'GET',
		url: encodeURI(url),
	})

	return res
}
