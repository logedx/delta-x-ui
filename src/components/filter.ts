export declare namespace DxFilter {
	export type Properties<T = unknown> = {
		value: Array<
			{
				key: string
				label: string
				option: Array<
					{ label: string, value: T }

				>
			}

		>

	}

	export type Event = {
		filter: { value: Properties['value'] }

	}

}


Component({
	properties: {
		value: { type: Array, value: [] },
	},

	methods: {
		onFilterOption(
			e: WechatMiniprogram.BaseEvent<{}, { path: [number, number] }>,

		) {
			let { value } = this.data as DxFilter.Properties
			let [index, index_] = e.currentTarget.dataset.path

			value[index]['option'].splice(index_, 1)


			if (value[index]['option']['length'] < 1) {
				value.splice(index, 1)

			}

			this.setData({ value })
			this.triggerEvent('filter', { value })

		},
	},

})