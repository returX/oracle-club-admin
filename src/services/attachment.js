import {request,METHOD} from "@/utils/request";
import {UPLOAD,ATTACHMENTS} from "@/services/api"

const attachmentApi = {}

attachmentApi.upload = (formData) => {
    return request({
        url:UPLOAD,
        method:METHOD.POST,
        data:formData,
    })
}

attachmentApi.list = (params) =>{
    return request({
        url: ATTACHMENTS,
        method:METHOD.GET,
        params:params
    })
}

attachmentApi.update = (id,params) =>{
    return request({
        url:`${ATTACHMENTS}/${id}`,
        method:METHOD.PUT,
        params:params
    })
}

attachmentApi.deleteBatch = (data) =>{
    return request({
        url: ATTACHMENTS,
        method:METHOD.DELETE,
        data:data
    })
}

export default attachmentApi