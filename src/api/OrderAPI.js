
import { ST_request } from "../common/utils";
import { API_URL } from "../common/api/API_URL";
import { navigationRef } from "../common/utils";
export default OrderApi = {

    // fetchHomepage:async (data)=>await ST_request({method:'GET',path:'/api/index/index'}),
    fetchOrderList: async (data) => await ST_request({ method: 'GET', data, path: '/api/order/index' }),
    createOrder: async (data) => {
        let response;
        let formdata = new FormData();
        console.log(data);

        formdata.append("amount", data.amount);
        formdata.append("coupon_code",data.coupon_code);
        formdata.append("goods", JSON.stringify(data.goods));
        formdata.append("merchant_id", data.merchant_id);
        formdata.append("payment_type", data.payment_type);
        formdata.append("payment_amount", data.payment_amount);
        formdata.append("lang", "en");
        // console.log(formdata);
        const headers = { "Authorization": `Bearer ${data.token}` || "", "Content-type": "multipart/form-data" }
        response = await fetch(`${API_URL}/api/order/create`, { headers, method: 'POST', body: formdata })
        if (response.status === 401) {
            navigationRef.navigate('SignIn.LoginWithPhone')
            Toast.show("Not logged in yet");
            throw new Error("Not logged in yet")
        }
        // console.log(await response.text());
        if (response.status !== 200) {
            console.log(await response.text());
            throw new Error("Network response was not ok")
        }
        const _json = await response.json()
        // //////console.log(await response.text());
        if (_json.code !== 1) throw new Error(_json.msg)
        //////console.log(_json.data)
        return _json.data;

    },
    addToShopCar: async (data) => await ST_request({ method: 'POST', data, path: '/api/cart/create' }),
    deleteFromShopCar: async (data) => await ST_request({ method: 'POST', data, path: '/api/cart/delete' }),
    updateCount: async (data) => await ST_request({ method: 'POST', data, path: '/api/cart/updateGoodsCount' }),
    fetchOrderDetail: async (data) => await ST_request({ method: 'GET', data, path: `/api/order/detail?order_id=${data.order_id}` }),
    evaluteOrder: async (data) => await ST_request({ method: 'POST', data, path: `/api/order/submitEvaluation` })
}

