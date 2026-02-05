<template>
	<view class="tabbar">
		<view class="tab-item" :class="{ active: currentTab === 'schedule' }" @tap="selectTab('schedule')">
			<text class="tab-text">课表</text>
		</view>
		<view class="tab-item" :class="{ active: currentTab === 'mine' }" @tap="selectTab('mine')">
			<text class="tab-text">我的</text>
		</view>
	</view>
</template>

<script setup>
	import { createTabbarHandlers } from '@/functions/custom-tabbar.js'
	/**
	 * custom-tabbar 自定义菜单栏
	 * @property {String} currentTab 当前选中的tab标识
	 */
	const props = defineProps({
		currentTab: String
	})

	const { selectTab } = createTabbarHandlers({ props })
</script>

<style scoped>
	.tabbar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 56px;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #f1f3f8;
		border-top: 0.5px solid rgba(0, 0, 0, 0.08);
		z-index: 999;
	}

	.tab-item {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-text {
		font-size: 17px;
		color: #8e92a3;
		font-weight: 400;
		transition: all 0.2s;
	}

	.tab-item.active .tab-text {
		color: #1d2130;
		font-size: 18px;
		font-weight: 700;
	}
</style>
