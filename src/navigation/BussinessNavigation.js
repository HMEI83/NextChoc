
import OrderStatus from "../screens/bussiness/OrderStatus";
import AddressPosition from "../screens/bussiness/addressPosition";
// import Checkout from "../screens/bussiness/checkout";
// import OrderDetail from "../screens/bussiness/orderDetail";
import ShopDetail from "../screens/bussiness/shopDetail";
import OrderFinish from "../screens/Orderfinish";
// import PayConfirm from "../screens/bussiness/PayConfirm";
export default function BussinessNavigation(Stack) {
  return (
    <Stack.Group

    >
  
      <Stack.Screen
        name={"Bussiness.position"}
        component={AddressPosition}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name={"Bussiness.order"}
        component={OrderDetail}
        options={{
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name={"Bussiness.shop"}
        component={ShopDetail}
        options={{
          headerShown: false,

        }}
      />
      <Stack.Screen
        name="Bussiness.orderfinish"
        component={OrderFinish}
        options={{
          headerTitle: 'Order',
          headerTintColor: 'black'

        }}
      />
      <Stack.Screen
        name={"Bussiness.orderStatus"}
        component={OrderStatus}
        options={{
          headerShown: false
        }}
      />
      {/* <Stack.Screen 
        name={"Bussiness.payConfirm"}
        component={PayConfirm}
        options={{
          // headerShown: false
        }}
      /> */}
    </Stack.Group>
  );
}