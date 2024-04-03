import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native"
import OrderItem from "../../components/orderItem"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import OrderAPI from "../../api/OrderAPI"
import { useToken } from "../../common/store/user"
import config from "../../common/config"
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function Orders({ navigation }) {
  const token = useToken();
  // ////console.log(token)
  const fetchOrderList = useInfiniteQuery({
    enabled: !!token,
    queryFn: ({ pageParam = 1, ...data }) => OrderAPI.fetchOrderList({ ...data, page: pageParam, token }),
    queryKey: ['fetchOrderList'],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (res) => {
      // Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
    },
    enabled: !!token,
  })

  const _onMomentumScrollEnd = ({ nativeEvent }) => {
    const isCloseToBottom =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >
      nativeEvent.contentSize.height - 30;

    if (isCloseToBottom) {
      if (fetchOrderList.isFetchingNextPage || !fetchOrderList.hasNextPage) return;
      ////////console.log("123");
      useThrottle(fetchOrderList.fetchNextPage(), 3000)

    }
  }

  return (<ScrollView style={{ paddingLeft: 16, marginRight: 16 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl onRefresh={fetchOrderList.refetch} refreshing={fetchOrderList.isFetching} />} onMomentumScrollEnd={_onMomentumScrollEnd}>
    <View style={{ marginTop: 36 }}></View>
    {/* <OrderItem status={"Pending"}></OrderItem>
      <OrderItem status={"Pending"}></OrderItem>
      <OrderItem status={"Completed"r}></OrderItem>
      <OrderItem status={"Completed"}></OrderItem> */}
    {
      !!token && (fetchOrderList.isSuccess && fetchOrderList.data.pages.map((item, index) => {
        if (index === 0 && item.data.length === 0) {
          return <View key={index} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="md-cart-outline" size={80} color="black" />
            <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 24 }}>No order yet</Text>
          </View>
        }
        return item.data.map((it, idx) => {
          if (it.payment_status === 0) return;
          return (<OrderItem func={fetchOrderList} key={idx} item={it} token={token}></OrderItem>)
        })
      }))

    }
    {/* {
      !!token && !fetchOrderList.isLoading && (!!fetchOrderList.isSuccess ?
        (!!fetchOrderList.data.pages.length ?
          fetchOrderList.data.pages.map((item, index) => {
            return item.data.map((it, idx) => {
              if (it.payment_status === 0) return;
              return (<OrderItem func={fetchOrderList} key={idx} item={it} token={token}></OrderItem>)
            })
          }) 
          : <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="md-cart-outline" size={80} color="black" />
            <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 24 }}>No order yet</Text>
          </View>) : <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcons name="error" size={48} color="black" />
          <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 24 }}>Fetch data error,please try again</Text>
        </View>)
    } */}





    {
      !token && <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="md-cart-outline" size={80} color="black" />
        <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 24 }}>Not logged in</Text>
      </View>
    }


  </ScrollView>)
}