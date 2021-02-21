<template>
	<view class="u-p-30">
		<view class="title u-m-t-20 u-m-b-20 u-text-center">
			<u-tag :text="form.fundName" type="primary" />
		</view>
		<u-line />
		<u-form :model="form" ref="uForm" :rules="rules">
			<u-form-item label="份额" prop="fundNum">
				<u-input v-model="form.fundNum" type="number" placeholder="请输入份额" :focus="true" />
			</u-form-item>
			<u-form-item label="成本" prop="fundCost">
				<u-input v-model="form.fundCost" type="number" placeholder="请输入成本" />
			</u-form-item>
			<u-button type="primary" @click="submit">添加</u-button>
		</u-form>
	</view>
</template>

<script>
	export default {
		props: ["data"],
		data() {
			return {
				form: {
					fundCode: undefined,
					fundName: undefined,
					fundNum: '',
					fundCost: undefined
				},
				rules: {
					fundNum: [{
						min: 0,
						max: 999999999999.99,
						type: 'number',
						message: '请输入数字',
						trigger: ['change', 'blur']
					}],
					fundCost: [{
						min: 0,
						max: 999999999999.99,
						type: 'number',
						message: '请输入数字',
						trigger: ['change', 'blur']
					}]
				}
			}
		},
		mounted() {
			let data = JSON.parse(this.data)
			this.form.fundCode = data.fundCode
			this.form.fundName = data.fundName
			this.form.fundNum = data.fundNum ? data.fundNum : undefined
			this.form.fundCost = data.fundCost ? data.fundCost : undefined
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
						    title: '加载中'
						});
						wx.cloud.callFunction({
							// 云函数名称
							name: 'editUserFund',
							// 传给云函数的参数
							data: {
								form: this.form
							},
						}).then(res => {
							uni.hideLoading()
							this.$u.toast('操作成功');
							// this.$u.route('pages/index/index');
							uni.switchTab({
								url: '/pages/index/index'
							});
						})
					} else {
						this.$u.toast('输入项错误');
					}
				});
			}
		},
	}
</script>

<style>

</style>
