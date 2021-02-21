<template>
	<view class="wrap">
		<view>
			<u-tabs-swiper ref="tabs" :list="tabsList" :current="current" @change="tabsChange" :is-scroll="true"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<!-- 持仓明细 -->
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height:100%;width: 100%;">
					<view class="page-box ">
						<position-detail :fundCode="fundCode"></position-detail>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 基金概况 -->
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="page-box">
						2
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 净值估算 -->
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="page-box">
						3
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 历史净值 -->
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="page-box">
						4
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 累计收益 -->
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="page-box">
						5
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>

</template>

<script>
	import positionDetail from '../../components/positionDetail.vue'
	export default {
		name: 'fundDetail',
		props: ['fundCode'],
		components: {
			positionDetail
		},
		data() {
			return {
				tabsList: [{
					name: '持仓明细'
				}, {
					name: '基金概况'
				}, {
					name: '净值估算',
				}, {
					name: '历史净值',
				}, {
					name: '累计收益',
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			}
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
</style>
