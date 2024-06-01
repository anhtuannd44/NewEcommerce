export const compressBase64ToBase64 = async (base64Str: any, size: any, maxWidth: any) => {
  if (window) {
    const Compress = require('compress.js')
    let minePrefix = base64Str.match(/data:.+base64,/)?.[0] || ''
    let mine = minePrefix.replace('data:', '').replace(';base64,', '') || undefined
    const { base64 }: any = await compressFileToBase64(Compress.convertBase64ToFile(base64Str.replace(minePrefix, ''), mine), size, maxWidth)
    return minePrefix + base64
  }
}

export const compressBase64 = async (base64Str: any, size: any, maxWidth: any) => {
  if (window) {
    const Compress = require('compress.js')
    let minePrefix = base64Str.match(/data:.+base64,/)?.[0] || ''
    let mine = minePrefix.replace('data:', '').replace(';base64,', '') || undefined
    const { base64, ext }: any = await compressFileToBase64(Compress.convertBase64ToFile(base64Str.replace(minePrefix, ''), mine), size, maxWidth)

    const outputFile = Compress.convertBase64ToFile(base64, ext)
    return outputFile
  }
}

export const compressFile = async (file: any, size: any, maxWidth: any) => {
  if (window) {
    const Compress = require('compress.js')
    const { base64, ext }: any = await compressFileToBase64(file, size, maxWidth)

    const outputFile = Compress.convertBase64ToFile(base64, ext)
    return outputFile
  }
}

const compressFileToBase64 = async (file: any, size = 1, maxWidth = 1920) => {
  if (window) {
    const Compress = require('compress.js')
    var compress = new Compress()

    const resizedImage = await compress.compress([file], {
      size, // the max size in MB, defaults to 2MB
      quality: 1, // the quality of the image, max is 1,
      maxWidth, // the max width of the output image, defaults to 1920px
      maxHeight: 1920, // the max height of the output image, defaults to 1920px
      resize: true // defaults to true, set false if you do not want to resize the image width and height
    })

    const img = resizedImage[0]
    const base64 = img.data
    const ext = img.ext
    return { base64, ext }
  }
}
