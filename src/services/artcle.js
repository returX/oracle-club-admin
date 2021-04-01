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

articleApi.delete = (id,soft = true) =>{
    return request({
        url: `${ARTICLE}/${id}`,
        method: METHOD.DELETE,
        params: {soft}
    })
}

articleApi.deleteMulti = (ids) =>{
    return request({
        url: ARTICLE,
        method: METHOD.DELETE,
        data: ids
    })
}

articleApi.update = (data) => {
    return request({
        url: `${ARTICLE}/${data.id}`,
        method: METHOD.PUT,
        data:data
    })
}

articleApi.updateStatus = (ids,status) => {
    return request({
        url: ARTICLE,
        method: METHOD.PUT,
        params: {status},
        data: ids,
    })
}

export default articleApi