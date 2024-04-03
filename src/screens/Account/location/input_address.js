import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, EvilIcons, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import MapAPI from "../../../api/MapAPI";
import useThrottle from "../../../common/hooks/useThrottle";
import config from "../../../common/config";
import { useCommonActions, useToken } from "../../../common/store/user";
import * as Location from 'expo-location'
import HomeAPI from "../../../api/HomeAPI";
import { useNavigation } from "@react-navigation/native";
export default function InputAddress() {
    const [keyword, setKeyword] = useState("");
    const navigation = useNavigation();
    const token = useToken();
    const [loading, setLoading] = useState(false);
    const setLocal = useCommonActions().setLocal;
    const [pos, setPos] = useState({ lat: 0, lng: 0 });
    const fetchAddressLinking = useMutation({
        mutationKey: ['fetchAddressLinking'],
        mutationFn: (data) => MapAPI.queryAutoCompleted(data)
    })
    const placeId2latlng = useMutation({
        mutationFn: (data) => MapAPI.placeId2latlng(data),
        mutationKey: ['placeId2latlng'],
    })
    const uploadLocation = useMutation({
        mutationFn: (data) => HomeAPI.uploadLocation(data),
        mutationKey: ['uploadLocation'],
    })
    const search = (data) => {
        // console.log(data);
        if (data.trim().length <= 2) {
            return;
        }
        fetchAddressLinking.mutate({ keywords: data, token }, {
            onSuccess: (res) => {
                // console.log(res);
            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
            }
        })
    }
    const setLocation = async (data) => {
        console.log(data);
        setLoading(true);
        // let res=await Location.geocodeAsync(data.description);
        // console.log(res);
        // let address= await Location.reverseGeocodeAsync({latitude:res.latitude,longitude:res.longitude});
        // console.log(address);

        placeId2latlng.mutate({ place_id: data.place_id, token }, {
            onSuccess: async (res) => {
                let location = await Location.reverseGeocodeAsync({ latitude: res.lat, longitude: res.lng });
                // console.log(location);
                setLocal({
                    ...location[0],
                    local_name:data.structured_formatting?.main_text,
                    main_text:data.description,
                    name: data.structured_formatting?.main_text,
                    coords: {
                        latitude: res.lat,
                        longitude: res.lng,
                    }
                })
                console.log("*****");
                console.log({
                    ...location[0],
                    local_name:data.description,
                    main_text: data.structured_formatting?.main_text,
                    name: data.description,
                    coords: {
                        latitude: res.lat,
                        longitude: res.lng,
                    }
                })
                uploadLocation.mutate({ token, ...res, location: data.description }, {
                    onSuccess: (res) => {
                        navigation.goBack();
                        setLoading(false);
                    },
                    onError: (res) => {
                        Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                        setLoading(false);
                    }
                });
            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                setLoading(false);
            }
        })

    }
    const _Input = (data) => {
        useThrottle(search(data), 2000);
    }
    return (<View style={{ marginTop: 18, width: '100%' }}>
        <View style={{ width: '100%', paddingVertical: 8, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.1)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)', borderRadius: 32, paddingHorizontal: 16, display: 'flex', alignItems: 'center' }}>
            <EvilIcons name="location" size={24} color="rgba(0,0,0,0.3)" style={{ marginRight: 12, paddingVertical: 8 }} />
            <TextInput style={{ flex: 1, fontSize: 16 }} onChangeText={_Input} />
        </View>

        <View style={{ marginTop: 16, paddingLeft: 16 }}>
            {
                loading ? <ActivityIndicator size={'large'} color={config.primaryColor} /> : (fetchAddressLinking.isLoading ? <ActivityIndicator size={'large'} color={config.primaryColor} /> : fetchAddressLinking.isSuccess && fetchAddressLinking.data.map((item, index) => {
                    return (<Pressable onPress={() => setLocation(item)} key={index} style={{ display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'row', marginBottom: 12 }}>
                        <FontAwesome style={{ marginRight: 12 }} name="location-arrow" size={24} color="rgba(0,0,0,0.3)" />
                        <View style={{ borderBottomColor: 'rgba(0,0,0,0.3)', borderBottomWidth: 1, flex: 1, paddingBottom: 12 }}>
                            <Text style={{ fontSize: 18 }}>{item?.structured_formatting?.main_text}</Text>
                            <Text style={{ color: 'rgba(0,0,0,0.1)', fontSize: 16 }}>{item?.description}</Text>
                        </View>
                    </Pressable>)
                }))

            }
        </View>
    </View >)
}