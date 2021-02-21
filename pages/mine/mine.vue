<template>
	<view class="app-container">
		<!-- <view>
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
				<view class="u-m-r-10">
					<u-avatar :src="pic" size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">你是韭菜</view>
					<view class="u-font-14 u-tips-color">微信号:jiucaishini</view>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="scan" color="#969799" size="28"></u-icon>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="rmb-circle" title="支付"></u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="star" title="收藏"></u-cell-item>
					<u-cell-item icon="photo" title="相册"></u-cell-item>
					<u-cell-item icon="coupon" title="卡券"></u-cell-item>
					<u-cell-item icon="heart" title="关注"></u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="setting" title="设置"></u-cell-item>
				</u-cell-group>
			</view>
		</view> -->
		<view class="mine-box">
			<view class="income">
				<u-card :title="'我的收益'">
					<view class="" slot="body">
						<u-row>
							<u-col span="12">
								总金额
							</u-col>
						</u-row>
						<u-row>
							<u-col span="12" class="u-font-19" style="font-weight: 900;">
								{{allCost}}
							</u-col>
						</u-row>
						<u-gap height="40"></u-gap>
						<u-row gutter="16">
							<u-col span="6">
								持有收益
							</u-col>
							<u-col span="6">
								日收益
							</u-col>
						</u-row>

						<u-row gutter="16">
							<u-col span="6" class="u-font-16" style="font-weight: 900;" :class="allCostGains[1] >= 0 ? 'up' : 'down'">
								{{allCostGains[1]}}%
							</u-col>
							<u-col span="6" class="u-font-16" style="font-weight: 900;" :class="allGains[1] >= 0 ? 'up' : 'down'">
								{{allGains[1]}}%
							</u-col>
						</u-row>

						<u-row gutter="16">
							<u-col span="6" class="u-font-16" style="font-weight: 900;" :class="allCostGains[0] >= 0 ? 'up' : 'down'">
								{{allCostGains[0]}}
							</u-col>
							<u-col span="6" class="u-font-16" style="font-weight: 900;" :class="allGains[0] >= 0 ? 'up' : 'down'">
								{{allGains[0]}}
							</u-col>
						</u-row>

					</view>
				</u-card>
			</view>
		<!-- 	<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="setting" title="设置"></u-cell-item>
				</u-cell-group>
			</view> -->
			<u-button open-type="contact" :hair-line="'false'">联系客服</u-button>
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
				userFundList: [],
				userFundData: []
			}
		},
		computed: {
			...mapGetters(['tabbarList']),
			// 日收益
			allGains() {
				let allGains = 0;
				let allNum = 0;
				this.userFundData.forEach((val) => {
					allGains += parseFloat(val.gains);
					allNum += parseFloat(val.amount);
				});
				allGains = allGains.toFixed(2);
				let allGainsRate = ((allGains * 100) / allNum).toFixed(2);
				return [allGains, allGainsRate];
			},
			// 持有收益
			allCostGains() {
				let allCostGains = 0;
				let allNum = 0;
				this.userFundData.forEach((val) => {
					allCostGains += parseFloat(val.costGains);
					allNum += parseFloat(val.amount);
				});
				allCostGains = allCostGains.toFixed(2);
				let allCostGainsRate = ((allCostGains * 100) / allNum).toFixed(2);
				return [allCostGains, allCostGainsRate];
			},
			// 总金额
			allCost(){
				let allCost = 0;
				this.userFundData.forEach((val) => {
					allCost += parseFloat(val.amount);
				});
				allCost = allCost.toFixed(2);
				return allCost;
			}
		},
		onShow() {
			this.getFundData()
		},
		onPullDownRefresh() {
			this.getFundData()
			uni.stopPullDownRefresh();
		},
		methods: {
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
					uni.hideLoading()
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
					.catch((error) => {uni.hideLoading()});

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
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.up {
		color: $u-type-error;
		font-weight: bold;
	}

	.down {
		color: $u-type-success;
		font-weight: bold;
	}
</style>
