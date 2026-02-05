export const createTabbarHandlers = ({ props }) => {
	const selectTab = (tab) => {
		if (props.currentTab === tab) return

		let url = ''
		if (tab === 'schedule') {
			url = '/pages/schedule/schedule'
		} else if (tab === 'mine') {
			url = '/pages/mine/mine'
		}

		if (url != '') {
			uni.reLaunch({
				url: url
			})
		}
	}

	return { selectTab }
}
