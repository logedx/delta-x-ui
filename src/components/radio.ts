declare namespace DxRadio {
	export type Option = {
		id?: string
		_id?: string
		label: string
		value: string | number
		disabled: boolean
	}

	export type Properties = {
		value: string | number
		option: Array<string | number | Option>
		size: 'xs' | 'sm' | 'md' | 'lg'
		color: 'primary' | 'light-primary' | 'dark-primary' | 'info' | 'success' | 'warning' | 'error' | 'disabled'
	}

	export type Data = Properties

	export namespace Event {
		export type input = {
			value: string | number,
			index: number

		}

	}

}

Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		value: { type: String, value: '' },
		option: { type: Array, value: [] },

		size: { type: String, value: 'sm' },
		color: { type: String, value: '' },
		required: { type: Boolean, value: false },
	},

	created() {
		let { value, required } = this.data

		if (required && value === '') {
			this.Checked(0)

		}

	},

	methods: {
		IsOption(v: unknown): v is DxRadio.Option {
			if (!v || typeof v !== 'object') {
				return false

			}


			let label = 'label' in v && typeof v.label === 'string'
			let value = 'value' in v && typeof v.value === 'string'
			let disabled = 'disabled' in v && typeof v.disabled === 'boolean'

			return label && value && disabled



		},

		Checked(index: number) {
			let { option } = this.data as DxRadio.Data

			let value = option[index]

			if (this.IsOption(value) && value.disabled) {
				this.setData({ value: value.value })
				this.triggerEvent('input', { index, value: value.value })

			}

			else if (value !== undefined) {
				this.setData({ value })
				this.triggerEvent('input', { index, value })

			}


		},

		onChecked(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { index } = e.currentTarget.dataset

			this.Checked(index)

		},

	},


})