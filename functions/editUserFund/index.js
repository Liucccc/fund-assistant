// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	let {
		fundCode,
		fundNum,
		fundCost
	} = event.form
	try {
		let data = await db.collection('userFund')
			.where({
				_openid: wxContext.OPENID,
				fundCode: fundCode
			}).get()

		if (data && data.data.length > 0) {
			return await db.collection('userFund')
				.where({
					_openid: wxContext.OPENID,
					fundCode: fundCode
				})
				.update({
					data: {
						fundCode,
						fundNum: fundNum || 0,
						fundCost: fundCost || 0
					}
				});
		}

		return await db.collection('userFund')
			.add({
				data: {
					_openid: wxContext.OPENID,
					fundCode,
					fundNum: fundNum || 0,
					fundCost: fundCost || 0
				}
			});
	} catch (e) {
		console.error(e);
	}
}
