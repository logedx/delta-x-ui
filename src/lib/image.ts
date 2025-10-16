import * as fs from './fs.js'




export type Pixel = {
	r: number
	g: number
	b: number
	a: number

}


export function pick (buffer: Uint8ClampedArray, index: number): Pixel
{
	let i = Math.max(0, Math.min(buffer.length - 4, index * 4) )

	let r = buffer[i] ?? 0
	let g = buffer[i + 1] ?? 0
	let b = buffer[i + 2] ?? 0
	let a = buffer[i + 3] ?? 0

	return { r, g, b, a }

}


export function grayscale (pixel: Pixel): number
{
	return 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b

}


export function high_frequency_energy (image: ImageData): number
{
	let count = 0
	let energy = 0

	for (let y = 0; y < image.height - 1; y++)
	{
		for (let x = 0; x < image.width - 1; x++)
		{
			let current = pick(image.data, y * image.width + x)
			let right = pick(image.data, y * image.width + (x + 1) )
			let bottom = pick(image.data, (y + 1) * image.width + x)

			let gray = {
				current: grayscale(current),
				right  : grayscale(right),
				bottom : grayscale(bottom),

			}

			// 计算水平和垂直梯度
			let dx = Math.abs(gray.right - gray.current)
			let dy = Math.abs(gray.bottom - gray.current)

			energy = energy + (dx + dy)

			count = count + 1

		}

	}

	return count > 0 ? energy / count : 0

}


export async function data
(file: fs.ReadFile): Promise<ImageData>
{
	let canvas = wx.createOffscreenCanvas(
		{ type: '2d' },

	)

	let image = canvas.createImage()

	await new Promise(
		(resolve, reject) =>
		{
			image.onload = resolve
			image.onerror = reject

			image.src = fs.base64(file)

		},

	)

	canvas.width = image.width
	canvas.height = image.height

	let context = canvas.getContext('2d') as CanvasRenderingContext2D

	context.drawImage(image as CanvasImageSource, 0, 0)

	return context.getImageData(0, 0, image.width, image.height)

}


export function resize
(
	image: ImageData | HTMLCanvasElement,

	width: number,
	height: number = Math.ceil(width * (image.height / image.width) ),

):
ImageData
{
	let canvas = wx.createOffscreenCanvas(
		{
			type: '2d',

			width,
			height,

		},

	)

	let context = canvas.getContext('2d') as CanvasRenderingContext2D

	context.imageSmoothingEnabled = true
	context.imageSmoothingQuality = 'high'

	if (image instanceof HTMLCanvasElement)
	{
		context.drawImage(
			image,

			0, 0, image.width, image.height,

			0, 0, width, height,

		)

	}
	else if (image instanceof ImageData)
	{
		context.putImageData(image, 0, 0)

	}

	return context.getImageData(0, 0, width, height)

}


export function normalize (image: Uint8ClampedArray): Uint8ClampedArray
{
	let l = image.length / 4

	let x = new Uint8ClampedArray(l)

	for (let i = 0; i < l; i++)
	{
		let pixel = pick(image, i)

		x[i] = Number(pixel.r > 0 || pixel.g > 0 || pixel.b > 0 || pixel.a > 0)

	}

	return x

}
