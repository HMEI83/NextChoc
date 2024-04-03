

import * as StoreReview from 'expo-store-review'
import { FontAwesome, MaterialIcons, AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo, Fontisto } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Pressable, ScrollView, Text, View, Switch, Linking, Dimensions, Image, Platform } from "react-native"
import ProfileSetting from "./ProfileSetting";
import LoginSettting from "./LoginSetting";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import config from '../../common/config';
import { useCommonActions, useToken, useUser } from '../../common/store/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoginAPI from '../../api/LoginAPI';
import Contansts from 'expo-constants';
import { useRefreshOnFocus } from '../../common/hooks/useRefreshOnFocus';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
export default function AccountSetting() {
    const [basemess, setBasemess] = useState(false);
    const user = useUser();
    const token = useToken();
    const setUser = useCommonActions().setUser;
    const logout = useCommonActions().logout;
    //    //console.log(Contansts.expoConfig.version);
    const fetchBaseMess = useQuery({
        queryFn: () => LoginAPI.fetchBaseMess({ token }),
        queryKey: ['fetchBaseMess'],
        enabled: !!token,
        onSuccess: (res) => {
            // console.log(res);
            setUser(res);
        }
    })
    const backlogout = useMutation({
        mutationFn: () => LoginAPI.logout({ token }),
        mutationKey: ['backLogout'],
    })
    const toLogout = () => {
        backlogout.mutate(null, {
            onSuccess: (res) => {
                console.log(res);
            },
            onError: (res) => {
                console.log(res);
            }
        })
    }
    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
        }
    };
    const fetchVersion = useQuery({
        queryFn: () => LoginAPI.fetchVersion({ platform: Platform.OS, version: Contansts.expoConfig.version }),
        queryKey: ['fetchVersion'],
        onSuccess: (res) => {
            // //console.log(res);

        }
    })
    useEffect(() => {
        //清除状态
        navigation.addListener("blur", () => {
            setBasemess(false);
            // setNotification(false)
        })





    }, [])

    const navigation = useNavigation();
    return (<View style={{ backgroundColor: basemess ? "white" : 'rgb(248,248,248)' }}>
        {!basemess && <ScrollView style={{ marginTop: 0, paddingHorizontal: 16, paddingBottom: token ? 50 : 0, height: token ? 'auto' : '100%' }} >
            {
                token ?
                    <>
                        <View style={{ display: 'flex', borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10, backgroundColor: '#fff', padding: 10 }}>
                            <Image source={require("../../assets/images/icon.png")} defaultSource={require("../../assets/images/icon.png")} style={{ width: 70, height: 70, borderRadius: 10, marginRight: 24 }} />
                            <View>
                                <Text style={{ fontSize: 24 }}>
                                    {user.nickname !== "" ? user.nickname : user.email.split("@")[0]}
                                </Text>
                                <Pressable onPress={() => navigation.navigate('Account.profile')} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: config.primaryColor, width: 105, paddingHorizontal: 15, paddingVertical: 2, borderRadius: 20 }}>
                                    <Text style={{ color: '#fff', fontSize: 12 }}>Edit Profile</Text>
                                    <MaterialIcons name="navigate-next" size={20} color="#fff" />
                                </Pressable>
                            </View>

                        </View>
                        <Text style={{ padding: 12, borderRadius: 12, marginTop: 0, color: "rgba(0,0,0,0.7)", fontWeight: 600, }}>User Center</Text>
                        <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, marginTop: 0 }}>
                            <Pressable onPress={() => token && navigation.navigate("Account.favorlist")} style={{ display: 'flex', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome name="heart-o" size={24} color="rgba(0,0,0,0.7)" />
                                </View>
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={{ marginTop: 4, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>Favorites</Text>
                                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Your favorite list</Text>
                                </View>
                                <View style={{ marginLeft: 'auto' }}>
                                    <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => token && navigation.navigate("Order")} style={{ display: 'flex', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Fontisto name="file-1" size={24} color={'rgba(0,0,0,0.7)'} />
                                </View>
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={{ marginTop: 4, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>Orders</Text>
                                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Your order list</Text>
                                </View>
                                <View style={{ marginLeft: 'auto' }}>
                                    <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => token && navigation.navigate("Account.Card")} style={{ display: 'flex', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <Fontisto name="file-1" size={24} color={'rgba(0,0,0,0.7)'} /> */}
                                    <AntDesign name="creditcard" size={24} color='rgba(0,0,0,0.7)' />
                                </View>
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={{ marginTop: 4, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>Wallets</Text>
                                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Your card list</Text>
                                </View>
                                <View style={{ marginLeft: 'auto' }}>
                                    <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => navigation.navigate("Account.WebPage", { type: "Promo Codes", url: "https://nextchoc.com.au/coupons" })}
                                style={{ display: 'flex', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome name="gift" size={24} color={'rgba(0,0,0,0.7)'} />
                                </View>
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={{ marginTop: 4, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>Promo Codes</Text>
                                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Unlock exclusive discounts</Text>
                                </View>
                                <View style={{ marginLeft: 'auto' }}>
                                    <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => {
                                if (token) {
                                    // setNotification(true);
                                    navigation.navigate('Account.push')
                                } else {
                                    navigation.navigate('SignIn.LoginWithPhone');
                                }

                            }} style={{ display: 'flex', paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="toggle-switch" size={24} color="rgba(0,0,0,0.7)" />
                                </View>
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.7)' }}>Push Preferences</Text>
                                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Stay updated</Text>
                                </View>
                                <View style={{ marginLeft: 'auto' }}>
                                    <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                                </View>
                            </Pressable>
                        </View>
                    </>
                    : <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }} onPress={() => navigation.navigate("SignIn.LoginWithPhone")}>

                        <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#000', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, alignItems: 'center', width: '70%', marginLeft: '15%', justifyContent: 'center', marginTop: 40 }}>

                            <Text style={{ fontSize: 16, color: '#fff' }}>Login</Text>
                            <MaterialIcons name="login" size={24} color="#ffffff" style={{ marginLeft: 10 }} />
                        </View></Pressable>
            }
            {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8, paddingBottom: 12, borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 0.5 }}>
                <Pressable onPress={() => token&&navigation.navigate("Account.favorlist")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="heart-o" size={35} color="black" />
                    </View>
                    <Text style={{ marginTop: 4, fontWeight: 600 }}>Favorites</Text>
                </Pressable>

                <Pressable onPress={() =>  token&&navigation.navigate("Order")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 35, height: 35 }} source={require("../../assets/images/order.png")} />
                    <Text style={{ marginTop: 4, fontWeight: 600 }}>Orders</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Account.WebPage", { type: "Suggest a restaurants", url: "https://nextchoc.com.au/suggest-restaurants" })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Entypo name="shop" size={35} color="black" />
                    </View>
                    <Text style={{ marginTop: 4, fontWeight: 600 }}>Restaurant</Text>
                </Pressable>
                <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/join-us")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 40, height: 40, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="handshake-o" size={35} color="black" />
                    </View>
                    <Text style={{ marginTop: 4, fontWeight: 600 }}>Join us</Text>
                </Pressable>
            </View> */}
            {/* {token &&} */}

            <Text style={{ padding: 12, borderRadius: 12, marginTop: 6, color: "rgba(0,0,0,0.7)", fontWeight: 600, }}>Give Us Feedback</Text>

            <View style={{ marginTop: 0, backgroundColor: 'white', padding: 12, borderRadius: 12 }}>
                <Pressable onPress={() => navigation.navigate("Account.WebPage", { type: "Chat with us", url: "https://nextchoc.com.au/contact-us" })} style={{ display: 'flex', paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="chatbox-ellipses-outline" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}>Chat With Us</Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Instant Support, always Here!</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Account.WebPage", { type: "Suggest a restaurants", url: "https://nextchoc.com.au/suggest-restaurants" })} style={{ display: 'flex', paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
                    <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Entypo name="shop" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}>Suggest a Restaurant</Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Surprises await</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Account.WebPage", { type: "Join Us", url: "https://nextchoc.com.au/join-us" })} style={{ display: 'flex', paddingBottom: 12, flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
                    <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="handshake-o" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}>Join us</Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Be our ally</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                </Pressable>



            </View>
            <Text style={{ padding: 12, borderRadius: 12, marginTop: 6, color: "rgba(0,0,0,0.7)", fontWeight: 600, }}>About NextChoc</Text>


            <View style={{ marginTop: 0, backgroundColor: 'white', padding: 12, borderRadius: 12 }}>

                <Pressable onPress={() => navigation.navigate("Account.FAQ")} style={{ display: 'flex', paddingBottom: 12, flexDirection: 'row', marginTop: 12, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', }}>
                    <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="questioncircleo" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}>F&Q</Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Frequently asked questions</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                </Pressable>

                <Pressable onPress={async () => {
                    if (await StoreReview.isAvailableAsync()) {
                        await StoreReview.requestReview()
                    } else {
                        Platform.OS === 'ios' && Linking.openURL("https://apps.apple.com/us/app/nextchoc/id6461417297");
                    }

                }} style={{ display: 'flex', paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
                    <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign color={'rgba(0,0,0,0.7)'} name="star" size={24} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}>Rate us</Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Rate us on store</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Account.WebPage", { type: "Privacy Policy", url: "https://nextchoc.com.au/privacy-policy/" })} style={{ display: 'flex', paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
                    <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="policy" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}>Privacy Policy</Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>Your data, you control</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Aboutus")} style={{ display: 'flex', paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name="book" size={24} color="rgba(0,0,0,0.7)" />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}>About us</Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>More information about us</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                    </View>

                </Pressable>
            </View>
            {
                token ? <View style={{ backgroundColor: 'white', marginTop: 24, borderRadius: 12, padding: 12 }}>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable onPress={() => { signOut(); logout(); toLogout(); }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="logout" size={24} color="rgba(0,0,0,0.7)" />
                            </View>
                            <View style={{ marginLeft: 12 }}>
                                <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.7)", fontWeight: 600, }}>Logout</Text>
                            </View>
                            <View style={{ marginLeft: 'auto' }}>
                                <MaterialIcons name="navigate-next" size={24} color="rgba(0,0,0,0.7)" />
                            </View></Pressable>
                    </View>

                </View> : null

            }
            <Text style={{ textAlign: 'center', marginTop: 12, color: 'rgba(0,0,0,0.4)', marginBottom: 32 }}>
                version {Contansts.expoConfig.version}
            </Text>
        </ScrollView>}


    </View>)
}