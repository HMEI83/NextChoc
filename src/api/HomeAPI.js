
import { ST_request } from "../common/utils";

export default HomeApi = {
    // fetchshoplist: async (data) => await ST_request({method: 'GET', data: data, path: '/api/merchant/index'}),
    // loginByPassword:async (data)=>await ST_request({method:'POST',data:data,path:'/api/user/loginByEmailOrMobilePassword'}),
    fetchHomepage:async (data)=>await ST_request({method:'GET',data,path:`/api/index/index?token=${data.token}`}),
    fetchShopList:async (data)=>await ST_request({method:'GET',data,path:`/api/merchant/index?sort_type=${data?.sort_type??""}&address=${data?.address??""}&keywords=${data?.keywords??""}&listRows=${data?.listRows??""}&page=${data?.page??""}`}),
    uploadLocation:async (data)=>await ST_request({method:'POST',data,path:'/api/user/updateLocation'}),
    fetchnotification:async (data)=>await ST_request({method:'GET',data,path:'/api/Expopushrecord/index'}),
}