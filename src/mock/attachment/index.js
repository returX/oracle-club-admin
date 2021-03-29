import Mock from 'mockjs'
import qs from "querystring"

const Random = Mock.Random

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/api/admin/attachments/upload`,'post',()=>{
    let path = Random.image()
    let result = {
        result: "ok",
        data:{
            id : Random.id(),
            name: Random.word(),
            thumbPath: path,
            path: path,
            mediaType: 'image/png',
            suffix: 'png',
            width: 225,
            height: 225,
            size: 11125,
            type: 'LOCAL',
            createdAt: Random.now(),
        }
    }

    return result
})

Mock.mock(RegExp(`${process.env.VUE_APP_API_BASE_URL}/api/admin/attachments`+".*"),'get',options=>{
    const params = qs.parse(options.url.split('?')[1])
    let content = Mock.mock({
        [`content|${params.size}`]:[{
                id : "@id",
                name: "@word",
                thumbPath: "@image",
                path: "@image",
                mediaType: 'image/png',
                suffix: 'png',
                width: 225,
                height: 225,
                size: 11125,
                type: 'LOCAL',
                createdAt: "@now",
            }]
    }).content
    let result = {
        result: "ok",
        data: {
            content,
            "totalElements": content.length,
            "totalPages": 10,
        },
    }
    return result
})

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/api/admin/attachments`,'delete',()=>{
    let result = {
        result: "ok"
    }
    return result
})