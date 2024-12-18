import * as fs from '../../src/lib/fs.js'
import * as color from '../../src/style/color.js'

Component(
	{
		data: {
			white(src: string): string {
				return fs.read_svg(src, color.white)

			},

		},


	},

)