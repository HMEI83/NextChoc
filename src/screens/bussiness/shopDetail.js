import { AntDesign, Ionicons, Feather, Foundation, MaterialIcons, EvilIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { ImageBackground, Modal, View, Text, Image, ScrollView, Pressable, StatusBar, Dimensions, ActivityIndicator, PanResponder, Animated, Platform, TextInput, KeyboardAvoidingView } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import config from "../../common/config";
import RateModal from "../../components/RateModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { WebView } from 'react-native-webview';
import ShopAPI from "../../api/ShopAPI";
import { RefreshControl } from "react-native";
import OrderAPI from "../../api/OrderAPI";
import { useToken } from "../../common/store/user";
import StripePayment from "../Payment/StripePayment";
import { PlatformPayButton, PlatformPay, usePlatformPay, initStripe, isPlatformPaySupported } from '@stripe/stripe-react-native'
import { API_URL } from "../../common/api/API_URL";
import { navigationRef } from "../../common/utils";
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import LoginAPI from "../../api/LoginAPI";

export default function ShopDetail({ route }) {
    const token = useToken();
    const coupon = useRef();
    const selectStatus = useState(false);//地图选择状态
    const [gvisible, setGVisible] = useState(false);
    const navigation = useNavigation();
    const [url, setUrl] = useState("");
    const [visible, setVisible] = useState(false);
    const [modalItem, setModelItem] = useState({})
    const [bkvisible, setBKVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [p_visible, setP_visible] = useState(false);
    const [type, setType] = useState("");
    const [isUse, setIsUse] = useState(0);
    const height = useRef(new Animated.Value(200)).current;
    const [pos, setPos] = useState({
        latitude: -33.88788,
        longitude: 151.18824,
    });
    const [finalprice, setFinalPrice] = useState({
        payment_amount: 0,
        amount: 0,
    })
    const [coupon_code, setCoupon_code] = useState("");
    const previewImg = useState(false);//预览图片
    const [previewImgLoading, setPreviewImgLoading] = useState(true);//预览加载
    const [ratevisible, setRatevisible] = useState(false);
    const [goodsNumber, setGoodsNumber] = useState();
    const [favor, setFavor] = useState(false);
    const [content, setContent] = useState();
    const [flag, setFlag] = useState(true);
    const couponCanUse = useMutation({
        mutationFn: (data) => ShopAPI.CouponCanUse(data),
        mutationKey: ['couponCanUse'],
    })
    const useCouponse = (data) => {
        if (coupon_code.trim() === "") return;
        setFlag(false);
        couponCanUse.mutate({ goods: data, token, coupon_code }, {
            onSuccess: (res) => {
                // console.log(res);
                setIsUse(1);
                setFlag(false);
                // setPrice(res.amount);
                // setTotalPrice(res.payment_amount);
                setFinalPrice({ payment_amount: res.payment_amount, amount: res.amount });
                // Toast.show("Your have already use the coupon");
            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                setIsUse(2);
                setFlag(true);
            }
        })
    }
    const urlScheme = (mapName) => {
        // const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });

        const scheme = mapName === 'ios' ? 'maps://0,0?q=' : 'geo:0,0?q=';
        const latLng = `${pos.latitude},${pos.longitude}`;
        const label = `${fetchShopDetail?.data?.merchant?.merchant_name}`;
        const url = mapName === 'ios' ? `${scheme}${label}@${latLng}` : `comgooglemaps://?center=${latLng}&zoom=14&views=traffic&q=${label}`;

        Linking.openURL(url).catch((er) => {
            //console.log(er);
            //console.log(url)
            Toast.show('Map Not Found!')
        });
        selectStatus[1](false)
    }
    const increase = (index, item) => {
        // if(fetchShopDetail?.data?.merchant?.is_closed){
        //     Toast.show("Store closed");
        //     return;
        // }
        let res = goodsNumber;
        if (!res.length) return;
        //console.log("====")
        //console.log(item)
        //console.log(res[index])
        // //console.log(res[index].)
        if (res[index].count >= item.count) {
            Toast.show("Sold Out")
            return;
        }
        res[index].count++;
        // //////////console.log(index);
        setGoodsNumber([...res]);
        culTotalPrice()
    }
    const decrease = (index) => {
        let res = goodsNumber;
        if (!res.length) return;
        res[index].count--;
        setGoodsNumber([...res]);
        culTotalPrice()
    }
    const modalContent = (props) => {
        setVisible(true);
        setContent(<View style={{}}>
            <View style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 0 }}>
                <Image source={props.src} style={{ width: '100%', height: Dimensions.get('screen').width - 32, marginRight: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{props.title}</Text>
                    <Text style={{ fontSize: 16, marginTop: 12 }}>What's in the Box:</Text>
                    <Text numberOfLines={4} style={{ width: '100%', fontSize: 16, marginTop: 4 }}>{props.desc}</Text>
                </View>
            </View>
        </View>)
    }

    const { confirmPlatformPayPayment } = usePlatformPay();

    const culTotalPrice = () => {
        let totalPrice = 0; let p = 0;
        goodsNumber.map((item, index) => {
            totalPrice += item.count * item.discount_price;
            p += item.count * item.price;
        })
        //////////console.log(totalPrice);
        setPrice(p);
        setTotalPrice(totalPrice);
        setFinalPrice({ amount: p.toFixed(2), payment_amount: totalPrice.toFixed(2) })
    }


    useEffect(() => {
        //////////console.log(goodsNumber);
        return () => {
            fetchShopDetail.remove();
        }
    }, [])




    const fetchShopDetail = useQuery({
        queryFn: () => ShopAPI.fetchShopDetail({ merchant_id: route.params?.id, token }),
        queryKey: ['fetchShopDetail', route.params?.id],
        onSuccess: (res) => {
            console.log("------");
            console.log(res?.merchant?.is_closed);
            console.log(res?.merchant?.business_hours)
            setVisible(true);
            Animated.timing(height, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
            setPos({ latitude: res.merchant.lat, longitude: res.merchant.lng })
            setContent(<View style={{ marginBottom: 48, marginTop: 0, padding: 16 }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: 24, color: 'rgb(17,77,77)', paddingTop: 24 }}>Allergy warning</Text>
                <Text style={{ paddingHorizontal: 12, fontSize: 16, marginTop: 12 }}>{res.merchant.allergy_info}</Text>
                {/* <Text style={{ paddingHorizontal: 12, fontSize: 16, marginTop: 12 }}>i am a very very very very very very  very very  very very  very very  very very very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very i am a very very very very very very  very very  very very  very very  very very very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very i am a very very very very very very  very very  very very  very very  very very very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very  very very</Text> */}
            </View>)
            setFavor(res.merchant.is_favorite);
            let arr = [];
            res?.categories[0]?.goods.map((item, index) => {
                arr.push({ ...item, count: 0 })
            })
            //////////console.log(arr);
            setGoodsNumber(arr);
        },
        onError: (res) => {
            Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
        }
    })
    const collect = useMutation({
        mutationFn: () => ShopAPI.collectShop({ token, merchant_id: route.params?.id }),
        mutationKey: ['collect'],
    })
    const uncollect = useMutation({
        mutationFn: () => ShopAPI.uncollectShop({ token, merchant_id: route.params?.id }),
        mutationKey: ['uncollect'],
    })
    const CreateOrder = useMutation({

        mutationFn: (data) => OrderAPI.createOrder(data),
        mutationKey: ['CreateOrder'],
    })

    const clear = () => {
        setIsUse(0);
        setCoupon_code("");
        setFinalPrice({ amount: price.toFixed(2).toString(), payment_amount: totalPrice.toFixed(2).toString() })
        setFlag(true);
    }
    useEffect(() => {
        if (!p_visible) {
            setIsUse(0);
            setCoupon_code("");
            setFinalPrice({ amount: price, payment_amount: totalPrice })
            setFlag(true);
        }
    }, [p_visible])


    //获取支付密钥
    const fetchPaymentIntentClientSecret = async () => {
        // Fetch payment intent created on the server, see above
        //console.log(totalPrice);
        let formdata = new FormData();
        formdata.append("amount", finalprice.amount);
        formdata.append("goods", JSON.stringify(goodsNumber.filter((item, index) => item.count !== 0)));
        formdata.append("merchant_id", route.params.id);
        formdata.append("payment_type", 'stripe');
        formdata.append("payment_amount", finalprice.payment_amount);
        formdata.append("lang", "en");
        const response = await fetch(`${API_URL}/api/order/create`, {
            method: 'POST',
            headers: {
                "Content-type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            body: formdata
        });
        //url.payment_info.client_secret
        const res = (await response.json());
        setUrl(res);
        //console.log('res ：：：：：：：；')
        //console.log(res);
        if (res.code === 0) {
            return {
                status: false,
                msg: res.msg

            }
        }
        return {
            publishableKey: res.data.payment_info.publishable_key,
            clientSecret: res.data.payment_info.client_secret,
            status: res.code != 0,
            msg: res.msg,

            id: res.data.order_id

        }
    };


    //支付
    const pay = async (type) => {
        const { clientSecret, publishableKey, status, msg, id } = await fetchPaymentIntentClientSecret();
        if (!status) {
            alert(msg); return;
        }
        await initStripe({
            publishableKey: publishableKey,
            merchantIdentifier: "merchant.com.NextChoc",

        })
        const payConfig = {};
        let supportPay = await isPlatformPaySupported();
        //console.log('是否支持apple pay！')
        //console.log(supportPay)
        if (!supportPay) {
            setBKVisible(false);
            return Toast.show('Your device not support ' + (Platform.OS === 'android' ? 'GooglePay!' : 'ApplePay!'))
        }
        console.warn(supportPay);

        if (type === 'ios') {
            payConfig.applePay = {
                currencyCode: 'AUD',

                requiredShippingAddressFields: [
                    PlatformPay.ContactField.PostalAddress,
                ],
                requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
                merchantCountryCode: "AU",
                cartItems: [
                    {

                        paymentType: 'Immediate',
                        isPending: false,
                        label: 'Payment for the purchase of surprise box.',
                        amount: finalprice.payment_amount
                    }
                ]

            };
        } else {
            payConfig.googlePay = {


                merchantCountryCode: "AU",
                currencyCode: 'AUD',
                testEnv: __DEV__,
                billingAddressConfig: {
                    format: PlatformPay.BillingAddressFormat.Full,
                    // isPhoneNumberRequired: true,
                    // isRequired: true,
                },
            }

        }

        const { error } = await confirmPlatformPayPayment(
            clientSecret,
            payConfig
        );


        //console.log('pay finish!!!')
        if (error) {
            //console.log(payConfig)
            console.warn(error);
            setBKVisible(false);
            clear();
            Toast.show(error.localizedMessage)
            // alert(error?.message);
            // Update UI to prompt user to retry payment (and possibly another payment method)
            return;
        }
        // alert('Success', 'The payment was confirmed successfully.');
        navigation.navigate("Bussiness.orderStatus", { id });


    };
    useEffect(() => {
        //console.log("==============");
        //console.log(finalprice);
    }, [finalprice])
    const defaultPosition = Dimensions.get('screen').height * 0.5;//默认面板高度
    const scroll = useRef(new Animated.Value(0)).current
    const panResponder =
        PanResponder.create({
            onPanResponderGrant: () => {

            },
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderMove: (evt, gestureState) => {

                if (gestureState.dy < 0) {
                    return;
                }
                Animated.timing(scroll, {
                    toValue: gestureState.dy,
                    duration: 1,
                    useNativeDriver: true,
                }).start();

            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy < 0) return;
                //中部向下滑动
                if (gestureState.moveY > defaultPosition) {
                    //滑动到最小化
                    Animated.timing(scroll, {
                        toValue: Dimensions.get('screen').height,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => setVisible(false));

                }

            }, onPanResponderTerminate: (evt, gestureState) => {
            },
            onShouldBlockNativeResponder: (evt, gestureState) => false,
        });



    return (<View style={{ position: 'relative', flex: 1, overflow: 'hidden', marginTop: fetchShopDetail.isLoading ? 50 : 0 }}>
        {fetchShopDetail.isFetching ? <ActivityIndicator style={{ marignTop: 150 }} size={'large'} color={config.primaryColor} /> :
            (fetchShopDetail.isSuccess && <>
                <ImageBackground source={{ uri: fetchShopDetail.data.merchant.logo_format }} style={{ height: Dimensions.get("window").height * 0.3, backgroundColor: 'rgb(0,0,0,0.4)' }}>

                    <View style={{ marginTop: Dimensions.get("window").height * 0.08, paddingHorizontal: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Pressable onPress={() => { navigation.goBack() }} style={{ width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="arrow-back" size={30} color={'#fff'} />
                        </Pressable>
                        {
                            favor ? <Pressable style={{ width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 80, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                ////console.log("123");
                                uncollect.mutate(null, {
                                    onSuccess: (res) => {
                                        //////console.log(res);
                                        setFavor(false);
                                    },
                                    onError: (res) => {
                                        // Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                                    }
                                })
                            }}><AntDesign name="heart" size={24} color={'tomato'} /></Pressable> : <Pressable
                                style={{ width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    //////console.log("234");
                                    collect.mutate(null, {
                                        onSuccess: (res) => {
                                            setFavor(true);
                                            //////console.log(res);
                                        },
                                        onError: (res) => {
                                            // Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                                        }
                                    })
                                }}
                            ><AntDesign name="hearto" size={24} color={"white"} /></Pressable>
                        }
                    </View>
                    <Pressable onPress={() => previewImg[1](true)} style={{ width: '100%', height: Dimensions.get("window").height * 0.3 }}>

                    </Pressable>
                </ImageBackground>
                <View style={{ position: 'absolute', display: 'flex', width: '100%', left: 0, right: 0, bottom: 0, backgroundColor: 'white', height: Dimensions.get("window").height * 0.7, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <View style={{ backgroundColor: 'white', display: 'flex', flex: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 16 }}>
                        <View style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text numberOfLines={2} style={{ fontSize: 24, fontWeight: 'bold', width: '80%', display: 'flex', flexWrap: 'wrap' }}>{fetchShopDetail.data.merchant.merchant_name ?? "empty"}</Text>
                            {<Pressable onPress={() => {
                                setRatevisible(true);
                            }} style={{ width: 60, height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 50 }}>
                                <AntDesign name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 4 }} />
                                <Text style={{ color: 'gray' }}>{fetchShopDetail.data.merchant.score === 0 ? '4.5' : fetchShopDetail.data.merchant.score}</Text>
                            </Pressable>}
                        </View>
                        {fetchShopDetail.data?.categories.length && <View style={{ display: 'flex', flexDirection: 'row', alignItem: 'center', justifyContent: 'flex-start', marginTop: 8 }}>
                            <View style={{ backgroundColor: '#cef23f', borderRadius: 24 }}>
                                <Text style={{ paddingHorizontal: 8, paddingVertical: 4, }}>{fetchShopDetail.data.merchant?.merchant_category_name}</Text>
                            </View>
                        </View>}
                        <View style={{}}>
                            <Pressable onPress={() => selectStatus[1](true)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                <View style={{ width: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome5 name="map-marker-alt" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                                </View>
                                <View style={{ display: 'flex', justifyContent: 'center', flex: 1, borderBottomColor: 'black' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{fetchShopDetail?.data?.merchant?.merchant_address ?? "No information available at the moment"}</Text>
                                </View>
                            </Pressable>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                <View style={{ width: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome5 name="clock" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                                </View>
                                <View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', flex: 1, borderBottomColor: 'black' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{fetchShopDetail?.data?.merchant?.business_hours ?? "9:00-18:00"}</Text>
                                    <Text>(For same-day pickup only)</Text>
                                </View>

                            </View>
                            {fetchShopDetail.data?.merchant?.mobile && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                <View style={{ width: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome5 name="phone" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                                </View>
                                <Pressable onPress={() => Linking.openURL(`tel:${fetchShopDetail.data.merchant.mobile}`)} style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{fetchShopDetail?.data?.merchant?.mobile ?? "No information available at the moment"}</Text>
                                </Pressable>
                            </View>}
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'white',marginTop: 36 }}>
                            <ScrollView contentContainerStyle={{  }} style={{ }}>
                                {
                                    !!fetchShopDetail.data?.categories.length && !!fetchShopDetail.data.categories[0]?.goods?.length ? fetchShopDetail.data?.categories[0]?.goods.map((item, index) => {
                                        return (<View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                            <Pressable onPress={() => {
                                                // modalContent({ src: { uri: item.cover_image }, title: item.goods_name, desc: item.description });
                                                setGVisible(true);
                                                setModelItem(item);
                                            }}>
                                                <Image source={{ uri: item.cover_image }} style={{ borderRadius: 12, width: 75, height: 75, marginRight: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 0.3, borderColor: 'rgba(0,0,0,0.1)' }} resizeMode="cover" />
                                            </Pressable>
                                            <View>
                                                <Text>{item.goods_name}</Text>
                                                <View style={{ display: 'flex', marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Feather name="shopping-bag" size={16} color="rgba(0,0,0,0.1)" />
                                                    <Text style={{ color: "rgba(0,0,0,0.1)" }}>{item.count}</Text>
                                                </View>
                                                <View style={{ display: 'flex', marginTop: 8, flexDirection: 'row' }}>
                                                    <Text style={{ textDecorationLine: 'line-through', color: 'rgba(0,0,0,0.2)', marginRight: 4 }}>{config.current}{item.price}</Text>
                                                    <Text style={{ color: config.primaryColor }}>{config.current}{item.discount_price}</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginLeft: 'auto' }}>
                                                {
                                                    goodsNumber?.length && goodsNumber[index].count ? <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <Pressable onPress={() => decrease(index)} style={{ width: 25, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, color: 'black', backgroundColor: 'rgba(0,0,0,0.1)' }}><Text>-</Text></Pressable>
                                                        <Text style={{ minWidth: 20, textAlign: 'center' }}>{goodsNumber[index].count}</Text>
                                                        <Pressable onPress={() => increase(index, item)} style={{ width: 25, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: config.primaryColor }}>
                                                            <Text style={{ color: 'white', }}>+</Text>
                                                        </Pressable>
                                                    </View> : <Pressable onPress={() => increase(index, item)} style={{ width: 25, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: config.primaryColor }}>
                                                        <Text style={{ color: 'white' }}>+</Text>
                                                    </Pressable>
                                                }
                                            </View>
                                        </View>)
                                    }) : <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name="md-cart-outline" size={80} color="black" />
                                        <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 24 }}>No Goods Yet</Text>
                                    </View>
                                }
                            </ScrollView>
                        </View>

                        {
                            !fetchShopDetail?.data?.merchant?.is_closed && <Pressable onPress={() => {
                                const res = goodsNumber.filter((item, index) => item.count !== 0);
                                if (!token) {
                                    return navigationRef.navigate('SignIn.LoginWithPhone')
                                }
                                if (totalPrice !== 0 && res.length) {
                                    setBKVisible(true)
                                }



                            }} style={{ height: 55, marginTop: 'auto', marginBottom: 12, paddingTop: 12, borderTopColor: 'rgba(0,0,0,0.1)', borderTopWidth: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}><Text style={{ fontSize: 16, marginRight: 4 }}>Order:</Text><Text style={{ color: config.primaryColor, fontSize: 24 }}>{config.current}{(totalPrice * 1).toFixed(2)}</Text></View>
                                <View style={{ paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, backgroundColor: config.primaryColor, borderRadius: 24 }} ><Text style={{ color: 'white' }}>Payment</Text></View>
                            </Pressable>

                        }
                    </View>
                    {!!fetchShopDetail?.data?.merchant?.is_closed && <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0, height: 50, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 18, paddingVertical: 12, borderRadius: 4 }}>Closed</Text>
                    </View>}
                </View>
            </>)}
        <Modal statusBarTranslucent visible={bkvisible} onDismiss={() => setBKVisible(false)} transparent={true}>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                {/* <StatusBar backgroundColor={'rgba(0,0,0,0.6)'}/> */}
                {/* <KeyboardAvoidingView enabled={true} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ display: 'flex', flex: 1 }}> */}
                {/* <View style={{display:'flex',flex:1}}></View> */}

                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingBottom: 160, paddingHorizontal: 8 }}>
                    <Pressable onPress={() => { setBKVisible(false); clear(); }} style={{ marginVertical: 12, width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <View style={{ borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 0.4, paddingBottom: isUse ? 8 : 22, marginHorizontal: '5%' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <Pressable onPress={() => coupon.current.focus()} style={{ height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 4, marginRight: 12, width: '70%' }}>
                                <TextInput ref={coupon} editable={flag} value={coupon_code} onChangeText={setCoupon_code} placeholder="Coupon Code"></TextInput>
                            </Pressable>
                            {isUse === 1 ? <Pressable onPress={() => {
                                clear()
                            }} style={{ paddingHorizontal: 8, backgroundColor: config.primaryColor, height: 50, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <Text style={{ color: 'white', paddingHorizontal: 4, fontWeight: 'bold' }}>Cancel</Text>
                            </Pressable>
                                :
                                <Pressable onPress={() => useCouponse(goodsNumber.filter((item, index) => item.count !== 0))} style={{ paddingHorizontal: 8, backgroundColor: config.primaryColor, height: 50, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <Text style={{ color: 'white', paddingHorizontal: 4, fontWeight: 'bold' }}>Apply</Text>
                                </Pressable>}
                        </View>
                        {
                            isUse === 1 && <Text style={{ marginVertical: 4, fontSize: 14, color: 'rgba(0,0,0,0.4)' }}>Successfully used</Text>
                        }
                        {
                            isUse === 2 && <Text style={{ marginVertical: 4, fontSize: 14, color: 'tomato' }}>{couponCanUse?.error?.message}</Text>
                        }
                    </View>
                    {/* <PlatformPayButton
                        type={PlatformPay.ButtonType.Pay}
                        onPress={() => pay(Platform.OS)}
                        appearance={PlatformPay.ButtonStyle.Automatic}
                        style={{
                            // width: Platform.OS === 'android' ? '92%' : '90%',
                            // marginHorizontal: Platform.OS === 'android' ? '4%' : '5%',
                            // // paddingVertical:0,
                            height: Platform.OS === 'android' ? 60 : 50,
                            marginTop: 24
                        }}
                    /> */}
                    {/* <Pressable onPress={() => {
                        if (!token) {
                            return navigationRef.navigate('SignIn.LoginWithPhone')
                        }
                        setType("stripe");
                        setLoading(true);
                        setBKVisible(false);
                        CreateOrder.mutate({ merchant_id: route.params.id, payment_type: 'stripe', amount: finalprice.amount, payment_amount: finalprice.payment_amount, goods: goodsNumber.filter((item, index) => item.count !== 0), token, coupon_code: isUse === 1 ? coupon_code : "" }, {
                            onSuccess: (res) => {
                                setLoading(false);
                                setUrl(res);
                    
                                setP_visible(true);
                            },
                            onError: (res) => {
                                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                            }
                        })
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '98%', marginHorizontal: '1%', justifyContent: 'center', backgroundColor: '#6837ff', lineHeight: 50, borderRadius: 4, marginTop: 24, height: 50, boxShadowOffset: { x: 2, y: 2 }, boxShadowColor: 'rgba(0,0,0,0.2)', elevation: 3, }}>
                        <MaterialIcons size={30} color={'#fff'} name='credit-card' />
                        <Text style={{ fontSize: 28, textAlign: 'center', color: '#fff', marginLeft: 12, fontWeight: '500' }}>Credit Card</Text>
                    </Pressable> */}
                    {/* <Pressable onPress={() => {

                        if (!token) {
                            return navigationRef.navigate('SignIn.LoginWithPhone')
                        }
                        setType("paypal");
                        //console.log(totalPrice);
                        setLoading(true);
                        setBKVisible(false);
                        CreateOrder.mutate({ merchant_id: route.params.id, payment_type: 'paypal', amount: finalprice.amount, payment_amount: finalprice.payment_amount, goods: goodsNumber.filter((item, index) => item.count !== 0), token, coupon_code: isUse === 1 ? coupon_code : "" }, {
                            onSuccess: (res) => {
                                setLoading(false);
                                setUrl(res);
                                setP_visible(true);
                            },
                            onError: (res) => {
                                //////////console.log(res);
                                setP_visible(false);
                                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                            }
                        })
                        // setBKVisible(false);
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '98%', marginHorizontal: '1%', justifyContent: 'center', backgroundColor: '#6495ED', lineHeight: 50, borderRadius: 4, marginTop: 24, boxShadowOffset: { x: 2, y: 2 }, boxShadowColor: 'rgba(0,0,0,0.2)', elevation: 3, height: 50 }}>
                        <Text style={{ fontSize: 28, textAlign: 'center', color: '#fff', fontWeight: '500' }}>Pay with</Text>
                        <FontAwesome5 size={30} color={'#fff'} style={{ marginLeft: 12 }} name='paypal' />
                        <Text style={{ fontSize: 28, textAlign: 'center', color: '#fff', marginLeft: 12, fontWeight: '500' }}>Paypal</Text>

                    </Pressable> */}
                    <Pressable onPress={() => pay(Platform.OS)} style={{ marginTop: 12, marginHorizontal: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0,0,0,0.1)', paddingBottom: 16, borderBottomWidth: 0.5 }}>
                        {<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Platform.OS === "ios" ? require("../../assets/images/apple-pay.png") : require('../../assets/images/G_pay.png')} style={{ height: 30, width: 60, marginRight: 12 }} resizeMode="contain" />
                            <Text>{Platform.OS === "ios" ? "Apple Pay" : "Google Pay"}</Text>
                        </View>}
                        <Ionicons name="arrow-forward" size={16} style={{ lineHeight: 30 }} color="black" />
                    </Pressable>
                    <Pressable onPress={() => {
                        if (!token) {
                            return navigationRef.navigate('SignIn.LoginWithPhone')
                        }
                        setType("paypal");
                        //console.log(totalPrice);
                        setLoading(true);
                        setBKVisible(false);
                        CreateOrder.mutate({ merchant_id: route.params.id, payment_type: 'paypal', amount: finalprice.amount, payment_amount: finalprice.payment_amount, goods: goodsNumber.filter((item, index) => item.count !== 0), token, coupon_code: isUse === 1 ? coupon_code : "" }, {
                            onSuccess: (res) => {
                                setLoading(false);
                                setUrl(res);
                                setP_visible(true);
                            },
                            onError: (res) => {
                                //////////console.log(res);
                                setP_visible(false);
                                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                            }
                        })
                        // setBKVisible(false);
                    }} style={{ marginTop: 12, marginHorizontal: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0,0,0,0.1)', paddingBottom: 12, borderBottomWidth: 0.5 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{display:'flex',width:60,height:30,alignItems:'center',justifyContent:'center'}}>
                            <FontAwesome5 name="paypal" style={{marginRight:12}} size={30} color='rgba(0,0,0,0.7)' /></View>
                            <Text>Paypal</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={16} style={{ lineHeight: 30 }} color="black" />
                    </Pressable>
                    <Pressable onPress={() => {
                        if (!token) {
                            return navigationRef.navigate('SignIn.LoginWithPhone')
                        }
                        setType("stripe");
                        setLoading(true);
                        setBKVisible(false);
                        CreateOrder.mutate({ merchant_id: route.params.id, payment_type: 'stripe', amount: finalprice.amount, payment_amount: finalprice.payment_amount, goods: goodsNumber.filter((item, index) => item.count !== 0), token, coupon_code: isUse === 1 ? coupon_code : "" }, {
                            onSuccess: (res) => {
                                setLoading(false);
                                setUrl(res);

                                setP_visible(true);
                            },
                            onError: (res) => {
                                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                            }
                        })
                    }} style={{ marginTop: 12, marginHorizontal: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0,0,0,0.1)', paddingBottom: 12, borderBottomWidth: 0.5 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{display:'flex',width:60,height:30,alignItems:'center',justifyContent:'center'}}>
                            <AntDesign name="creditcard" style={{marginRight:12}} size={25} color='rgba(0,0,0,0.7)' /></View>
                            <Text>Credit Card</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={16} style={{ lineHeight: 30 }} color="black" />
                    </Pressable>








                </View>
                {/* </KeyboardAvoidingView> */}
            </View>
        </Modal>
        {/**商品详情 */}
        <Modal statusBarTranslucent visible={gvisible} onDismiss={() => setGVisible(false)} transparent={true}>
            <BlurView tint="dark" intensity={10} style={{ display: 'flex', flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }} >
                <View style={{ display: 'flex', flex: 1 }}>
                    <Pressable onPress={() => setGVisible(false)} style={{ display: 'flex', flex: 1 }}>
                    </Pressable>
                    <View style={{ display: 'flex', flexDirection: 'row', height: 400 }}>
                        <Pressable onPress={() => setGVisible(false)} style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        </Pressable>
                        <View style={{ width: 300, height: 400, backgroundColor: 'white', borderRadius: 24 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Image source={{ uri: modalItem?.cover_image }} style={{ width: '100%', height: 200, borderTopLeftRadius: 24, borderTopRightRadius: 24 }} resizeMode="cover" />
                                <View style={{ padding: 16 }}>
                                    <Text style={{ textAlign: 'center', marginBottom: 12, fontSize: 18, fontWeight: 500 }}>
                                        {modalItem?.goods_name}
                                    </Text>
                                    <Text style={{}}> {modalItem?.description}</Text>
                                    {/* <Text>122222222222222222312412414444444444444434245454252461222222222222222223124124144444444444444342454542524612222222222222222231241241444444444444443424545425246122222222222222222312412414444444444444434245454252461222222222222222223124124144444444444444342454542524612222222222222222231241241444444444444443424545425246122222222222222222312412414444444444444434245454252461222222222222222223124124144444444444444342454542524612222222222222222231241241444444444444443424545425246122222222222222222312412414444444444444434245454252461222222222222222223124124144444444444444342454542524612222222222222222231241241444444444444443424545425246</Text> */}
                                </View>
                            </ScrollView>
                        </View>
                        <Pressable onPress={() => setGVisible(false)} style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        </Pressable>
                    </View>
                    <Pressable onPress={() => setGVisible(false)} style={{ display: 'flex', flex: 1 }}>
                    </Pressable>
                </View>

            </BlurView>
        </Modal>

        {/** 过敏信息 */}

        <Modal statusBarTranslucent visible={visible} onRequestClose={() => { setVisible(false); clear(); }} transparent={true}>
            <BlurView tint="dark" intensity={10} style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' }} >

                <Animated.View style={{
                    height: Dimensions.get('screen').height * 0.5
                    , position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%',
                    transform: [{ translateY: scroll }],
                    backgroundColor: 'rgb(251,248,241)', padding: 8,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
                    <View
                        {...panResponder.panHandlers}

                        style={{
                            width: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            borderBottomColor: 'rgba(0,0,0,0.1)',
                            borderBottomWidth: 0.2,
                            paddingBottom: 14,
                            paddingTop: 6
                        }}>
                        <View style={{ height: 6, width: 50, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10 }}></View>

                    </View>
                    <ScrollView >
                        {content}
                    </ScrollView>

                </Animated.View>
            </BlurView>
        </Modal>




        <RateModal visible={ratevisible} onExit={() => setRatevisible(false)} token={token} id={route.params.id} />


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

        {/* 图片放大 */}
        {
            fetchShopDetail.isSuccess && previewImg[0] &&
            <View style={{ "position": "absolute", width: '100%', height: '100%', backgroundColor: '#000', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>


                <Pressable onPress={() => {
                    previewImg[1](false);
                    setPreviewImgLoading(true);
                }} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                    <Image onLoadEnd={() => setPreviewImgLoading(false)} style={{ width: '100%', height: 300, borderRadius: 5, alignSelf: 'center' }} resizeMode="contain" source={{ uri: fetchShopDetail.data.merchant.logo_format }} />
                    {previewImgLoading ? <ActivityIndicator style={{ position: 'absolute', left: '50%', right: '50%', top: '50%', zIndex: 999 }} size={'large'} /> : null}
                </Pressable>
                {previewImgLoading[0] && <View style={{ position: 'relative' }}><ActivityIndicator style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }} size={'large'} /></View>}
            </View>}


        {/**支付 */}
        <Modal visible={p_visible} onRequestClose={() => setP_visible(false)} transparent={true} animationType="slide">
            <StatusBar backgroundColor={'rgba(0,0,0,0.6)'} />
            <View style={{ display: 'flex', flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <Pressable onPress={() => { setP_visible(false); clear(); Toast.show("Payment interruption") }} style={{ marginVertical: 12, width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    {
                        type === "paypal" && <View style={{ height: 500, display: 'flex' }}>
                            {
                                loading ?
                                    <ActivityIndicator size={'large'} color={config.primaryColor} /> :
                                    <WebView
                                        style={{ flex: 1 }}
                                        source={{ uri: url?.payment_info?.approval_url }}
                                        onNavigationStateChange={(navState) => {
                                            ////console.log(navState);
                                            if (navState.url.includes("success=true")) {
                                                setP_visible(false);
                                                clear();
                                                navigation.navigate("Bussiness.orderStatus", { id: url.order_id });
                                            } else if (navState.url.includes("success=false")) {
                                                setP_visible(false);
                                                Toast.show("Payment failed");
                                                clear();
                                            }

                                        }}
                                    >
                                    </WebView>
                                // <Text>{url?.payment_info?.approval_url}</Text>
                            }
                        </View>}
                    {
                        type === "stripe" &&
                        (
                            url?.payment_info?.publishable_key &&
                            <StripePayment
                                payFailed={() => {
                                    setP_visible(false);
                                    // Toast.show("pay fail");
                                    clear();
                                }}
                                payFinish={() => {
                                    setP_visible(false);
                                    clear();
                                    navigation.navigate("Bussiness.orderStatus", { id: url.order_id });
                                }}
                                client_secret={url.payment_info.client_secret}
                                publishableKey={url.payment_info.publishable_key}
                                payment_amount={finalprice.payment_amount}
                            />
                        )
                    }
                </View>
            </View>
        </Modal>
    </View>)
}