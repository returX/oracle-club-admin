import Mock from 'mockjs'
import {departments} from "@/mock/common";


Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/api/admin/departments`,'get',()=>{
    let result = {}

    result = {
        result: 'ok',
        data:departments
    }

    return result
})