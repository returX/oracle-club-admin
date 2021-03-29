import Vue from "vue";
import {format} from 'date-fns';
import {userStatus, userRole, articleStatus} from "@/utils/constants";
import _ from "lodash";

Vue.filter('fileSizeFormat', function(value) {
    if (!value) {
        return '0 Bytes'
    }
    let unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let index = 0
    let srcsize = parseFloat(value)
    index = Math.floor(Math.log(srcsize) / Math.log(1024))
    let size = srcsize / Math.pow(1024, index)
    size = size.toFixed(2)
    return size + ' ' + unitArr[index]
})

Vue.filter('moment', function(dataStr, pattern = 'yyyy-MM-dd HH:mm:ss') {
    if (!dataStr){
        return
    }
    if (typeof dataStr === "number"){
        return format(dataStr,pattern)
    }
    return dataStr
})

const status2Ch = _.zipObject(Object.values(userStatus),["未激活", "正常", "已封禁"])

Vue.filter('statusFormat',function (data){
    let keys = Object.keys(status2Ch)
    if (keys.indexOf(data) === -1){
        return "无"
    }
    return status2Ch[data]
})

const status2Badge = _.zipObject(Object.values(userStatus),["default", "success", "error"])


Vue.filter('statusBadge',function (data){
    return status2Badge[data]
})

const role2Color = _.zipObject(Object.values(userRole),["#26C6DA", "#4CAF50", "#263238"])

Vue.filter('roleColor',function (data){
    return role2Color[data]
})

const role2CN = _.zipObject(Object.values(userRole),["游客", "内部成员", "管理员"])

Vue.filter('roleFormat',function (data){
    let keys = Object.keys(role2CN)
    if (keys.indexOf(data) === -1){
        return "无"
    }
    return role2CN[data]
})

Vue.filter('nullFormat',function (data){
    if (data === null || data === undefined){
        return "-"
    }
    return data
})

const articleStatus2Badge = _.zipObject(Object.values(articleStatus),["default", "success", "error"])

Vue.filter('articleBadge',function (data){
    return articleStatus2Badge[data]
})

const articleStatus2Ch = _.zipObject(Object.values(articleStatus),["未发布", "已发布", "已删除"])

Vue.filter('articleStatusCN',function (data){
    let keys = Object.keys(articleStatus2Ch)
    if (keys.indexOf(data) === -1){
        return "无"
    }
    return articleStatus2Ch[data]
})