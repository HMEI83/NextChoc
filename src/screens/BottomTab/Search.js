import { Image, Pressable, Text, TextInput, View, ActivityIndicator, ScrollView, RefreshControl, Animated, Dimensions, PanResponder, Keyboard } from "react-native"
import { useNavigation } from "@react-navigation/native";
// import MapView from 'react-native-maps'
import GoogleMapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { AntDesign, Octicons, FontAwesome5, Entypo, EvilIcons } from "@expo/vector-icons";
import config from "../../common/config";
import { useEffect, useState, useRef } from "react";
import useThrottle from "../../common/hooks/useThrottle";
import { useLocal, useToken } from "../../common/store/user";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import HomeAPI from "../../api/HomeAPI";
import ShopModal from "../../components/ShopModal";
import MapAPI from "../../api/MapAPI";
import { API_URL } from "../../common/api/API_URL";
export default function Search({ navigation }) {
  // let navigation = useNavigation();
  const loading = useState(false);
  const loading2 = useState(false);
  const token = useToken();
  const [page, setPages] = useState(0);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState();
  const local = useLocal();
  const [s_height, setSHeight] = useState(Dimensions.get('screen').height * 0.59);
  const [delta, setDelta] = useState({ latitudeDelta: 0.005 });
  const [shopList, setShopList] = useState([]);
  // const [pos, setPos] = useState({
  //   latitude:
  //     local?.coords?.latitude ??
  //    -29.30725436315374,
  //   longitude:
  //     local?.coords?.longitude ??
  //    137.7287693788147,
  // });
  const [currentPositionPane, setCurrentPositionPane] = useState(Dimensions.get('screen').height * 0.60);
  const mRef = useRef();
  const animationRef = useRef(null);
  const scroll = useRef(new Animated.Value(Dimensions.get('screen').height * 0.60)).current
  const [flag, setFlag] = useState(false);
  const [keywords, setKeywords] = useState("");
  // const mRef = useRef();
  const range = 80;//滑动范围
  const defaultPosition = Dimensions.get('screen').height * 0.60;//默认面板高度

  // const searchAreaShop = useMutation({
  //   mutationFn: (data) => MapAPI.searchAreaShop({...data,keywords}),
  //   mutationKey: ['searchAreaShop',keywords],
  // })
  // const searchAreaShop=useQuery({
  //   queryFn:(data)=> MapAPI.searchAreaShop({...data,keywords}),
  // })

  useEffect(()=>{
      Keyboard.addListener("keyboardWillChangeFrame",()=>{
        Animated.timing(scroll, {
          toValue: Dimensions.get('screen').height - 32,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setCurrentPositionPane(Dimensions.get('screen').height - 32)
      }),
      Keyboard.addListener("keyboardDidHide",()=>{
        Animated.timing(scroll, {
          toValue: defaultPosition,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setCurrentPositionPane(defaultPosition)
      })
  },[])
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
        Animated.timing(scroll, {
          toValue: currentPositionPane + gestureState.dy,
          duration: 1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: (evt, gestureState) => {
        //中部向下滑动
        if (gestureState.moveY > defaultPosition) {
          if (gestureState.dy >= range) {
            //滑动到最小化
            Animated.timing(scroll, {
              toValue: Dimensions.get('screen').height - 32,
              duration: 300,
              useNativeDriver: true,
            }).start();
            setCurrentPositionPane(Dimensions.get('screen').height - 32)
          } else {
            //回弹
            Animated.timing(scroll, {
              toValue: defaultPosition,
              duration: 300,
              useNativeDriver: true,
            }).start();
            setCurrentPositionPane(defaultPosition)
          }
        } else {
          console.log(gestureState)
          //中部向上滑动
          if (gestureState.dy < 0) {
            if (Math.abs(gestureState.dy) >= range) {
              //超出范围，向第一个状态改变
              Animated.timing(scroll, {
                toValue: Dimensions.get("screen").height * 0.28,
                duration: 300,
                useNativeDriver: true,
              }).start();
              setSHeight(Dimensions.get("screen").height * 0.28);
              setCurrentPositionPane(Dimensions.get("screen").height * 0.28)
            } else {
              //回弹
              Animated.timing(scroll, {
                toValue: defaultPosition,
                duration: 300,
                useNativeDriver: true,
              }).start();
              setCurrentPositionPane(defaultPosition)
              // setSHeight(Dimensions.get("screen").height*0.58);
            }
          } else {
            //顶部向下滑动
            if (gestureState.dy >= range) {
              //超出范围，向第一个状态改变
              Animated.timing(scroll, {
                toValue: defaultPosition,
                duration: 300,
                useNativeDriver: true,
              }).start();
              setCurrentPositionPane(defaultPosition)
              setSHeight(Dimensions.get("screen").height * 0.59);
            }
          }

        }


      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => false,
    });


  const searchAreaShop = useQuery({
    queryFn: (data) => MapAPI.searchAreaShop({ ...data, radius: delta.latitudeDelta * 100, listRows: 50, lng: delta.longitude ?? 131.044, lat: delta.latitude ?? -25.363, page: page, token, keywords }),
    queryKey: ['DiscoverFetchShopList', keywords, local, delta],

    onSuccess: (res) => {
      console.log("000");
      // console.log(res);
      setFlag(false);
      //consolelog(res.pages[0]);
      setShopList(res);
      // ////consolelog("===");
      // setPages(page + 1);
      loading2[1](false)
    },
    staleTime: 100,
    onError: (res) => {
      Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
      loading2[1](false)
    },
  })


  const _onMomentumScrollEnd = ({ nativeEvent }) => {
    // const isCloseToBottom =
    //   nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >
    //   nativeEvent.contentSize.height - 40;
    // //////////consolelog(nativeEvent.layoutMeasurement.height, nativeEvent.contentOffset, nativeEvent.contentSize.height);
    // //////////consolelog(1);

    // if (isCloseToBottom) {
    //   //////////consolelog("到底部");
    //   if (fetchShopList.isFetchingNextPage || !fetchShopList.hasNextPage) return;
    //   useThrottle(fetchShopList.fetchNextPage(), 3000)
    // }
  }
  useEffect(() => {
    console.log('delta发生变化，准备loading')
    loading2[1](true);

  }, [delta])
  useEffect(() => {

    if (local?.coords) {

      console.log('local change...');
      console.log('恢复地图到用户中心...');
      // console.log(local)
      searchAreaShop.refetch();
      (mRef.current).setCamera({
        center: { latitude: local.coords.latitude - 0.01, longitude: local.coords.longitude },
        zoom: 14,
      });
    }
  }, [local])




  return (<View style={{ display: 'flex', flex: 1 }}>
    {/*  */}
    <View style={{ marginHorizontal: 16, display: 'flex', alignItems: 'center', borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', marginBottom: 18, marginTop: 18 }}>
      <AntDesign name="search1" style={{ marginLeft: 16 }} size={24} color="rgba(0,0,0,0.4)" />
      <TextInput onChangeText={(e) => {
        setKeywords(e);
      }} value={keywords} style={{ paddingHorizontal: 16, flex: 1, fontSize: 16, paddingVertical: 12 }} />

    </View>
    <View style={{ flex: 1, display: 'flex', position: 'relative' }}>
      <GoogleMapView

        loadingEnabled={loading[0]}
        initialCamera={{
          zoom: 3.3, center: { latitude: -25.363 - 19, longitude: 131.044 }, heading: 1, pitch: 1
        }}
        onRegionChangeComplete={(res) => {
          //consolelog("123");
          // console.log(res)
          setDelta(res);
        }}

        scrollEnabled={true}
        showsScale={true}
        // onMapLoaded={() => resetPosition(customerPoi[0])}
        ref={(r) => (mRef.current = r)}
        provider={PROVIDER_GOOGLE}
        // showsCompass={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType={"standard"}
        zoomTapEnabled={false}
        style={{ flex: 1, width: '100%',marginBottom:26.2 }}
      >
        {
          (searchAreaShop.isSuccess) && !!shopList?.length &&
          shopList.map((item, index) => (
            <Marker
              title={item.merchantname}
              description={item.merchantaddress}
              key={index}
              pinColor={'blue'}
              onPress={() => {
                setVisible(true);
                setMessage(item);
              }}
              coordinate={{
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lng),
              }}>
              <Pressable onPress={() => { setVisible(true); setMessage(item); }}>
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
              </Pressable>
            </Marker>)
          )
        }
      </GoogleMapView>


      <Animated.View style={{
        height: Dimensions.get('screen').height * 1
        , position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%',
        transform: [{ translateY: scroll }],
        backgroundColor: 'white', padding: 8
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

        <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl onRefresh={searchAreaShop.refetch}
          refreshing={loading2[0]} />}  >

          {
            // loading2[0] && <ActivityIndicator style={{ margin: 20, alignSelf: 'center' }} size={'large'} />
          }
          {
            // searchAreaShop.isFetching ? <ActivityIndicator size={'large'} color={config.primaryColor} /> : 
            (searchAreaShop.isSuccess) && (!!shopList?.length ? shopList.map((item, index) => {
              //consolelog(item);
              return (
                <View key={index} style={{ marginTop: 18 }}>
                  <Pressable onPress={() => navigation.navigate("Bussiness.shop", { id: item.id })} style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <View style={{ position: 'relative' }}>
                      <Image source={{ uri: `${API_URL}${item.logo}` }} style={{ width: 105, height: 105, borderRadius: 12, }} resizeMode="cover" />
                      {/* <View style={{
                        position: 'absolute', left: 10, top: 15, width: 33, height: 33, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <View style={{ backgroundColor: 'white', borderRadius: 13.5, width: 33, height: 33, alignItems: 'center', justifyContent: 'center' }}>
                          {item.is_favorite ? <AntDesign color={config.primaryColor} name="heart" size={24} /> : <AntDesign name="hearto" size={24} color={config.primaryColor} />}
                        </View>
                      </View> */}
                    </View>

                    <View style={{ flex: 1, marginLeft: 12, display: 'flex' }}>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {item.score !== 0 && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: config.primaryColor, borderRadius: 8 }}>
                          <AntDesign name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 4 }} />
                          <Text style={{ fontSize: 16, color: 'white' }}>{item.score}</Text>
                        </View>}
                        <Text style={{ fontSize: 18, maxWidth: '70%' }}>{item.merchantname}</Text>
                        {item.is_favorite ? <View style={{ marginLeft: 'auto', width: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#F5C52B', borderRadius: 24, justifyContent: 'center' }}><AntDesign name="star" size={14} color={'white'} style={{ marginRight: 2 }} /><Text style={{ color: '#fff', fontSize: 12 }}>Liked</Text></View> : null}
                      </View>
                      <Text style={{ color: 'rgba(0,0,0,0.2)', marginTop: 8, marginBottom: 12 }}>{item.merchantaddress}</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {token && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                          {/* <Octicons style={{ marginRight: 4 }} name="dot-fill" size={12} color="black" /> */}
                          <EvilIcons name="location" size={18} color="rgba(0,0,0,0.5)" />
                          <Text style={{ color: 'gray' }}>{item.distance}</Text>
                        </View>}
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          {/* <Octicons style={{ marginRight: 4 }} name="dot-fill" size={12} color="black" /> */}
                          <AntDesign style={{ marginRight: 4 }} name="clockcircleo" size={14} color='rgba(0,0,0,0.5)' />
                          <Text style={{ color: 'rgba(0,0,0,0.3)' }}>{item.businesshours}</Text>
                        </View>
                      </View>
                    </View>

                  </Pressable>

                </View>)


            }


            ) : <Text style={{ textAlign: 'center', marginTop: 24, fontSize: 18 }}>no stores nearby</Text>)

          }

        </ScrollView>
        <View style={{ height: s_height }}></View>
      </Animated.View>
    </View>
    <ShopModal visible={visible} onExit={() => setVisible(false)} mess={message} />
    {/*  */}
  </View >)
}


