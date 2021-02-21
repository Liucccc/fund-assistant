<template>
	<view>
		<view class="search-box">
			<u-search ref="search" placeholder="请输入代码，支持按名称或代码搜索" v-model="searchKeyword" shape="square" :clearabled="true"
			 :show-action="false" :margin="'15rpx'" :focus="true" @change="$u.debounce(search, 500)"></u-search>
		</view>
		<view class="search-result-box">
			<u-cell-group>
				<u-cell-item v-for="(item,index) in searchResult" :key="index" :title="item.label" :value="item.value" @click="handleCellClick(item)"></u-cell-item>
			</u-cell-group>
		</view>

		<u-tabbar :list="tabbarList" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				searchKeyword: '',
				// 搜索结果
				searchResult: [],
			}
		},
		computed: {
			...mapGetters(['tabbarList']),
		},
		onShow() {
			this.searchKeyword = ''
			this.searchResult = []
		},
		mounted() {
		},
		methods: {
			// 搜索
			search() {
				if (this.searchKeyword !== "") {
					// this.$u.api.fundSearch(this.searchKeyword).then((res) => {
					// 	let data = JSON.parse(res).Datas
					// 	this.searchResult = data
					// 		// .filter((val) => {
					// 		// 	let hasCode = this.userFundList.some((item, index, array) => {
					// 		// 		return item.code == val.CODE;
					// 		// 	});
					// 		// 	return !hasCode;
					// 		// })
					// 		.map((val) => {
					// 			return {
					// 				value: val.CODE,
					// 				label: val.NAME,
					// 			};
					// 		});
					// });
					uni.showLoading({
						title: '玩命搜索中'
					});
					wx.cloud.callFunction({
						// 云函数名称
						name: 'fundSearch',
						// 传给云函数的参数
						data: {
							keyword: this.searchKeyword
						},
					}).then(res => {
						let data = JSON.parse(res.result).Datas
						this.searchResult = data
							// .filter((val) => {
							// 	let hasCode = this.userFundList.some((item, index, array) => {
							// 		return item.code == val.CODE;
							// 	});
							// 	return !hasCode;
							// })
							.map((val) => {
								return {
									value: val.CODE,
									label: val.NAME,
								};
							});
						uni.hideLoading()
					})
				} else {
					this.searchResult = [];
				}
			},
			// 搜索结果点击
			handleCellClick(item) {
				const data = {
					fundCode: item.value,
					fundName: item.label
				}
				this.$u.route({
					url: 'pages/fundEdit/fundEdit',
					params: {
						data: JSON.stringify(data)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.search-result-box {
		height: 80vh;
		scroll: auto
	}
</style>
