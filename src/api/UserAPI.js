import { ST_request } from "../common/utils";

export default UserAPI = {
    // fetchshoplist: async (data) => await ST_request({method: 'GET', data: data, path: '/api/merchant/index'}),
    // loginByPassword:async (data)=>await ST_request({method:'POST',data:data,path:'/api/user/loginByEmailOrMobilePassword'}),
    changePromot:async (data)=>await ST_request({method:'POST',data,path:`/api/user/setAllowPromotNotify`}),
    changeNotification:async (data)=>await ST_request({method:'POST',data,path:`/api/user/setAllowPushNotify`}),
    cardList:async (data)=>await ST_request({method:'POST',data,path:`/api/card/index`}),
    AddCard:async (data)=>await ST_request({method:'POST',data,path:`/api/card/create`}),
    UpdateCard:async (data)=>await ST_request({method:'POST',data,path:`/api/card/update`}),
    DeleteCard:async (data)=>await ST_request({method:'POST',data,path:`/api/card/delete`}),
    setDefault:async (data)=>await ST_request({method:'POST',data,path:`/api/card/setDefault`}),
    
}