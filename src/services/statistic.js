import {METHOD, request} from "@/utils/request";
import {STATISTIC} from "@/services/api";


const statisticApi = {}

statisticApi.getStatisticAll = () => {
  return request({
    url: STATISTIC,
    method: METHOD.GET,
  })
}


export default statisticApi
