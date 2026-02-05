export const onTool = (type) => {
	let label = ''
	if (type == 'add') {
		uni.navigateTo({
			url: '/pages/schedule/timetable-edit'
		})
		return
	} else if (type == 'import') {
		label = '导入课表'
	} else if (type == 'share') {
		label = '分享'
	} else if (type == 'more') {
		uni.navigateTo({
			url: '/pages/schedule/timetable-manage'
		})
		return
	} else {
		label = '其它'
	}
	uni.showToast({
		title: label + '（待实现）',
		icon: 'none'
	})
}
