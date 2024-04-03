import { API_URL } from "./api/API_URL";
import { createNavigationContainerRef } from '@react-navigation/native';

import { Share } from "react-native";
import React from "react";

/**
 * 公共工具包
 */


export const navigationRef = createNavigationContainerRef()


export async function ST_request({ method = 'GET', path = '', data = {} }) {
    let response;
    data = { ...data, lang: 'en' }
    console.log(data);
    console.log(path);
    const ST_Token = "";
    //////console.log(`${API_URL}${path}`,method);
    const headers = { "Authorization": `Bearer ${data.token}` || "", "Content-type": "application/json" }
    if (method === 'PUT' || method === 'POST') {
        response = await fetch(`${API_URL}${path}`, { headers, method, body: JSON.stringify(data) })
    } else {
        response = await fetch(`${API_URL}${path}&lang=en`, { headers, method })
    }

    if (response.status === 401) {
        navigationRef.navigate('SignIn.LoginWithPhone')
        // Toast.show("Not logged in yet");
        ////console.log('未登录:', path)
        throw new Error("Not logged in yet")
    }
    // console.log(await response.text());
    if (response.status !== 200) {
        //////console.log(await response.text());
        throw new Error("Network response was not ok")
    }
    const _json = await response.json()
    console.log(_json);
    if (_json.code !== 1) throw new Error(_json.msg)
    // //////console.log(_json.data)
    return _json.data;

}


export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

export const ST_Share = async (type = 'profile', id) => {
    try {
        await Share.share({
            message: `${API_URL}/index/share/index?id=${id}&type=${type}`,
            url: `${API_URL}/index/share/index?id=${id}&type=${type}`,
            title: `Share ${type === 'profile' ? 'my body profile' : 'listing '} with you`
        });

    } catch (error) {
        Toast.show(error.message)
    }

}

export const Bug_Push = async (title, text) => {
    //////console.log('bug pushing...')
    if (!__DEV__) {
        // fetch(`http://www.pushplus.plus/send?token=30217d13e0bf4231b907757b91303ce2&title=NextChoc Error:${title}&content=${text}&template=html`)
        //     .catch(()=>{})
    }
}




//补0
function repair(i) {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}
export function getCurrentTime(time) {
    let date;
    if (time) {
        date = new Date(time * 1000);
    } else {
        date = new Date(); //当前时间
    }
    let year = date.getFullYear(); //返回指定日期的年份
    let month = repair(date.getMonth() + 1); //月
    let day = repair(date.getDate()); //日
    let hour = repair(date.getHours()); //时
    let minute = repair(date.getMinutes()); //分
    let second = repair(date.getSeconds()); //秒

    //当前时间
    return (
        year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
    );
}



