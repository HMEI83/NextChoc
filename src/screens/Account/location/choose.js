
import { useNavigation } from "@react-navigation/native";
import { Pressable, View, Text, ScrollView, Image, ActivityIndicator,Dimensions } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, EvilIcons,Ionicons } from "@expo/vector-icons";
import InputAddress from "./input_address";
import { useState } from "react";
import config from "../../../common/config";
import { useMutation } from "@tanstack/react-query";

import MapAPI from "../../../api/MapAPI";
import * as Location from 'expo-location';
import { useCommonActions, useToken } from "../../../common/store/user";
import HomeAPI from "../../../api/HomeAPI";
export default function Choose() {
    const navigation = useNavigation();
    const [change, setChange] = useState(false);
    const setLocal = useCommonActions().setLocal;
    const token = useToken();
    const [d_location, setD_location] = useState("");
    const [loading, setLoading] = useState("");
    const setIsUpdate = useCommonActions().setIsUpdate;
    const fetchPos=useMutation({
        mutationFn:(data)=>MapAPI.NLatitude2placeId(data),
        mutationKey:['fetchPos']
     })
    const uploadLocal = useMutation({
        mutationFn: (data) => HomeAPI.uploadLocation(data),
        mutationKey: ['uploadLocal'],
    })
    const fetchPosition = async () => {
        setLoading(true);
        console.log("1");
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("2");
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        console.log("3");
        let pos = await Location.getCurrentPositionAsync({});
        console.log("4");
        // const lc = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        console.log("5");
        // setD_location(lc);
        // if (!token) {
        //    ////console.log('未登录,停止更新定位..');
        //    return;
        // }
        fetchPos.mutate({lng:pos.coords.longitude,lat:pos.coords.latitude},{
            onSuccess:(res)=>{
               console.log("-11-")
               console.log(res.addressComponent);
               setLocal({...pos,local_name:res?.formatted_address_short})
               navigation.canGoBack && navigation.goBack();
               //console.log(res);
               token && uploadLocal.mutate({ lng: pos.coords.longitude, lat: pos.coords.latitude, location:res?.formatted_address_short, token }, {
                  onSuccess: (res) => {
                     ////////////console.log(res);
                     ////console.log("上传成功")
                  },
                  onError: (res) => {
         
                  }
               })
            },
            onError:(res)=>{
                console.log(res)
               Toast.show(res instanceof Error?res.msg:JSON.stringify(res));
            }
         });
        // console.log("2");
        // let name=lc.city+" "+lc.district+" "+lc.street+" "+lc.streetNumber
        // console.log({ ...lc[0], ...pos });
        // setLocal({ ...lc[0], ...pos,local_name:name });
        // Toast.show("set location successfully");
        // 

        // if (!token) {
        //     setLoading(false);
        //     return;
        // }
        // uploadLocal.mutate({ lng: pos.coords.longitude, lat: pos.coords.latitude, location: lc[0].name, token }, {
        //     onSuccess: (res) => {
        //         //////console.log(res);
        //         Toast.show("Successfully set address");
        //         setLoading(false);
        //     },
        //     onError: (res) => {
        //         console.log(res);
        //         setLoading(false);
        //     }
        // })
    }


    return (<View style={{ marginTop: Dimensions.get("screen").height * 0.06, paddingHorizontal: 16 }}>
        <Pressable onPress={() => navigation.canGoBack && navigation.goBack()}>
            <Ionicons name="arrow-back" style={{ width: 80 }} size={24} color="black" />

        </Pressable>
        <Text style={{ fontSize: 32, display: 'flex',marginTop:24 }}>Find surprise boxes</Text>
        <Text style={{ fontSize: 32, color: config.primaryColor }}>near you</Text>
        <Text style={{ marginTop: 24, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>Simply enter your location and explore a list of top-rated surprise boxes in the area.</Text>

        {
            !change && <View style={{ marginTop: 24 }}>
                {loading ? <ActivityIndicator size={'large'} /> : <Pressable onPress={fetchPosition} style={{ width: '100%', display: 'flex', flexDirection: 'row', marginVertical: 8, alignItems: 'center', justifyContent: 'center', borderColor: config.primaryColor, borderWidth: 2, borderRadius: 32 }}>
                    <MaterialIcons name="my-location" size={24} style={{ marginRight: 12, paddingVertical: 12 }} color={config.primaryColor} />
                    <Text style={{ color: config.primaryColor }}>USE CURRENT LOCATION</Text>
                </Pressable>}
                <Pressable onPress={() => setChange(true)}>
                    <View style={{ width: '100%', marginTop: 18, display: 'flex', flexDirection: 'row', alignItems: 'center', borderColor: 'rgba(0,0,0,0.2)', borderWidth: 2, borderRadius: 32, paddingHorizontal: 16, paddingVertical: 8 }}>
                        <EvilIcons name="location" size={24} color="rgba(0,0,0,0.4)" style={{ marginRight: 12, paddingVertical: 8 }} />
                        <Text style={{ color: 'rgba(0,0,0,0.4)' }}>Enter a new address</Text>
                    </View>
                </Pressable>

            </View>
        }
        {
            change && <InputAddress />
        }
    </View>)
}