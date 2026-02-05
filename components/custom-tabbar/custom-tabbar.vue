<template>
	<view class="tabbar">
		<view class="tab-item" :class="{ active: currentTab === 'schedule' }" @tap="selectTab('schedule')">
			<text class="tab-text">课表</text>
			<view class="active-indicator" v-if="currentTab === 'schedule'"></view>
		</view>
		<view class="tab-item" :class="{ active: currentTab === 'mine' }" @tap="selectTab('mine')">
			<text class="tab-text">我的</text>
			<view class="active-indicator" v-if="currentTab === 'mine'"></view>
		</view>
	</view>
</template>

<script setup>
	import { createTabbarHandlers } from '@/functions/custom-tabbar.js'
	
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
		background-color: #dae4f5; /* Match page background */
		/* border-top: 0.5px solid rgba(0, 0, 0, 0.08); */ /* Removed border for cleaner look */
		z-index: 999;
	}

	.tab-item {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.tab-text {
		font-size: 16px;
		color: #8e92a3;
		font-weight: 500;
		transition: all 0.2s;
	}

	.tab-item.active .tab-text {
		color: #1d2130;
		font-size: 18px;
		font-weight: 600;
	}
	
	.active-indicator {
		position: absolute;
		bottom: 8px;
		width: 24px;
		height: 3px;
		background-color: #1d2130;
		border-radius: 2px;
	}
</style>
