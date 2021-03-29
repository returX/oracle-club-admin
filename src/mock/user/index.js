import Mock from "mockjs"
import qs from "querystring";


Mock.mock(RegExp(`${process.env.VUE_APP_API_BASE_URL}/api/admin/users`+".*"),'get',(options)=>{

    const params = qs.parse(options.url.split('?')[1])
    let content = Mock.mock({
        [`content|${params.size}`]:[{
            id: "@id",
            name: "@word",
            email: "@email",
            nickname: "@word",
            stuNum: /4180\d{4}/,
            phNum: /1572962\d{4}/,
            info: "@sentence",
            avatar: "@image",
            status: "@userStatus",
            role: "@role",
            ipAddr: /192\.168\.0\.\d{1,2}/,
            loginAt: "@now",
            createdAt: "@now",
            updatedAt: "@now",
            department: "@department"
        }]
    }).content


    return {
        result : "ok",
        data:{
            content,
            totalElements: content.length * 10,
            totalPages: 10,
        }
    }
})

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/api/admin/users`,'delete',options=>{
    console.log(options)

    return {
        result: 'ok',
        data: null,
        msg: "删除用户列表成功"
    }
})