import {METHOD, request} from "@/utils/request";
import {ARTICLE} from "@/services/api";


const articleApi = {}

articleApi.list = (params)=>{
    return request({
        url: ARTICLE,
        method:METHOD.GET,
        params:params
    })
}

articleApi.delete = (id) =>{
    return request({
        url: `${ARTICLE}/${id}`,
        method: METHOD.DELETE
    })
}

articleApi.deleteMulti = (ids) =>{
    return request({
        url: ARTICLE,
        method: METHOD.DELETE,
        data: ids
    })
}

export default articleApi