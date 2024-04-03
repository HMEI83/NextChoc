
import { ST_request } from "../common/utils";
import { API_URL } from "../common/api/API_URL";
export default ShopApi = {

    // fetchHomepage:async (data)=>await ST_request({method:'GET',path:'/api/index/index'}),
    fetchShopDetail:async (data)=>await ST_request({method:'GET',data,path:`/api/merchant/detail?merchant_id=${data.merchant_id}`}),
    fetchEvaluationList:async (data)=>await ST_request({method:'GET',path:`/api/order/evaluationList?merchant_id=${data.id}&listRows=${data.listRows}&page=${data.page}`,data}),
    cancelOrder:async (data)=>await ST_request({method:'POST',path:`/api/order/applyRefund`,data}),
    collectShop:async (data)=>await ST_request({method:'POST',data,path:`/api/merchant/favorite`}),
    uncollectShop:async (data)=>await ST_request({method:'POST',data,path:`/api/merchant/uhFavorite`}),
    collectList:async (data)=>await ST_request({method:'GET',data,path:`/api/merchant/favoriteList`}),
    CouponCanUse:async (data) => {
        let response;
        let formdata = new FormData();
        console.log(data);
        // data.foreach((item,index)=>{

        // })
       
        formdata.append("goods", JSON.stringify(data.goods));
        formdata.append("coupon_code", data.coupon_code);
        formdata.append("lang", "en");
        // console.log(formdata);
        const headers = { "Authorization": `Bearer ${data.token}` || "", "Content-type": "multipart/form-data" }
        response = await fetch(`${API_URL}/api/order/useCouponCode`, { headers, method: 'POST', body: formdata })
        if (response.status === 401) {
            navigationRef.navigate('SignIn.LoginWithPhone')
            Toast.show("Not logged in yet");
            throw new Error("Not logged in yet")
        }
        // console.log(await response.text());
        if (response.status !== 200) {
            //////console.log(await response.text());
            throw new Error("Network response was not ok")
        }
        const _json = await response.json()
        // //////console.log(await response.text());
        if (_json.code !== 1) throw new Error(_json.msg)
        //////console.log(_json.data)
        return _json.data;

    },
}