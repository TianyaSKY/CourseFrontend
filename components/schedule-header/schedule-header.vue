<template>
	<view class="header-container">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
		
		<view class="header">
			<view class="date-block">
				<text class="date">{{ currentDate }}</text>
				<view class="timetable-info">
					<text class="timetable-name">{{ timetable?.name || '未设置课表' }}</text>
					<text class="week-status" v-if="timetable">
						({{ timetable.academicYearStart }}-{{ timetable.academicYearEnd }} 第 {{ timetable.term }} 学期)
					</text>
				</view>
			</view>
			<view class="header-tools">
				<view class="header-tool" @tap="handleToolClick('add')">
					<uni-icons type="plus" size="22" color="#1d2130"></uni-icons>
				</view>
				<view class="header-tool" @tap="handleToolClick('import')">
					<uni-icons type="download" size="22" color="#1d2130"></uni-icons>
				</view>
				<view class="header-tool" @tap="handleToolClick('share')">
					<uni-icons type="redo" size="22" color="#1d2130"></uni-icons>
				</view>
				<view class="header-tool" @tap="handleToolClick('more')">
					<uni-icons type="more-filled" size="22" color="#1d2130"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed } from 'vue'
	import { onTool } from '@/functions/schedule-header.js'
	
	const props = defineProps({
		timetable: {
			type: Object,
			default: null
		}
	})

	const emit = defineEmits(['import', 'share'])

	const handleToolClick = (type) => {
		if (type === 'import') {
			emit('import')
		} else if (type === 'share') {
			emit('share')
		} else {
			onTool(type)
		}
	}

	const currentDate = computed(() => {
		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth() + 1
		const day = now.getDate()
		return `${year}/${month}/${day}`
	})
</script>

<style scoped>
	.header-container {
		background-color: transparent;
	}

	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding: 16px 20px;
	}

	.date-block {
		display: flex;
		flex-direction: column;
	}

	.date {
		font-size: 26px;
		font-weight: 700;
		color: #1d2130;
		line-height: 1.2;
	}

	.timetable-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 4px;
	}

	.timetable-name {
		font-size: 14px;
		color: #1d2130;
		font-weight: 600;
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.week-status {
		margin-left: 6px;
		font-size: 12px;
		color: #8e92a3;
		font-weight: 400;
	}

	.header-tools {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 4px;
		background-color: rgba(255, 255, 255, 0.5);
		padding: 4px 8px;
		border-radius: 20px;
	}

	.header-tool {
		margin-left: 12px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		background-color: #fff;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	}
	
	.header-tool:first-child {
		margin-left: 0;
	}
	
	.header-tool:active {
		transform: scale(0.95);
		box-shadow: 0 1px 2px rgba(0,0,0,0.05);
	}
</style>
