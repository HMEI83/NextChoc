import { useNavigation } from "@react-navigation/native"
import { View, Text, Pressable, Image, Alert } from "react-native"
import config from "../common/config";
import { useMutation } from "@tanstack/react-query";
import ShopAPI from "../api/ShopAPI";

export default function OrderItem(props) {
    const navigation = useNavigation();
    // console.log('props:',props.item)

    // console.log(props, props.item.status_mean);
    const refund = useMutation({
        mutationFn: () => ShopAPI.cancelOrder({ order_id: props.item.id, token: props.token }),
        mutationKey: ['refund'],
    })
    const canRefund = () => {
        console.log();
        console.log(new Date(props.item.create_time_format))
        console.log("===");
        console.log((new Date() - new Date(props.item.create_time_format)) / 1000 / 60);

        return props.item.payment_status === 2 ? false : (props.item.status === 3 ? false : (new Date() - new Date(props.item.create_time_format)) / 1000 / 60 < 60);
    }
    return (<Pressable onPress={() => props.item.status !== 3 ? navigation.navigate("Bussiness.orderStatus", { id: props.item.id }) : navigation.navigate("Bussiness.orderfinish", { id: props.item.id })} style={{ display: 'flex', flexDirection: 'row', marginBottom: 24, borderBottomColor: 'rgba(0,0,0,0.1)', borderBottomWidth: 1, paddingBottom: 12 }}>
        <View style={{ borderRadius: 12, overflow: "hidden", width: 110, height: 110 }}>
            <Image source={{ uri: props.item.image }} style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={{ marginLeft: 16, display: 'flex' }}>
            <Text numberOfLines={1} style={{ fontSize: 20, width: '100%', width: '60%' }}>{props.item.title}</Text>

            <Text numberOfLines={1} style={{ fontSize: 16, color: 'rgba(0,0,0,0.7)', marginTop: 8, width: 200, padding: 0 }}>{props.item.description.replace(" ", "")}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.7)' }}>{props.item.goods_count} suprise box</Text>
                <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.7)', marginLeft: 12 }}>{config.current}{props.item.payment_amount}</Text>
            </View>

            <Text style={{ marginTop: 8, fontSize: 12, color: config.primaryColor, fontWeight: "500" }}>{props.item.create_time_format.slice(0, 16)}</Text>


        </View>
        <View style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end', }}>
            <Text style={{ paddingHorizontal: 12, marginTop: 4 }}>{

                props.item.payment_status === 2 ? "Refunded" :
                    (props.item.status === 0 ? "Purchased" : props.item.status === 1 ? "Preparing" : props.item.status === 2 ? "Refunded" : props.item.status === 4 ? "Ready" : props.item.status === 3 ? "Completed" : null)}</Text>
            { !!props.item.is_allow_cancel&& <Pressable onPress={() => {
                Alert.alert("Notice", "Are you sure you want to cancel this order?", [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Refund', onPress: () => {
                            refund.mutate(null, {
                                onSuccess: (res) => {
                                    ////console.log(res);
                                    props.func.refetch();
                                },
                                onError: (res) => {
                                    Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                                }
                            })
                        }
                    },
                ]);
            }} style={{ marginTop: 'auto', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: config.primaryColor, }}>
                <Text style={{ color: 'white' }}>Withdraw</Text>
            </Pressable>}
        </View>
    </Pressable>)
}