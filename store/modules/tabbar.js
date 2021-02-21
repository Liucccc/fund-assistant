const state = {
	list: [{
			iconPath: "home",
			selectedIconPath: "home-fill",
			text: '首页',
			// count: 2,
			isDot: true,
			customIcon: false,
			pagePath: '/pages/index/index',
		},
		{
			iconPath: "https://cdn.uviewui.com/uview/common/min_button.png",
			selectedIconPath: "https://cdn.uviewui.com/uview/common/min_button_select.png",
			text: '添加',
			midButton: true,
			customIcon: false,
			pagePath: '/pages/search/search',
		},
		{
			iconPath: "account",
			selectedIconPath: "account-fill",
			text: '我的',
			isDot: false,
			customIcon: false,
			pagePath: '/pages/mine/mine',
		},
	],
}

export default {
	namespaced: true,
	state,
}
