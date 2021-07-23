import {METHOD, request} from "@/utils/request";
import {PICTURE} from "@/services/api";


const pictureApi = {}


pictureApi.types = ()=>{
    return request({
        url: `${PICTURE}/type`,
        method:METHOD.GET
    })
}

pictureApi.list = (params)=>{
    return request({
        url: PICTURE,
        method: METHOD.GET,
        params:params
    })
}

pictureApi.uploads = (formData,handleProgress) => {
    return request({
        url: `${PICTURE}/uploads`,
        method:METHOD.POST,
        onUploadProgress: (progressEvent)=>{
            if (progressEvent.lengthComputable){
                handleProgress && handleProgress(progressEvent)
            }
        },
        data:formData,
    })
}

pictureApi.update = (id,data) => {
    return request({
        url: `${PICTURE}/${id}`,
        method: METHOD.PUT,
        data: data
    })
}

pictureApi.delete = (id,soft = true) =>{
    return request({
        url: `${PICTURE}/${id}`,
        method: METHOD.DELETE,
        params: {soft}
    })
}



export default pictureApi
