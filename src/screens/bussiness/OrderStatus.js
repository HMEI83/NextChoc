import { View, Text, Image, ImageBackground, Pressable, ScrollView, Dimensions, Linking, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons, AntDesign, Feather, Foundation, FontAwesome5, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GoogleMapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import config from "../../common/config";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import OrderAPI from "../../api/OrderAPI";
import { useLocal, useToken } from "../../common/store/user";
export default function OrderStatus({ route }) {
    const loading = useState(false);
    const mRef = useRef()
    const selectStatus = useState(false);
    const [pos, setPos] = useState({
        latitude: "-33.88788",
        longitude: "151.18824",
    });

    const merchant = useState();
    const token = useToken();
    const [end, setEnd] = useState({
        latitude: "-33.88798",
        longitude: "151.18714",
    })
    const fetchOrderDetail = useQuery({
        queryFn: () => OrderAPI.fetchOrderDetail({ order_id: route.params.id, token }),
        queryKey: ['fetchOrderDetail', route.params.id],
        onSuccess: (res) => {
            console.log('商家：')
            console.log(res.merchant);
            setPos({
                latitude: res.merchant.lat,
                longitude: res.merchant.lng,
            });
            merchant[1](res.merchant)
            setEnd({

            })
        }
    })
    const urlScheme = (mapName) => {
        // const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });

        const scheme = mapName === 'ios' ? 'maps://0,0?q=' : 'geo:0,0?q=';
        const latLng = `${pos.latitude},${pos.longitude}`;
        const label = `${merchant[0]?.merchantname ?? 'Store Address'}`;
        const url = mapName === 'ios' ? `${scheme}${label}@${latLng}` : `comgooglemaps://?center=${latLng}&zoom=14&views=traffic&q=${label}`;

        Linking.openURL(url).catch((er) => {
            console.log(er);
            console.log(url)
            Toast.show('Map Not Found!')
        });
        selectStatus[1](false)
    }
    useEffect(() => {
        console.log("pos:");
        console.log(pos.latitude, pos.longitude);
        console.log(typeof pos.latitude, typeof pos.longitude)
    }, [pos])

    const navigation = useNavigation();


    return (<View style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {fetchOrderDetail.isFetching ? <ActivityIndicator style={{ marginTop: 48 }} color={config.primaryColor} size={"large"} /> : fetchOrderDetail.isSuccess && <View style={{ display: 'flex', flex: 1, position: 'relative' }}>
            <View style={{ position: 'relative', width: '100%', display: 'flex', flex: 1 }}>
                <GoogleMapView
                    loadingEnabled={loading[0]}
                    initialCamera={{
                        zoom: 16, center: {
                            latitude: parseFloat(pos.latitude) - 0.004, longitude: parseFloat(pos.longitude)
                        }, heading: 0, pitch: 0
                    }}
                    scrollEnabled={true}
                    showsScale={true}
                    ref={(r) => (mRef.current = r)}
                    provider={PROVIDER_GOOGLE}
                    showsCompass={true}
                    zoomControlEnabled={true}
                    zoomEnabled={true}
                    mapType={"standard"}
                    zoomTapEnabled={false}
                    style={{ width: '100%', display: 'flex', flex: 1 }}
                >
                    {
                        end && <Marker
                            title={'nearby stores'}
                            description={"nearby stores"}
                            pinColor={'blue'}
                            coordinate={{
                                latitude: parseFloat(pos.latitude),
                                longitude: parseFloat(pos.longitude),
                            }}>
                            <View style={{
                                color: "#fff",
                                width: 30,
                                height: 30,
                                lineHeight: 20,
                                textAlign: "center",
                                backgroundColor: config.primaryColor,
                                alignItems: "center",
                                borderRadius: 30,
                                padding: 5,
                            }}>
                                <Entypo name="shop" size={15} color="#fff" />
                            </View>
                        </Marker>
                    }
                </GoogleMapView>
                <View style={{ position: 'absolute', top: 40, zIndex: 100, display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'space-between', paddingHorizontal: 16 }}>
                    {/* <Image source={require("../../assets/images/background_desc.jpg")} /> */}
                    <Pressable onPress={() => navigation.canGoBack && navigation.goBack()} style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                </View>

            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={fetchOrderDetail.isFetching} onRefresh={fetchOrderDetail.refetch} />} style={{ display: 'flex', marginBottom: 76, position: 'absolute', paddingHorizontal: 16, left: 0, right: 0, width: '100%', bottom: 0, height: Dimensions.get("window").height * 0.6, backgroundColor: 'white', flex: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} contentContainerStyle={{ alignItems: 'center', paddingTop: 24 }}>
                {fetchOrderDetail?.data?.payment_status !== 2 ? <View style={{ borderColor: 'rgb(44,76,6)', borderWidth: 2, borderRadius: 8, display: 'flex', backgroundColor: 'rgb(180,223,122)' }}>
                    <Text style={{ paddingHorizontal: 16, fontSize: 48, color: 'rgb(44,76,6)', paddingVertical: 12 }}>{fetchOrderDetail.data.check_code}</Text>
                </View> : <View>
                    {/* <Text style={{ fontSize: 24 }}>{fetchOrderDetail.data.payment_status_mean}</Text> */}
                    <Text style={{ fontSize: 24 }}>{'Refund Complete'}</Text>
                </View>}
                <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 24 }}>
                    <AntDesign name="checkcircle" size={18} color={config.primaryColor} style={{ marginRight: 6 }} />
                    <Text style={{ fontWeight: 500, fontSize: 13 }}>Please use the code to collect your surprise box later</Text>
                </Pressable>
                <View style={{ marginTop: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ wdith: '24%', alignItems: 'center' }}>
                        {
                            fetchOrderDetail.data.status === -1 ? <Image source={require("../../assets/images/purchased.png")} style={{ height: 45, width: 60 }} resizeMode="contain" /> :
                                <Image source={require("../../assets/images/m_purchase.png")} style={{ height: 45, width: 60 }} resizeMode="contain" />
                        }
                        <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 13 }}>Purchased</Text>
                    </View>
                    <View style={{ wdith: '24%', alignItems: 'center' }}>
                        {
                            fetchOrderDetail.data.status === 1 ? <Image source={require("../../assets/images/making.png")} style={{ height: 45, width: 60 }} resizeMode="contain" />
                                : <Image source={require("../../assets/images/m_shop.png")} style={{ height: 45, width: 60 }} resizeMode="contain" />

                        }
                        <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 13 }}>Preparing</Text>
                    </View>
                    <View style={{ wdith: '24%', alignItems: 'center' }}>
                        {
                            fetchOrderDetail.data.status === 4 ? <Image source={require("../../assets/images/meal.png")} style={{ height: 45, width: 60 }} resizeMode="contain" />
                                : <Image source={require("../../assets/images/m_meal.png")} style={{ height: 45, width: 60 }} resizeMode="contain" />
                        }
                        <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 13 }}>Ready</Text>
                    </View>
                    <View style={{ wdith: '24%', display: 'flex', alignItems: 'center' }}>
                        {
                            fetchOrderDetail.data.status === 3 ? <Image source={require("../../assets/images/complete.png")} style={{ height: 45, width: 60 }} resizeMode="contain" />
                                : <Image source={require("../../assets/images/m_complete.png")} style={{ height: 45, width: 60 }} resizeMode="contain" />
                        }
                        <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 13 }}>Completed</Text>
                    </View>
                </View>

                <View style={{ marginTop: 24, width: '100%' }}>
                    <Pressable onPress={() => selectStatus[1](true)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name="map-marker-alt" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{fetchOrderDetail.data.merchant.merchantaddress}</Text>
                    </Pressable>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <FontAwesome5 name="clock" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{fetchOrderDetail.data.businesshours}</Text>
                    </View>
                    <Pressable onPress={() => Linking.openURL(`tel:${fetchOrderDetail.data.merchant.mobile}`)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <FontAwesome5 name="phone" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{fetchOrderDetail.data.merchant.mobile}</Text>
                    </Pressable>
                </View>
                <View style={{ marginTop: 24, width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>OrderDetail</Text>
                    {
                        fetchOrderDetail.data.goods.map((item, index) =>
                            <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' }}>
                                <Image source={{ uri: item.cover_image }} style={{ borderRadius: 12, width: 75, height: 75, marginRight: 12 }} resizeMode="cover" />
                                <Text style={{ fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>×{item.count}</Text>
                                <Text style={{ fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>{config.current}{item.price}</Text>
                            </View>
                        )}

                </View>


            </ScrollView>
            <View style={{ paddingHorizontal: 16, paddingTop: 15 }}>
                {fetchOrderDetail?.data?.coupon_price !== "0.00" && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginTop: 'auto', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>coupon</Text>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>-{config.current}{fetchOrderDetail.data.coupon_price}</Text>
                </View>}
                <View style={{ display: 'flex', marginBottom: fetchOrderDetail?.data?.coupon_price !== "0.00" ? 24 : 36, flexDirection: 'row', alignItems: 'flex-end', marginTop: 'auto', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18 }}>Total</Text>
                    <Text style={{ fontSize: 24, fontWeight: '500' }}>{config.current}{fetchOrderDetail.data.payment_amount}</Text>
                </View>
            </View>
        </View>}


        {

            selectStatus[0] && <View style={{
                position: 'absolute', bottom: 0, left: 0,
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%',

            }}>

                <View style={{
                    marginBottom: 10,
                    backgroundColor: '#fff', padding: '5%', width: '90%', marginHorizontal: '5%', borderRadius: 10
                }}>
                    <Pressable onPress={() => urlScheme('ios')} style={{ padding: 10, paddingBottom: 20, borderRadius: 5, borderBottomColor: 'rgba(0,0,0,1)', borderBottomWidth: 0.3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>Open Apple Map</Text>
                        <MaterialIcons name="navigate-next" size={24} color="black" />
                    </Pressable>
                    <Pressable onPress={() => urlScheme('google')} style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>Open Google Map</Text>
                        <MaterialIcons name="navigate-next" size={24} color="black" /></Pressable>
                </View>


                <Pressable onPress={() => selectStatus[1](false)} style={{ padding: 10, marginBottom: 50, backgroundColor: '#000', padding: '5%', width: '90%', marginHorizontal: '5%', borderRadius: 10 }}><Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Cancel</Text></Pressable>
            </View>

        }

    </View>)
}