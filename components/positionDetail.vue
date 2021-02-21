<template>
	<view class="">
		<h5 class="u-text-center">
			<span v-if="expansion">截止日期：{{ expansion }}</span>
			<span v-else>暂无数据</span>
		</h5>
		<u-table>
			<u-tr>
				<u-th width="25%">股票名称（代码）</u-th>
				<u-th>价格</u-th>
				<u-th>涨跌幅</u-th>
				<u-th>持仓占比</u-th>
				<u-th>较上期</u-th>
			</u-tr>
			<u-tr v-for="(el, ind) in dataList" :key="el.GPDM">
				<u-td width="25%" class="gpcode" style="text-align: left;">
					{{ el.GPJC + "（" + el.GPDM + "）" }}
				</u-td>
				<u-td>{{ dataListGp[ind].f2.toFixed(2) }}</u-td>
				<u-td :class="dataListGp[ind].f3 >= 0 ? 'up' : 'down'" >
					{{ dataListGp[ind].f3.toFixed(2) }}%
				</u-td>
				<u-td>{{ parseFloat(el.JZBL).toFixed(2) }}%</u-td>
				<u-td>{{ compared(el) }}</u-td>
			</u-tr>
		</u-table>
	</view>
</template>

<script>
	export default {
		name: "positionDetail",
		props: ['fundCode'],
		data() {
			return {
				dataList: [],
				dataListGp: [],
				expansion: null,
				sltData: {}
			};
		},
		mounted() {
			console.log(this.fundCode)
			this.init();
		},
		methods: {
			init() {
				this.getData();
			},
			getData() {
				uni.showLoading({
					title: "玩命加载中"
				})
				wx.cloud.callFunction({
					// 云函数名称
					name: 'getPositionData',
					// 传给云函数的参数
					data: {
						fundCode: this.fundCode
					},
				}).then((res) => {
					res = JSON.parse(res.result)
					let dataList = res.Datas.fundStocks;
					if (dataList) {
						let gpList = dataList
							.map((val) => {
								return val.NEWTEXCH + "." + val.GPDM;
							})
							.join(",");

						wx.cloud.callFunction({
							// 云函数名称
							name: 'getGPData',
							// 传给云函数的参数
							data: {
								secids: gpList
							},
						}).then((resGp) => {
							console.log(resGp)
							resGp = JSON.parse(resGp.result)
							this.dataListGp = resGp.data.diff;
							this.dataList = dataList;
							this.expansion = res.Expansion;
						});

						uni.hideLoading()
					} else {
						uni.hideLoading()
					}
				});
			},

			compared(val) {
				if (val.PCTNVCHGTYPE == "新增") {
					return "新增";
				} else if (isNaN(val.PCTNVCHG)) {
					return 0;
				} else {
					let icon = val.PCTNVCHG > 0 ? "↑ " : "↓ ";
					return icon + Math.abs(parseFloat(val.PCTNVCHG)).toFixed(2) + "%";
				}
			},
		},
	}
</script>

<style scoped lang="scss">
	.up {
		color: #ff0000;
		font-weight: bold;
	}

	.down {
		color: $u-type-success;
		font-weight: bold;
	}
</style>
