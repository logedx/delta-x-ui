// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace DxIndex {
	export type Properties = {
		value: string
		color: string
		more: boolean
	}

	export type Event = {
		move: void
		change: { value: string }

	}

}

let Position = [] as [number, number][]

Component({
	properties: {
		value: { type: String, value: '' },
		color: { type: String, value: '' },
		more: { type: Boolean, value: false },
	},

	data: {
		index: -1,
		index_: -1,
		zoom: false,
		alphabet: [
			'A', 'B', 'C', 'D', 'E', 'F', 'G',
			'H', 'I', 'J', 'K', 'L', 'M', 'N',
			'O', 'P', 'Q', 'R', 'S', 'T', 'U',
			'V', 'W', 'X', 'Y', 'Z', '#',
		],

	},

	observers: {
		value() {
			let { value, alphabet } = this.data

			let index = alphabet.indexOf(value)

			this.setData({ index })
		},

	},

	lifetimes: {
		ready() {
			let { alphabet } = this.data
			let query = this.createSelectorQuery()

			Position = []

			query.select('.letter')
				.boundingClientRect(
					res => {
						let height_ = res.height / alphabet.length

						for (let i = 0; i < alphabet.length; i++) {
							let early = Math.ceil(
								(i * height_) + res.top + 1,

							)

							let last = Math.ceil(
								(i * height_) + height_ + res.top,

							)

							Position.push([early, last])

						}
					},

				)
				.exec()
		},

	},

	methods: {
		onMoreTap() {
			this.triggerEvent('more')
		},

		onTouchStart(e: WechatMiniprogram.TouchEvent) {
			let [touch] = e.touches

			this.Slide(touch.clientY)
			this.setData({ zoom: true })
		},

		onTouchMove(e: WechatMiniprogram.TouchEvent) {
			let [touch] = e.touches

			this.Slide(touch.clientY)
		},

		onCatchTouchMove() {
			// 
		},

		onTouchEnd() {
			let { index, index_, alphabet } = this.data

			let value = alphabet[index]

			if (index === index_) {
				index = -1
				index_ = -1

				value = ''

			}

			this.setData(
				{ index, index_, zoom: false },

			)


			this.triggerEvent(
				'change', { value },

			)

		},


		Slide(y) {
			let index = 0

			for (let [early, last] of Position) {
				if (early < y && last < y) {
					index = index + 1
				}

				else {
					break
				}
			}

			index = Math.min(index, Position.length - 1)

			this.setData({ index })
		},

	},
})