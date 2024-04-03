
import { ST_request } from "../common/utils";

export default MapApi = {
    // fetchshoplist: async (data) => await ST_request({method: 'GET', data: data, path: '/api/merchant/index'}),
    // loginByPassword:async (data)=>await ST_request({method:'POST',data:data,path:'/api/user/loginByEmailOrMobilePassword'}),
    queryAutoCompleted:async (data)=>await ST_request({method:'GET',data,path:`/api/googlemap/queryAutoCompleted?keywords=${data?.keywords}`}), 
    placeId2latlng:async (data)=>await ST_request({method:'GET',data,path:`/api/googlemap/placeId2latlng?place_id=${data?.place_id}`}),
    searchAreaShop:async (data)=>await ST_request({method:'GET',data,path:`/api/merchant/radius?lng=${data?.lng}&lat=${data?.lat}&radius=${data?.radius}&keywords=${data?.keywords}`}),
    latitude2placeId:async (data)=>await ST_request({method:'GET',data,path:`/api/googlemap/latlng2placeId?lng=${data.lng}&lat=${data.lat}`}),
    NLatitude2placeId:async (data)=>await ST_request({method:'GET',data,path:`/api/googlemap/latlng2placeIdForBaidu?lng=${data.lng}&lat=${data.lat}`})
    
}