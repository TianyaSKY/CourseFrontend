import { BASE_URL } from '@/config.js'

export const createEditProfileHandlers = ({
	form,
	schoolList,
	selectedSchoolIndex,
	latStr,
	lngStr,
	loading
}) => {
	const fetchSchoolList = () => {
		const token = uni.getStorageSync('token')
		uni.request({
			url: `${BASE_URL}/api/schools`,
			method: 'GET',
			header: {
				Authorization: `Bearer ${token}`
			},
			success: (res) => {
				if (res.statusCode == 200) {
					schoolList.value = res.data || []
				}
			},
			fail: () => {
				uni.showToast({
					title: '获取学校列表失败',
					icon: 'none'
				})
			}
		})
	}

	const fetchUserInfo = () => {
		const token = uni.getStorageSync('token')
		uni.request({
			url: `${BASE_URL}/api/users/current`,
			method: 'GET',
			header: {
				Authorization: `Bearer ${token}`
			},
			success: (res) => {
				if (res.statusCode == 200) {
					const data = res.data
					form.username = data.username
					form.studentId = data.studentId != null ? data.studentId : ''
					const sId = data.schoolId
					if (sId != null) {
						form.schoolId = sId
						const index = schoolList.value.findIndex((school) => school.id === sId)
						if (index >= 0) {
							selectedSchoolIndex.value = index
						}
					}

					const lat = data.homeLocationLat
					if (lat != null) {
						form.homeLocationLat = lat
						latStr.value = lat.toString()
					}

					const lng = data.homeLocationLng
					if (lng != null) {
						form.homeLocationLng = lng
						lngStr.value = lng.toString()
					}
				}
			}
		})
	}

	const initEditProfile = () => {
		const token = uni.getStorageSync('token')
		if (token && token.length > 0) {
			fetchSchoolList()
			setTimeout(() => {
				fetchUserInfo()
			}, 300)
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		}
	}

	const handleSchoolChange = (e) => {
		selectedSchoolIndex.value = e.detail.value
		form.schoolId = schoolList.value[e.detail.value].id
	}

	const handleBack = () => {
		console.log('handleBack called')
		uni.navigateBack()
	}

	const handleSave = () => {
		loading.value = true

		const latNum = parseFloat(latStr.value)
		const lngNum = parseFloat(lngStr.value)

		form.homeLocationLat = isNaN(latNum) ? 0.0 : latNum
		form.homeLocationLng = isNaN(lngNum) ? 0.0 : lngNum

		const updateData = {
			username: form.username,
			studentId: form.studentId,
			schoolId: form.schoolId,
			homeLocationLat: form.homeLocationLat,
			homeLocationLng: form.homeLocationLng
		}

		if (form.password.length > 0) {
			updateData.password = form.password
		}

		const token = uni.getStorageSync('token')
		uni.request({
			url: `${BASE_URL}/api/users/current`,
			method: 'PUT',
			header: {
				Authorization: `Bearer ${token}`
			},
			data: updateData,
			success: (res) => {
				if (res.statusCode == 200) {
					uni.showToast({
						title: '修改成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				} else {
					uni.showToast({
						title: '修改失败',
						icon: 'none'
					})
				}
			},
			fail: () => {
				uni.showToast({
					title: '网络请求失败',
					icon: 'none'
				})
			},
			complete: () => {
				loading.value = false
			}
		})
	}

	return {
		fetchSchoolList,
		fetchUserInfo,
		initEditProfile,
		handleSchoolChange,
		handleBack,
		handleSave
	}
}
