<template>
	<view class="app-container">
		<view>
			<view class="search-box">
				<u-search placeholder="请输入代码，支持按名称或代码搜索" v-model="searchKeyword" shape="square" :clearabled="true" :show-action="false"
				 :margin="'15rpx'" :disabled="true" @click="handleSearchClick"></u-search>
			</view>
			<!-- 指数信息 -->
			<scroll-view scroll-x="true"  style="width: 100%;overflow:hidden;white-space:nowrap;">
				<view class="index-data-box">
					<view class="item u-border u-p-10" v-for="(el,index) in indFundData" :key="index">
						<view class="title u-text-center">
							{{el.f14}}
						</view>
						<!-- 指数 -->
						<view class="zhi-shu u-text-center" :class="el.f3 >= 0 ? 'up' : 'down'">
							{{el.f2}}
						</view>
						<view class="zhang-die u-flex u-text-center" :class="el.f3 >= 0 ? 'up' : 'down'">
							<!-- 涨跌额 -->
							<view class="zhang-die-e u-m-r-30 u-font-12">
								{{el.f4}}
							</view>
							<!-- 涨跌幅 -->
							<view class="zhang-die-fu u-font-12">
								{{el.f3}}%
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 自选基金 -->
			<view class="u-p-t-80" v-if="userFundData.length == 0">
				<u-empty text="暂无数据" mode="list"></u-empty>
			</view>
			<view class="fund-list-box">
				<u-swipe-action :show="item.show" :index="item.fundCode" v-for="(item, index) in userFundData" :key="item.fundCode"
				 @click="swipeClick()" @open="swipeOpen" :options="swipeOptions">
					<u-card :title-size="25" :title="item.name+'('+item.fundCode+')'" :sub-title="item.hasReplace ? item.gztime.substr(5, 5) : item.gztime.substr(5)"
					 padding="10" @click="handleUserFundClick(item.fundCode)">
						<view class="" slot="body">
							<view class="u-body-item u-font-12 u-flex u-border-bottom u-col-between  u-p-t-0">
								<view class="fund-name u-flex-2">
									份额/金额
								</view>
								<view class="u-flex-1">
									持有收益
								</view>
								<view class="u-flex-1 u-text-right">
									估算收益
								</view>
							</view>
							<view class="u-body-item u-flex u-m-t-20 u-col-between u-p-t-0">
								<!-- 持有份额 -->
								<view class="fund-name  u-flex-2">
									{{item.num}}
								</view>
								<!-- 持有收益百分比 -->
								<view class="u-flex-1 " :class="item.costGainsRate >= 0 ? 'up' : 'down'">
									{{item.costGainsRate}}%
								</view>
								<!-- 估算收益百分比 -->
								<view class="u-flex-1 u-text-right" :class="item.gszzl >= 0 ? 'up' : 'down'">
									{{item.gszzl}}%
								</view>
							</view>
							<view class="u-body-item u-flex u-m-t-10 u-col-between u-p-t-0">
								<!-- 持有金额 -->
								<view class="fund-name  u-flex-2 ">
									{{item.amount}}
								</view>
								<!-- 持有收益金额 -->
								<view class="u-flex-1 " :class="item.costGains >= 0 ? 'up' : 'down'">
									{{item.costGains}}
								</view>
								<!-- 估算收益金额 -->
								<view class="u-flex-1 u-text-right" :class="item.gains >= 0 ? 'up' : 'down'">
									{{item.gains}}
								</view>
							</view>
						</view>
					</u-card>
				</u-swipe-action>
			</view>
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
				// 搜索关键字1
				searchKeyword: '',
				// 指数数据
				indFundData: [],
				// 默认显示的指数
				seciList: ["1.000001", "1.000300", "0.399001", "1.000688", "0.399006", "0.399005", "100.HSI", "100.DJIA", "100.NDX",
					"100.SPX"
				],
				// 所有的指数
				allSeciList: [{
						value: "1.000001",
						label: "上证指数",
					},
					{
						value: "1.000300",
						label: "沪深300",
					},
					{
						value: "0.399001",
						label: "深证成指",
					},
					{
						value: "1.000688",
						label: "科创50",
					},
					{
						value: "0.399006",
						label: "创业板指",
					},
					{
						value: "0.399005",
						label: "中小板指",
					},
					{
						value: "100.HSI",
						label: "恒生指数",
					},
					{
						value: "100.DJIA",
						label: "道琼斯",
					},
					{
						value: "100.NDX",
						label: "纳斯达克",
					},
					{
						value: "100.SPX",
						label: "标普500",
					},
				],
				// 用户自选基金
				userFundList: [],
				// 用户自选基金数据
				userFundData: [],
				swipeOptions: [{
						text: '编辑',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		computed: {
			...mapGetters(['tabbarList', "openId"]),
		},
		mounted() {
			// this.refreshData()
		},
		onShow() {
			this.refreshData()
		},
		onPullDownRefresh() {
			this.refreshData()
			uni.stopPullDownRefresh();
		},
		methods: {
			// 刷新数据
			refreshData() {
				this.getIndFundData()
				this.getFundData()
			},
			// 搜索
			handleSearchClick(query) {
				console.log("handleSearchClick")
				this.$u.route({
					type: 'tab',
					url: 'pages/search/search'
				});
			},
			// 获得指数数据
			getIndFundData() {
				// this.$u.api.getIndFundData(this.seciList).then(res => {
				// 	this.indFundData = JSON.parse(res).data.diff;
				// });
				uni.showLoading({
					title: '加载中'
				});
				let seciListStr = this.seciList.join(",");
				wx.cloud.callFunction({
					// 云函数名称
					name: 'getIndFundData',
					// 传给云函数的参数
					data: {
						seciListStr
					},
				}).then(res => {
					// console.log(res)
					this.indFundData = JSON.parse(res.result).data.diff;
					uni.hideLoading();
				})
			},
			getUserFund() {
				// this.$u.api.getUserFund().then(data => {
				// 	this.userFundList = data
				// })
				uni.showLoading({
					title: '加载中'
				});
				wx.cloud.callFunction({
					// 云函数名称
					name: 'getUserFund',
					// 传给云函数的参数
					data: {

					},
				}).then(res => {
					console.log(res)
					// this.userFundList = data
					uni.hideLoading()
				})
			},
			// 获得自选基金数据
			async getFundData() {
				uni.showLoading({
					title: '加载中'
				});
				let userFundList = await wx.cloud.callFunction({
					// 云函数名称
					name: 'getUserFund',
					// 传给云函数的参数
					data: {},
				})
				if (!userFundList.result.data) {
					return
				}
				this.userFundList = userFundList.result.data
				let fundlist = this.userFundList.map((val) => val.fundCode).join(',');
				wx.cloud.callFunction({
						// 云函数名称
						name: 'getFundData',
						// 传给云函数的参数
						data: {
							fundlist
						},
					}).then((res) => {
						let data = JSON.parse(res.result).Datas;
						this.userFundData = [];
						let dataList = [];

						data.forEach((val) => {
							console.log(val)
							let data = {
								// 基金代码
								fundCode: val.FCODE,
								// 基金名称
								name: val.SHORTNAME,
								// 
								jzrq: val.PDATE,
								dwjz: isNaN(val.NAV) ? null : val.NAV,
								gsz: isNaN(val.GSZ) ? null : val.GSZ,
								gszzl: isNaN(val.GSZZL) ? 0 : val.GSZZL,
								gztime: val.GZTIME,
							};
							if (val.PDATE != "--" && val.PDATE == val.GZTIME.substr(0, 10)) {
								data.gsz = val.NAV;
								data.gszzl = isNaN(val.NAVCHGRT) ? 0 : val.NAVCHGRT;
								data.hasReplace = true;
							}

							let slt = this.userFundList.filter(
								(item) => item.fundCode == data.fundCode
							);
							data.num = slt[0].fundNum ? slt[0].fundNum : 0;
							data.cost = slt[0].fundCost ? slt[0].fundCost : 0;
							data.amount = this.calculateMoney(data);
							data.gains = this.calculate(data, data.hasReplace);
							data.costGains = this.calculateCost(data);
							data.costGainsRate = this.calculateCostRate(data);
							data.show = false
							dataList.push(data);
						});

						this.userFundData = dataList;
						uni.hideLoading()
					})
					.catch((error) => {});

			},
			// 计算持有金额
			calculateMoney(val) {
				let sum = (val.dwjz * val.num).toFixed(2);
				return sum;
			},
			calculate(val, hasReplace) {
				var sum = 0;
				let num = val.num ? val.num : 0;
				if (hasReplace) {
					sum = ((val.dwjz - val.dwjz / (1 + val.gszzl * 0.01)) * num).toFixed(2);
				} else {
					if (val.gsz) {
						sum = ((val.gsz - val.dwjz) * num).toFixed(2);
					}
				}
				return sum;
			},
			calculateCost(val) {
				if (val.cost) {
					let sum = ((val.dwjz - val.cost) * val.num).toFixed(2);
					return sum;
				} else {
					return 0;
				}
			},
			calculateCostRate(val) {
				if (val.cost && val.cost != 0) {
					let sum = (((val.dwjz - val.cost) / val.cost) * 100).toFixed(2);
					return sum;
				} else {
					return 0;
				}
			},
			swipeClick(fundCode, index) {
				switch (index) {
					case 0:
						const item = this.userFundData.find(e =>
							e.fundCode == fundCode
						)
						// 编辑
						const data = {
							fundCode: item.fundCode,
							fundName: item.name,
							fundNum: item.num,
							fundCost: item.cost
						}
						this.$u.route({
							url: 'pages/fundEdit/fundEdit',
							params: {
								data: JSON.stringify(data)
							}
						})
						break;
					case 1:
						// 删除
						this.delUserFund(fundCode)
						break
					default:
						break
				}
			},
			swipeOpen(fundCode) {
				this.userFundData.forEach((e, idx) => {
					if (e.fundCode === fundCode) {
						this.userFundData[idx].show = true
					} else {
						this.userFundData[idx].show = false;
					}
				})
			},
			delUserFund(fundCode) {
				if (fundCode) {
					uni.showLoading({
						title: '加载中'
					});
					wx.cloud.callFunction({
						// 云函数名称
						name: 'delUserFund',
						// 传给云函数的参数
						data: {
							fundCode
						},
					}).then(() => {
						uni.hideLoading()
						this.$u.toast("删除成功")
						this.userFundData.forEach((e, idx) => {
							if (e.fundCode === fundCode) {
								this.userFundData.splice(idx, 1)
							}
						})
					})
				}
			},
			// 基金点击查询详情
			handleUserFundClick(fundCode) {
				this.$u.route("pages/fundDetail/fundDetail", {
					fundCode
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-container {
		.search-box {}

		.index-data-box {
			width: 200%;
			display: flex;
			flex-wrap: nowrap;
			.item{
				width: 240rpx;
			}
		}

		.main-box {}

		.tab-bar-box {}

		.up {
			color: $u-type-error;
			font-weight: bold;
		}

		.down {
			color: $u-type-success;
			font-weight: bold;
		}
	}
</style>
