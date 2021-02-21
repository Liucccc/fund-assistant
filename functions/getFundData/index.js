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
	const wxContext = cloud.getWXContext()
	let url =
		"https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=200&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=" +
		wxContext.OPENDID +
		"&Fcodes=" +
		event.fundlist;
	const res = await request({
		method: 'GET',
		url: url,
	})

	return res
}
