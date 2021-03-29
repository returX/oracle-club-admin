import {request,METHOD} from "@/utils/request";
import {DEPARTMENTS} from "@/services/api"

const departmentsApi = {}

departmentsApi.list = () =>{
    return request({
        url:DEPARTMENTS,
        method: METHOD.GET
    })
}

departmentsApi.update = (department) =>{
    return request({
        url:`${DEPARTMENTS}/${department.id}`,
        method: METHOD.PUT,
        data:department
    })
}

departmentsApi.create = (department) =>{
    return request({
        url: DEPARTMENTS,
        method: METHOD.POST,
        data: department
    })
}

departmentsApi.delete = (id) =>{
    return request({
        url: `${DEPARTMENTS}/${id}`,
        method: METHOD.DELETE
    })
}


export default departmentsApi