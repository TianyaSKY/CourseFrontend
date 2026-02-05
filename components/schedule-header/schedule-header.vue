<template>
	<view class="header-container">
		<!-- Status Bar Placeholder -->
		<view class="status-bar"></view>
		
		<view class="header">
			<view class="date-block">
				<text class="date">{{ currentDate }}</text>
				<view class="timetable-info">
					<block v-if="timetable">
						<text class="week-status" v-if="currentWeek > 0">
							第 {{ currentWeek }} 周 {{ timetable.name || '' }}
						</text>
						<text class="week-status" v-else>
							假期中 {{ timetable.name || '' }}
						</text>
					</block>
					<text class="week-status" v-else>未设置课表</text>
				</view>
			</view>
			<view class="header-tools">
				<view class="header-tool" @tap="handleToolClick('add')">
					<uni-icons type="plus" size="26" color="#1d2130"></uni-icons>
				</view>
				<view class="header-tool" @tap="handleToolClick('import')">
					<uni-icons type="download" size="24" color="#1d2130"></uni-icons>
				</view>
				<view class="header-tool" @tap="handleToolClick('share')">
					<uni-icons type="redo" size="24" color="#1d2130"></uni-icons>
				</view>
				<view class="header-tool" @tap="handleToolClick('more')">
					<uni-icons type="more-filled" size="24" color="#1d2130"></uni-icons>
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
		},
		currentViewDate: {
			type: String,
			default: ''
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
	
	const currentWeek = computed(() => {
		if (!props.timetable?.termStartDate) return 1
		
		const termStart = new Date(props.timetable.termStartDate)
		if (isNaN(termStart.getTime())) return 1
		
		// 1. Find the Monday of the term start week
		// getDay(): 0 is Sunday, 1 is Monday...
		// We want 1 (Mon) to be the start. 
		// If Sun (0), treat as 7.
		const day = termStart.getDay()
		const diffToMonday = day === 0 ? 6 : day - 1
		const termMonday = new Date(termStart)
		termMonday.setDate(termStart.getDate() - diffToMonday)
		termMonday.setHours(0, 0, 0, 0)
		
		// 2. Find "current" date (either today or the one user is viewing)
		const targetDate = props.currentViewDate ? new Date(props.currentViewDate) : new Date()
		if (isNaN(targetDate.getTime())) return 1
		targetDate.setHours(0, 0, 0, 0)
		
		// 3. Calculate difference in weeks
		const diffTime = targetDate.getTime() - termMonday.getTime()
		const week = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1
		
		return week
	})
</script>

<style scoped>
	.header-container {
		background-color: transparent;
		padding-bottom: 10px;
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
		padding: 10px 20px;
	}

	.date-block {
		display: flex;
		flex-direction: column;
	}

	.date {
		font-size: 28px;
		font-weight: 500;
		color: #1d2130;
		line-height: 1.2;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.timetable-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 4px;
	}

	.week-status {
		font-size: 15px;
		color: #4a4d5e;
		font-weight: 400;
	}

	.header-tools {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16px;
		padding-top: 8px;
	}

	.header-tool {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.8;
	}
	
	.header-tool:active {
		opacity: 0.5;
	}
</style>
