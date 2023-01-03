Component({
	data: {
		style: '',
	},

	externalClasses: ['class'],

	methods: {
		onCatchTap() {
			// 
		},
		onCatchTouchMove() {
			// 
		},

		onOverlayTap() {
			this.triggerEvent('close')
		},
	},
})