import enquireJs from 'enquire.js'

export function isDef (v){
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

const _toString = Object.prototype.toString


export function isImage(mediaType) {
  const [media,type] = mediaType.split("/")
  if (media !== 'image'){
    return false
  }
  return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(type.toLowerCase()) !== -1;
}

//获取原文本中的一部分文本
export function describe(content,size = 200) {
  if (content?.length > size){
    return content.substring(0,size)
  }
  return content
}