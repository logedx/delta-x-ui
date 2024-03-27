export type ReadFileResult = WechatMiniprogram.ReadFileSuccessCallbackResult['data']

export type ReadFile = {
	size: number
	ext: string
	data: Promise<ReadFileResult>
}

export function to_ext(v: string): string {
	let path = v.split('.')

	return path[path.length - 1]

}


export function read_file_with_wx_api(path: string): Promise<ReadFileResult> {
	let fs = wx.getFileSystemManager()

	return new Promise<ReadFileResult>(
		(resolve, reject) => {
			fs.readFile(
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					filePath: path,

					success(res): void {
						if (res.errMsg === 'readFile:ok') {
							resolve(res.data)

						}

						else {
							reject(
								new Error(res.errMsg),

							)

						}


					},
				},
			)

		},

	)


}


export async function choose_image_with_wx_api(quantity = 1): Promise<ReadFile[]> {
	let files = await wx.chooseImage({ count: quantity })

	let read = [] as Array<ReadFile>

	for (let v of files.tempFiles) {
		let ext = to_ext(v.path)

		let data = read_file_with_wx_api(v.path)

		read.push(
			{ size: v.size, ext, data },

		)

	}

	return read

}



