import { Image, Pressable, Text, TextInput, ScrollView, View, RefreshControl, ActivityIndicator, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native";
import MapView from 'react-native-maps'
import { useEffect, useState } from "react";
import { AntDesign, Octicons, Ionicons, EvilIcons } from "@expo/vector-icons";
import config from "../../common/config";
import useThrottle from "../../common/hooks/useThrottle";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import ShopAPI from "../../api/ShopAPI";
import * as Linking from 'expo-linking'
import HomeAPI from "../../api/HomeAPI";
import { useToken } from "../../common/store/user";
const type = {
    "Last Minute": "last_minutes",
    "Most popular": "most_popular",
    "Best": "best",
    "Lunch": "lunch",
    "Super markets": "super_marker",
    "Favorite": "favorite",
    "Recommended for you": "recommended_for_your",
    "Nearby": "near_by",
}
export default function SearchPage({ route }) {
    // let navigation = useNavigation();
    //////console.log(route);
    const token = useToken();
    const [banner, setBanner] = useState(null);
    const [page, setPages] = useState(1);
    const loading = useState(true);
    const navigation = useNavigation();
    const [key, setKey] = useState(route.params.key);
    const [bannerData, setBannerData] = useState();
    const [keywords, setKeywords] = useState("");

    const fetchShopList = useInfiniteQuery({
        queryFn: ({ pageParam = 1 }) => HomeAPI.fetchShopList({ sort_type: type[key], keywords, listRows: 5, page: pageParam, token }),
        queryKey: ['fetchShopList', type[key], keywords],
        getNextPageParam: (_d, pages) => {
            return _d.current_page + 1 > _d.last_page ? false : _d.current_page + 1;
        },
        onSuccess: (res) => {
            console.log("===");
            loading[1](false);
            // console.log(res.pages[0].banner.cover_image);
            // setBanner(res.pages[0].banner.cover_image)
            setBannerData(res.pages[0]?.banner)
        },
        onError: (res) => {
            loading[1](false);
            Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
        }
    })
    const urlScheme = () => {
        // const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
        // const latLng = `${lat},${lng}`;
        // const label = 'Custom Label';
        // const url = Platform.select({
        //     ios: `${scheme}${label}@${latLng}`,
        //     android: `${scheme}${latLng}(${label})`
        //   });

        //   Linking.openURL(url)
    }



    const _onMomentumScrollEnd = ({ nativeEvent }) => {
        const isCloseToBottom =
            nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >
            nativeEvent.contentSize.height - 30;
        //////console.log(1);
        if (isCloseToBottom) {
            // if (fetchshoplist.hasNextPage) {
            //    useThrottle(fetchshoplist.fetchNextPage().catch, 1000);
            // }
            ////console.log(fetchShopList.hasNextPage);
            //////console.log("到底部");
            if (fetchShopList.isFetchingNextPage || !fetchShopList.hasNextPage) return;
            useThrottle(fetchShopList.fetchNextPage(), 3000);
            // setPages(page+1);
        }
    }


    //banner跳转
    const bannerTarget = () => {


        console.log(bannerData)
        const type = bannerData.type;
        const url = bannerData.content;
        console.log(type, url)
        if (type === 1) return;
        if (type === 2) navigation.navigate('Account.WebPage', { type: "NextChoc", url });
        if (type === 3) Linking.openURL("nextchoc://" + url)

    }

    useEffect(() => {
        return () => {
            fetchShopList.remove();
        }
    }, [])
    //    merchant_id
    const collect = useMutation({
        mutationFn: () => ShopAPI.collectShop({ token, ...data }),
        mutationKey: ['collect'],
    })
    const uncollect = useMutation({
        mutationFn: (data) => ShopAPI.uncollectShop({ token, ...data }),
        mutationKey: ['uncollect'],
    })

    useEffect(() => {

        loading[1](true)

    }, [keywords])


    return (
        <View style={{ marginTop: 50, paddingHorizontal: 16, display: 'flex', flex: 1 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => { navigation.goBack() }} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
                <Text style={{ fontSize: 20, fontWeight: '500' }}>{key}</Text>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', marginBottom: 18, marginTop: 18 }}>
                <AntDesign name="search1" style={{ marginLeft: 16 }} size={24} color="rgba(0,0,0,0.4)" />
                <TextInput onEndEditing={() => {

                }} onChangeText={(e) => {
                    setKeywords(e);
                }} value={keywords} style={{ paddingHorizontal: 16, flex: 1, fontSize: 16, paddingVertical: 12 }} />

            </View>
            {bannerData && <Pressable onPress={bannerTarget} style={{ width: '100%', marginTop: 10 }}>
                <Image source={{ uri: `${bannerData.cover_image}` }} style={{ width: '100%', borderRadius: 10, height: 120 }} resizeMode="cover" />
            </Pressable>}
            <ScrollView refreshControl={<RefreshControl onRefresh={() => {
                fetchShopList.refetch();
                loading[1](true);
            }} refreshing={loading[0]} />} onMomentumScrollEnd={_onMomentumScrollEnd} >


                {
                    fetchShopList.isSuccess && fetchShopList.data.pages.map((item, index) => (
                        item.data.map((it, idx) => {
                            return (
                                <View key={idx} style={{ marginTop: 18 }}>
                                    <Pressable onPress={() => navigation.navigate("Bussiness.shop", { id: it.merchant_id })} style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                        <View style={{ position: 'relative' }}>
                                            <Image source={{ uri: it.logo_format }} style={{ width: 105, height: 105, borderRadius: 12, borderWidth: 0.3, borderColor: 'rgba(0,0,0,0.3)' }} resizeMode="cover" />

                                        </View>

                                        <View style={{ flex: 1, marginLeft: 12, display: 'flex' }}>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                {
                                                    it.score !== 0 && <View style={{ display: 'flex', flexDirection: 'row', marginRight: 8, alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: config.primaryColor, borderRadius: 8 }}>
                                                        <AntDesign name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 4 }} />
                                                        <Text style={{ fontSize: 16, color: 'white' }}>{it.score}</Text>
                                                    </View>
                                                }
                                                <Text style={{ fontSize: 18 }}>{it.merchant_name}</Text>
                                                {it.is_favorite ? <View style={{ marginLeft: 'auto', width: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#F5C52B', borderRadius: 24, justifyContent: 'center' }}><AntDesign name="star" size={14} color={'white'} style={{ marginRight: 2 }} /><Text style={{ color: '#fff', fontSize: 12 }}>Liked</Text></View> : null}
                                            </View>
                                            <Text style={{ color: 'rgba(0,0,0,0.2)', marginTop: 8, marginBottom: 12 }}>{it.merchant_address}</Text>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                {token && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                                                    {/* <Octicons style={{ marginRight: 4 }} name="dot-fill" size={12} color="black" /> */}
                                                    <EvilIcons name="location" size={18} color="gray" />
                                                    <Text style={{ color: 'gray' }}>{it.distance}</Text>
                                                </View>}
                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    {/* <Octicons style={{ marginRight: 4 }} name="dot-fill" size={12} color="black" />*/}
                                                    <AntDesign style={{ marginRight: 4 }} name="clockcircleo" size={14} color='gray' />
                                                    <Text style={{ color: 'gray' }}>{it.business_hours}</Text>
                                                </View>
                                            </View>
                                        </View>

                                    </Pressable>
                                    {/* <View style={{
                                        position: 'absolute', right: 8, top: -8, width: 50, height: 50, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {it.is_favorite ? <Pressable onPress={() => {
                                            uncollect.mutate({ merchant_id: it.merchant_id }, {
                                                onSuccess: (res) => {
                                                    Toast.show("Collection successful")
                                                }
                                            })
                                        }}><AntDesign color={config.primaryColor} name="heart" size={24} /></Pressable> :
                                            <Pressable onPress={() => {
                                                collect.mutate({ merchant_id: it.merchant_id }, {
                                                    onSuccess: (res) => {
                                                        Toast.show("Collection successful")
                                                    }
                                                })
                                            }}><AntDesign name="hearto" size={24} color={config.primaryColor} /></Pressable>}
                                    </View> */}
                                </View>)
                        })
                        // co?nsole.log(item)
                    )


                    )}
                {
                    fetchShopList.isFetchingNextPage && <ActivityIndicator size={'small'} color={config.primaryColor} />
                }
            </ScrollView>
        </View>)
}
