import { ST_request } from "../common/utils";

export default LoginAPI = {
    sendCode: async (data) => await ST_request({method: 'POST', 'data': data, path: '/api/ems/send'}),
    loginByPassword:async (data)=>await ST_request({method:'POST',data:data,path:'/api/user/loginByEmailOrMobilePassword'}),
    loginByCode:async (data)=>await ST_request({method:'POST',data,path:'/api/user/loginByEmailOrMobileCode'}),
    registerByEmail:async(data)=>await ST_request({method:'POST',data,path:`/api/user/registerByEmail`}),
    registerByTel:async (data)=>await ST_request({method:'POST',data,path:`/api/user/registerByMobile`}),
    resetPasswordByMobile:async (data)=>await ST_request({method:'POST',data,path:`/api/user/resetPasswordByMobile`}),
    resetPasswordByEmail:async (data)=>await ST_request({method:'POST',data,path:`/api/user/resetPasswordByEmail`}),
    verifyCode:async (data)=>await ST_request({method:'POST',data,path:`/api/user/verifyCode`}),
    resetPassword:async (data)=>await ST_request({method:'POST',data,path:`/api/user/resetPassword`}),
    fetchBaseMess:async (data)=>await ST_request({method:'GET',data,path:`/api/user/index`}),
    googleLogin:async (data)=>await ST_request({method:"POST",data,path:`/api/user/googleLogin`}),
    faceBookLogin:async (data)=>await ST_request({method:'POST',data,path:`/api/user/facebookLogin`}),
    fetchVersion:async (data)=>await ST_request({method:'GET',path:`/api/Version/check?platform=${data.platform}&version=${data.version}`}),
    updateUserMess:async (data)=>await ST_request({method:'POST',data,path:`/api/user/profile`}),
    resetPassword:async (data)=>await ST_request({method:'POST',data,path:`/api/user/resetPassword`}),
    resetPasswordByEmail:async (data)=>await ST_request({method:'POST',data,path:`/api/user/resetPasswordByEmail`}),
    resetPasswordComfirm:async (data)=>await ST_request({method:'POST',data,path:`/api/user/verifyCode`}),
    resetPasswordByMobile:async (data)=>await ST_request({method:'POST',data,path:`/api/user/resetPasswordByMobile`}),
    verifyIsRegister:async (data)=>await ST_request({method:'GET',path:`/api/user/selectMobileExists?mobile=${data}`}),
    verifyEmailRegister:async (data)=>await ST_request({method:'GET',data,path:`/api/user/selectEmailExists?email=${data}`}),
    logout:async (data)=>await ST_request({method:'POST',data,path:`/api/user/logout`}),
    sendPhoneMess:async (data)=>await ST_request({method:'POST',data,path:`/api/sms/send`})

}