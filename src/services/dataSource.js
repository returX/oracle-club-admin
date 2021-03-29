import {GOODS, GOODS_COLUMNS} from './api'
import {METHOD, request} from '@/utils/request'

export async function goodsList(params) {
  return request({
    url:GOODS,
    method: METHOD.GET,
    params: params
  })
}

export async function goodsColumns() {
  return request({
    url:GOODS_COLUMNS,
    method:METHOD.GET
  })
}

export default {goodsList, goodsColumns}