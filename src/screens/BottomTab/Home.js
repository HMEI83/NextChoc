import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Text, View, Image, ScrollView, Dimensions, Pressable, RefreshControl, ActivityIndicator, Platform } from "react-native";
import { AntDesign, FontAwesome, Ionicons, EvilIcons } from "@expo/vector-icons";
import { useCommonActions, useIsIntro, useIsUpdate, useLocal, useToken } from "../../common/store/user";
import useThrottle from "../../common/hooks/useThrottle";
import { registerForPushNotificationsAsync } from "../../../NoticeUtils";
import * as Location from 'expo-location'
// import Swiper frrom 'react-native-swiper'
import * as Linking from 'expo-linking'
import * as Splash from 'expo-splash-screen'
import SwiperFlatList from "react-native-swiper-flatlist";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import config from "../../common/config";
import HomeApi from '../../api/HomeAPI';
import * as Notifications from 'expo-notifications'
import MapAPI from "../../api/MapAPI";

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
   const isIntro = useIsIntro();
   const setLocal = useCommonActions().setLocal;
   const navigate = useNavigation();
   const setIsUpdate = useCommonActions().setIsUpdate;
   const isUpdate = useIsUpdate();
   const token = useToken();
   const swiper = useRef();
   const lc = useLocal();


   //通知事件监听器
   const [notification, setNotification] = useState(false);
   const notificationListener = useRef();
   const responseListener = useRef();

   const lastNotificationResponse = Notifications.useLastNotificationResponse();


   const [isScrollEnd, setIsScrollEnd] = useState(false);
   const [location, setLocation] = useState();
   const [d_location, setD_location] = useState();
   const [page, setPages] = useState(1);
   const fetchPos=useMutation({
      mutationFn:(data)=>MapAPI.NLatitude2placeId(data),
      mutationKey:['fetchPos']
   })
   const fetchHomepage = useQuery({
      queryFn: () => HomeApi.fetchHomepage({ token }),
      queryKey: ['fetchHomepage',token],
      onSuccess: (res) => {
         // //console.log(res);
      },
      onError: (res) => {
         Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
      }
   })
   const uploadLocal = useMutation({
      mutationFn: (data) => HomeApi.uploadLocation(data),
      mutationKey: ['uploadLocal'],
   })
   const fetchShopList = useInfiniteQuery({
      queryFn: ({ pageParam = 1, ...data }) => HomeApi.fetchShopList({ ...data, listRows: 5, page: pageParam, token }),
      queryKey: ['HomefetchShopList'],
      getNextPageParam: (_d, pages) => {
         return _d.current_page + 1 > _d.last_page ? false : _d.current_page + 1;
      },
      onSuccess: (res) => {
         // //console.log(res);
         // setPages(page + 1);
      },
      onError: (res) => {
         Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
      }
   })



   const _onMomentumScrollEnd = ({ nativeEvent }) => {
      const isCloseToBottom =
         nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >
         nativeEvent.contentSize.height - 30;

      if (isCloseToBottom) {
         if (fetchShopList.isFetchingNextPage || !fetchShopList.hasNextPage) return;
         //////////console.log("123");
         useThrottle(fetchShopList.fetchNextPage(), 3000)

      }
   }

   const setDevToken = useCommonActions().setDevToken;


   useEffect(() => {

      const fetchPushNotificationToken = async () => {
         let res = await registerForPushNotificationsAsync()
            .catch((er) => {
               console.warn('通知服务注册失败');
               // alert('Test Mode:' + (e instanceof Error) ? e.message : JSON.stringify(e))
               console.warn(er.message)
            })
         if (res) {
            setDevToken(res)
            //console.log(res);
            // alert(JSON.stringify(res))
         } else {
            // alert('Test Mode:'+(e instanceof Error )? e.message:JSON.stringify(e))
            console.warn("Push Token get Failed!");
         }
      }

      fetchPushNotificationToken();

      if (isIntro == "open") {
         navigate.navigate("openPage");
      } else {
         Splash.hideAsync();

         if (isUpdate === "0") {
            ////console.log("获取地址中");
            fetchPosition();
         }
    
      }
      
   }, [])
   useEffect(()=>{
      if(!lc?.local_name){
         fetchPosition()
      }
   },[token]); 

   const fetchPosition = async () => {
      console.log("1");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("2");
      if (status !== 'granted') {
         setErrorMsg('Permission to access location was denied');
         return;
      }
      console.log("3")
      let pos
      try{
        pos = await Location.getCurrentPositionAsync({});
      }catch(err){
         console.log(err)
      }
      console.log("4");
      // const lc = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
      // setD_location(lc);
      console.log("獲取地址成功");
         fetchPos.mutate({lng:pos.coords.longitude,lat:pos.coords.latitude},{
            onSuccess:(res)=>{
               console.log("-11-")
               console.log(res.formatted_address);
               setLocal({...pos,local_name:res?.formatted_address_short})
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
   //    //console.log(lc)
      // let name=lc.city+" "+lc.district+" "+lc.street+" "+lc.streetNumber
   //    lc={...lc[0],name};
   //   //console.log(lc);
      // setLocal({ ...lc[0], ...pos,local_name:name });
      // setIsUpdate("1");
      // if (!token) {
      //    ////console.log('token 不存在！')
      //    //  return;
      // }
    
      // ////console.log(lc[0]);


   }

   //banner跳转
   const bannerTarget = (type, url) => {

      ////console.log(type, url)
      if (type === 1) return;
      if (type === 2) navigate.navigate('Account.WebPage', { type: "NextChoc", url });
      if (type === 3) Linking.openURL("nextchoc://" + url)

   }


   useEffect(() => {

      if (lastNotificationResponse) {

         ////console.log('通知res:')
         ////console.log(lastNotificationResponse.notification.request);
         const noticeReq = lastNotificationResponse;
         if (
            noticeReq &&
            // noticeReq.notification.request.content.data &&
            noticeReq.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
         ) {

            const noticeRes = noticeReq.notification.request.content.data;
            if (!noticeReq) return;
            if (noticeRes.type === "2") {
               //打开内置webview

               navigate.navigate("Account.WebPage", { type: noticeReq.notification.request.content.title, url: noticeRes.url })
            }

            if (noticeReq.type === "1") {
               //内部链接,前往订单页面
               Linking.openURL('nextchoc://' + noticeReq.url)

            }


         }
      }
   }, [lastNotificationResponse]);




   //刷新首页数据
   const updatePageData = () => {
      fetchHomepage.refetch();

      fetchShopList.refetch();
      fetchPosition();
   }



   // if(fetchHomepage.isFetching){
   //    return <ActivityIndicator size={"large"} style={{marginTop:24}} color={config.primaryColor} />
   // }
   if (fetchHomepage.isError) {
      return (<><Text style={{ marginTop: 24, textAlign: 'center', fontSize: 18, color: 'rgba(0,0,0,0.4)' }}>{
         fetchHomepage.error.message
      }</Text><Pressable style={{ marginTop: 12 }} onPress={updatePageData}><Text style={{ textAlign: 'center', textDecorationLine: 'underline', fontSize: 16, fontWeight: 500, color: config.primaryColor }}>Reload</Text></Pressable></>)
   }

   return (
      // <SafeAreaView>
      <ScrollView style={{}} refreshControl={<RefreshControl refreshing={fetchHomepage.isFetching} onRefresh={updatePageData} />} onMomentumScrollEnd={_onMomentumScrollEnd} >
         {
            fetchHomepage.isSuccess && <>
               <View style={{ marginTop: 14 }}>
                  <View style={{ paddingHorizontal: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                     <Pressable onPress={() => navigation.navigate("Search")} style={{ width: 60, height: 60, borderRadius: 12, borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <AntDesign name="search1" size={24} color="black" />
                     </Pressable>
                     <View style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                        <Text style={{ fontSize: 18, color: 'rgba(0,0,0,0.6)' }}>Current Location</Text>
                        <Pressable onPress={() => navigation.navigate("Account.chooseAddressMethod")} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8 }}><Ionicons name="location-sharp" size={24} color="rgb(87,142,29)" /><Text numberOfLines={1} style={{ fontSize: 16, width: '100%', textAlign: 'center' }}>
                           {/* {d_location && d_location.length ? d_location[0]?.name : null} */}
                           {lc?.local_name ? lc.local_name : 'Positioning'}
                        </Text>
                        </Pressable>
                     </View>
                     <Pressable onPress={() => navigation.navigate("Notices")} style={{ width: 60, height: 60, borderRadius: 12, borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <FontAwesome name="bell" size={24} color="black" />
                     </Pressable>
                  </View>
                  {/*          
            <Swiper style={{height:50,backgroundColor:'red',marginTop:200 }} showsButtons={false}>
               <Image source={require("../../assets/images/banner.png")} style={{width:'100%'}} resizeMode="contain" />
            </Swiper> */}

                  {
                     fetchHomepage.data?.banner.length > 0 &&

                     <View style={{ flex: 1, backgroundColor: 'white', height: 150, position: 'relative', marginVertical: 12 }}>
                        {/* <View style={{width:16,position:'absolute',height:'100%',left:0,top:0,bottom:0,backgroundColor:'white',zIndex:12}}></View> */}
                        <SwiperFlatList
                           showPagination
                           autoplayLoopKeepAnimation={Platform.OS === "ios" ? false : true}
                           autoplayLoop
                           ref={swiper}
                           // autoplayInvertDirection={isScrollEnd}
                           autoplayDelay={3}
                           paginationDefaultColor={"white"}
                           paginationActiveColor="rgb(17,77,77)"
                           autoplay
                           index={0}
                        >
                           {
                              fetchHomepage.data?.banner.map((item, index) =>
                              (<View key={index} style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                 <View style={{ width: 16, height: '100%', backgroundColor: 'white' }}></View>
                                 <Pressable onPress={() => bannerTarget(item.type, item.content)} style={[{ flex: 1, display: 'flex' }]}>
                                    <Image source={{ uri: item.cover_image }}
                                       // defaultSource={require('../../assets/images/banner.png')}
                                       onLoadEnd={(e) => {
                                          // //////////console.log(e)
                                       }}
                                       onError={(e) => {
                                          // //////////console.log('图片加载失败...', e)
                                       }}
                                       style={{ width: width - 32, backgroundColor: 'gray', flex: 1, borderRadius: 12, borderWidth: 0.3, borderColor: 'rgba(0,0,0,0.3)' }} resizeMode="cover" />
                                 </Pressable>
                                 <View style={{ width: 16, height: '100%', backgroundColor: 'white' }}></View>
                              </View>))
                           }
                        </SwiperFlatList>
                     </View>
                  }

                  <View style={{ paddingHorizontal: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 12 }}>
                     <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Last Minute" })} style={{ width: '32%', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 10 }}>
                        <View style={{ width: 30, height: 30, marginRight: 4 }}>
                           <Image source={require("../../assets/images/time.png")} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <Text numberOfLines={2} style={{ flex: 1 }}>
                           Last Minute
                        </Text>
                     </Pressable>
                     <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Most popular" })} style={{ width: '32%', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 10 }}>
                        <View style={{ width: 30, height: 30, marginRight: 4 }}>
                           <Image source={require("../../assets/images/popular.png")} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <Text numberOfLines={2} style={{ flex: 1 }}>
                           Most popular
                        </Text>
                     </Pressable>
                     <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Best" })} style={{ width: '32%', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 10 }}>
                        <View style={{ width: 30, height: 30, marginRight: 4 }}>
                           <Image source={require("../../assets/images/best.png")} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <Text numberOfLines={2} style={{ flex: 1 }}>
                           Best
                        </Text>
                     </Pressable>
                     <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Lunch" })} style={{ width: '32%', marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 10 }}>
                        <View style={{ width: 30, height: 30, marginRight: 4 }}>
                           <Image source={require("../../assets/images/eat.png")} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <Text numberOfLines={2} style={{ flex: 1 }}>
                           Lunch
                        </Text>
                     </Pressable>
                     <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Super markets" })} style={{ width: '32%', marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 10 }}>
                        <View style={{ width: 30, height: 30, marginRight: 4 }}>
                           <Image source={require("../../assets/images/supermarket.png")} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <Text numberOfLines={2} style={{ flex: 1, }}>
                           Super markets
                        </Text>
                     </Pressable>
                     <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Favorite" })} style={{ width: '32%', marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 10 }}>
                        <View style={{ width: 30, height: 30, marginRight: 4 }}>
                           <Image source={require("../../assets/images/favor.png")} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <Text style={{ flex: 1 }}>
                           Favorite
                        </Text>
                     </Pressable>
                  </View>
                  {
                     token && (fetchHomepage.data.pending_order ?
                        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
                           <View style={{ width: '100%', display: 'flex', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Pending order</Text>
                              <Pressable onPress={() => navigate.navigate("Order")}>
                                 <Text style={{ fontSize: 16, color: 'rgb(59,84,86)' }}>See More</Text>
                              </Pressable>
                           </View>
                           <Pressable onPress={() => navigation.navigate("Bussiness.orderStatus", { id: fetchHomepage.data?.pending_order?.id })} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#7da955', padding: 16, borderRadius: 24 }}>
                              <Image source={{ uri: fetchHomepage.data?.pending_order?.logo }} style={{ width: 90, height: 90, borderRadius: 12, marginRight: 16 }} />
                              <View style={{}}>
                                 <Text numberOfLines={1} style={{ fontSize: 20, color: 'white',width:"95%"}}>{fetchHomepage.data?.pending_order?.merchant?.merchantname}</Text>
                                 <Text style={{ color: 'white', fontSize: 16 }}>{fetchHomepage.data?.pending_order?.amount}</Text>
                                 <Text style={{ marginTop: 12, color: 'white', opacity: 0.6, fontSize: 18 }}>{fetchHomepage.data?.pending_order?.businesshours}</Text>
                              </View>
                              <View style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <AntDesign name="rightcircleo" size={36} color="white" />
                              </View>
                           </Pressable>
                        </View>
                        : null)
                  }
                  <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
                     <View style={{ width: '100%', display: 'flex', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Recommended for you</Text>
                        <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Recommended for you" })}>
                           <Text style={{ fontSize: 16, color: 'rgb(59,84,86)' }}>See More</Text>
                        </Pressable>
                     </View>
                     <ScrollView horizontal={true}>
                        {

                           fetchHomepage.data.related_merchant.map((item, index) => {       
                              ////console.log(item.distance);
                              return (
                                 <View key={index} style={{ marginLeft: index === 0 ? 0 : 20, paddingBottom: 10 }}>
                                    <Pressable onPress={() => navigate.navigate("Bussiness.shop", { id: item.id })} style={{ display: 'flex' }}>
                                       <View style={{ width: 250, position: 'relative' }}>
                                          <Image source={{ uri: item.logo_format }} style={{ width: '100%', height: 140, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 0.3, borderColor: 'rgba(0,0,0,0.3)' }} />
                                          <View style={{ position: 'absolute', width: 60, height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', top: 10, right: 10, borderRadius: 50 }}>
                                             <AntDesign name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 4 }} />
                                             <Text>{item?.score !== 0 ? item.score : "4.5"}</Text>
                                          </View>
                                       </View>
                                       <View>
                                          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>{item.merchantname}</Text>
                                          <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                             {token && <EvilIcons name="location" size={18} color="rgba(0,0,0,0.5)" />}{token && <Text style={{ marginRight: 14 }}>{item.distance}</Text>}<AntDesign style={{ marginRight: 4 }} name="clockcircleo" size={14} color='rgba(0,0,0,0.5)' /><Text >{item.businesshours}</Text>
                                          </View>
                                       </View>
                                    </Pressable>
                                 </View>
                              )
                           })}
                     </ScrollView>

                  </View>
                  <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 12 }}>
                     <View style={{ width: '100%', display: 'flex', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Nearby</Text>
                        <Pressable onPress={() => navigate.navigate("SearchPage", { key: "Nearby" })}>
                           <Text style={{ fontSize: 16, color: 'rgb(59,84,86)' }}>See More</Text>
                        </Pressable>
                     </View>
                     <ScrollView horizontal={true}>
                        {
                           fetchHomepage.data.near_by_merchant.map((item, index) => {
                              return (
                                 <View key={index} style={{ marginLeft: index === 0 ? 0 : 20, paddingBottom: 10 }}>
                                    <Pressable onPress={() => navigate.navigate("Bussiness.shop", { id: item.id })} style={{ display: 'flex' }}>
                                       <View style={{ width: 250, position: 'relative' }}>
                                          <Image source={{ uri: item.logo_format }} style={{ width: '100%', height: 140, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 0.3, borderColor: 'rgba(0,0,0,0.3)' }} />
                                          <View style={{ position: 'absolute', width: 60, height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', top: 10, right: 10, borderRadius: 50 }}>
                                             <AntDesign name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 4 }} />
                                             <Text>{item?.score !== 0 ? item.score : "4.5"}</Text>
                                          </View>
                                       </View>
                                       <View>
                                          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>{item.merchantname}</Text>
                                          <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                             {token && <EvilIcons name="location" size={18} color="rgba(0,0,0,0.5)" />}{token && <Text style={{ marginRight: 14 }}>{item.distance}</Text>}<AntDesign style={{ marginRight: 4 }} name="clockcircleo" size={14} color='rgba(0,0,0,0.5)' /><Text >{item.businesshours}</Text>
                                          </View>
                                       </View>
                                    </Pressable>
                                 </View>
                              )
                           })
                        }
                     </ScrollView>


                  </View>
               </View>

               <View style={{ height: 12, width: '100%', backgroundColor: '#e6e6e6' }}></View>
               {
                  fetchShopList.isSuccess && fetchShopList.data.pages.map((item, index) => {
                     ////console.log(item);
                     return item.data.map((it, idx) => {
                        // //console.log(it);
                        return (
                           <Pressable key={idx} onPress={() => navigate.navigate("Bussiness.shop", { id: it.merchant_id })} style={{ padding: 16, display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                              <Image source={{ uri: it.logo_format }} style={{ width: 110, height: 110, borderRadius: 12, marginRight: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 0.3, borderColor: 'rgba(0,0,0,0.3)' }} />
                              <View style={{ width: Dimensions.get('window').width - 150 }}>
                                 <View style={{ alignItems: 'center', alignContent: 'space-between', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', maxWidth: '70%' }}>{it.merchant_name}</Text>
                                    {it.is_favorite ? <View style={{ width: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#F5C52B', borderRadius: 24, justifyContent: 'center' }}><AntDesign name="star" size={14} color={'white'} style={{ marginRight: 2 }} /><Text style={{ color: '#fff', fontSize: 12 }}>Liked</Text></View> : null}
                                 </View>
                                 <View style={{ marginTop: 4, display: 'flex', flexDirection: 'row' }}>
                                    <AntDesign name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 0 }} />
                                    <Text style={{ color: 'rgb(207,150,128)', paddingHorizontal: 4 }}>{it.score !== 0 ? it.score : "4.5"}</Text><Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.2)' }}>Monthly sale {it.monthly_sales}</Text>
                                 </View>
                                 <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    {token && <EvilIcons name="location" size={18} color="rgba(0,0,0,0.5)" />}{token && <Text style={{ color: 'rgba(0,0,0,0.5)', marginRight: 14 }}>{it.distance}</Text>}<AntDesign style={{ marginRight: 4 }} name="clockcircleo" size={14} color='rgba(0,0,0,0.5)' /><Text style={{ color: 'rgba(0,0,0,0.5)' }}>{it.business_hours}</Text>
                                 </View>
                                 <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                    {
                                       it?.category_name !== "" && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginRight: 8 }}>
                                          <Text style={{ color: 'rgb(207,150,128)', paddingHorizontal: 12, paddingVertical: 4, backgroundColor: 'rgb(252,249,236)' }}>{it.category_name}</Text>
                                       </View>
                                    }
                                    {
                                       it?.tag && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                          <Text style={{ color: 'rgb(207,150,128)', paddingHorizontal: 12, paddingVertical: 4, backgroundColor: 'rgb(252,249,236)' }}>{it.tag}</Text>
                                       </View>
                                    }
                                 </View>
                              </View>
                           </Pressable>)
                     })

                  }


                  )}
               {
                  fetchShopList.isFetchingNextPage && <ActivityIndicator size={'small'} color={config.primaryColor} />
               }
            </>
         }
      </ScrollView >

      // </SafeAreaView>
   )
}