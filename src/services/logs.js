import {METHOD, request} from "@/utils/request";
import {LOGS} from "@/services/api";

const logsApi = {}



logsApi.latest = (top) => {
  return request({
    url: `${LOGS}/latest`,
    method: METHOD.GET,
    params: {
      top: top
    }
  })
}

logsApi.page = params => {
  return request({
    url: LOGS,
    method: METHOD.GET,
    params: params
  })
}


export default logsApi
