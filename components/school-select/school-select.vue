<template>
	<view class="school-select-mask" v-if="show" @tap="close" @touchmove.stop.prevent>
		<view class="school-select-content" @tap.stop>
			<view class="header">
				<text class="title">选择学校</text>
				<view class="close-btn" @tap="close">
					<uni-icons type="closeempty" size="24" color="#333"></uni-icons>
				</view>
			</view>
			
			<view class="search-box">
				<uni-icons type="search" size="18" color="#999" class="search-icon"></uni-icons>
				<input 
					class="search-input" 
					type="text" 
					v-model="searchText" 
					placeholder="搜索学校名称" 
					placeholder-class="placeholder"
					confirm-type="search"
				/>
				<view class="clear-icon" v-if="searchText" @tap="searchText = ''">
					<uni-icons type="clear" size="18" color="#ccc"></uni-icons>
				</view>
			</view>
			
			<scroll-view scroll-y class="list-container">
				<view v-if="loading" class="state-container">
					<uni-icons type="spinner-cycle" size="24" class="loading-icon"></uni-icons>
					<text class="state-text">加载中...</text>
				</view>
				
				<view v-else-if="error" class="state-container">
					<uni-icons type="info" size="24" color="#ff5a5f"></uni-icons>
					<text class="state-text error-text">{{ errorMsg }}</text>
					<button class="retry-btn" size="mini" @tap="loadSchools">重试</button>
				</view>
				
				<view v-else-if="filteredSchools.length === 0" class="state-container">
					<text class="state-text">未找到相关学校</text>
				</view>
				
				<view 
					v-else 
					v-for="school in filteredSchools" 
					:key="school.id" 
					class="list-item" 
					:class="{ active: modelValue === school.id }"
					@tap="select(school)"
				>
					<text class="school-name">{{ school.name }}</text>
					<uni-icons v-if="modelValue === school.id" type="checkmarkempty" size="20" color="#007aff"></uni-icons>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import { getAllSchools } from '@/functions/school.js'

	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		},
		modelValue: {
			type: [Number, String],
			default: null
		}
	})

	const emit = defineEmits(['update:show', 'update:modelValue', 'change'])

	const schools = ref([])
	const searchText = ref('')
	const loading = ref(false)
	const error = ref(false)
	const errorMsg = ref('')

	const filteredSchools = computed(() => {
		if (!searchText.value) return schools.value
		const lowerText = searchText.value.toLowerCase()
		return schools.value.filter(s => s.name.toLowerCase().includes(lowerText))
	})

	const loadSchools = async () => {
		loading.value = true
		error.value = false
		errorMsg.value = ''
		try {
			schools.value = await getAllSchools()
		} catch (e) {
			console.error('Failed to load schools', e)
			error.value = true
			errorMsg.value = '加载失败，请检查网络或权限'
			if (e && e.status === 403) {
				errorMsg.value = '权限不足 (403)，无法获取学校列表'
			}
		} finally {
			loading.value = false
		}
	}

	const close = () => {
		emit('update:show', false)
	}

	const select = (school) => {
		emit('update:modelValue', school.id)
		emit('change', school)
		close()
	}

	// Watch for open to load data if empty
	watch(() => props.show, (newVal) => {
		if (newVal && schools.value.length === 0 && !loading.value) {
			loadSchools()
		}
	})
	
	// Initial load attempt if mounted (optional, maybe better to lazy load)
	// onMounted(() => {
	// 	loadSchools()
	// })
</script>

<style scoped>
	.school-select-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		/* Fade in animation could be added here */
	}

	.school-select-content {
		background-color: #ffffff;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		height: 70vh;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 20px;
		border-bottom: 1px solid #f0f0f0;
	}

	.title {
		font-size: 18px;
		font-weight: 600;
		color: #333;
	}
	
	.close-btn {
		padding: 4px;
	}

	.search-box {
		margin: 16px 20px;
		background-color: #f5f5f5;
		border-radius: 10px;
		height: 40px;
		display: flex;
		align-items: center;
		padding: 0 12px;
	}
	
	.search-icon {
		margin-right: 8px;
	}
	
	.search-input {
		flex: 1;
		font-size: 14px;
		color: #333;
	}
	
	.clear-icon {
		padding: 4px;
	}
	
	.placeholder {
		color: #999;
	}

	.list-container {
		flex: 1;
		height: 0; /* Important for flex child scroll-view */
	}

	.list-item {
		padding: 16px 20px;
		border-bottom: 1px solid #f8f8f8;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.list-item:active {
		background-color: #f9f9f9;
	}
	
	.list-item.active .school-name {
		color: #007aff;
		font-weight: 500;
	}
	
	.school-name {
		font-size: 16px;
		color: #333;
	}

	.state-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 60px;
	}
	
	.state-text {
		font-size: 14px;
		color: #999;
		margin-top: 10px;
	}
	
	.error-text {
		color: #ff5a5f;
		margin-bottom: 10px;
	}
	
	.retry-btn {
		margin-top: 10px;
	}
	
	.loading-icon {
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>