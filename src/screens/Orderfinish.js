import { View, Text, ScrollView, ActivityIndicator, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, Keyboard } from "react-native"
import config from "../common/config"
import { useMutation, useQuery } from "@tanstack/react-query"
import OrderAPI from "../api/OrderAPI"
import { useToken } from "../common/store/user"
import { useState, useRef, useEffect } from "react"
import { FontAwesome, AntDesign } from "@expo/vector-icons"
export default function OrderFinish({ route }) {
    const token = useToken();
    const [visible, setVisible] = useState(false);
    const scroll = useRef();
    const [height, setHeight] = useState(0);
    const [score, setScore] = useState(0);
    const [Input, setInput] = useState("");
    const [success, setSuccess] = useState(false);
    const orderStatus = useQuery({
        queryFn: () => OrderAPI.fetchOrderDetail({ order_id: route.params.id, token }),
        queryKey: ['orderFinish', route.params.id],
        onSuccess: (res) => {
            console.log(res);
        },
        onError: (res) => {
            Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
        }
    })
    const evaluate = useMutation({
        mutationFn: () => OrderAPI.evaluteOrder({ order_id: route.params.id, token, score, content: Input }),
        mutationKey: ['evaluateOrder'],
        onSuccess() {
            orderStatus.refetch()
        }
    })
    const toEnd = () => {
        // console.log(scroll.current.scrollTo);
        scroll?.current?.scrollTo({ y: Dimensions.get("screen").height * 2 });
    }
    useEffect(() => {
        Keyboard.addListener("keyboardWillShow", (e) => {
            setHeight(e.endCoordinates.height);

        });
        Keyboard.addListener("keyboardWillHide", (e) => {
            setHeight(0);
        })
        Keyboard.addListener("keyboardDidShow", (e) => {
            scroll?.current?.scrollTo({ y: Dimensions.get("screen").height * 2 + height });
        })

        //    return ()=>{

        //    }
    }, [])
    return (
        <>
            {/* <KeyboardAvoidingView style={{}} keyboardVerticalOffset={20} enabled={true} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
            <ScrollView style={{ paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: height }} ref={scroll}>
                {orderStatus.isFetching ? <ActivityIndicator style={{ margin: 20 }} size={'large'} color={config.primaryColor} /> : (orderStatus.isSuccess ? <View>
                    <Text style={{ fontSize: 24, fontWeight: "500", marginTop: 24 }}>Thank you for your order</Text>
                    <Text style={{ marginTop: 24 }}>Here is your order receipt for {orderStatus.data?.merchant.merchantname}.</Text>
                    <View style={{ marginTop: 24, borderBottomColor: 'rgb(0,0,0)', borderBottomWidth: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: "500" }}>Total</Text>
                        <Text style={{ fontSize: 18, fontWeight: "500" }}>{config.current}{orderStatus.data?.amount}</Text>
                    </View>
                    <View style={{ marginTop: 12, marginBottom: 12, }}>
                        {orderStatus.data?.goods.map((item, index) => <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginRight: 12, width: 20, height: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>x{item.count}</Text>
                                </View>
                                <Text style={{}}>{item.goods_name}</Text>
                            </View>
                            <Text>
                                {config.current}{item.price}
                            </Text>
                        </View>)}
                        {/* <Text style={{ marginTop: 4 }}>Choice of Size {config.current}5</Text>
                <Text style={{ marginTop: 4, fontSize: 13, color: 'rgba(0,0,0,0.3)' }}>Large {config.current}5</Text> */}
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 12 }}></View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15 }}>Subtotal</Text>
                        <Text style={{ fontSize: 15, fontWeight: '500' }}>{config.current}{orderStatus.data.payment_amount}</Text>
                    </View>
                    <View style={{ marginTop: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.8)' }}>Coupon</Text>
                        <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.8)' }}>{config.current}{orderStatus.data.coupon_price}</Text>
                    </View>
                    <View style={{ marginTop: 24, height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 12 }}></View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', }}>Total:</Text>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{config.current}{orderStatus.data.payment_amount}</Text>
                    </View>
                    {/* <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 24 }}>
                        <Pressable onPress={() => setVisible(true)} style={{ backgroundColor: config.primaryColor, borderRadius: 24 }}>
                            <Text style={{ paddingHorizontal: 36, paddingVertical: 8, fontSize: 16, color: 'white' }}>Evaluate</Text>
                        </Pressable>
                    </View> */}
                    {!orderStatus?.data?.order_evaluate_info ? <View style={{ marginTop: 24 }}>
                        {
                            (<View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                {
                                    evaluate.isLoading ? <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}><ActivityIndicator size={'large'} style={{}} color={config.primaryColor} /></View> : (
                                        <View style={{ backgroundColor: 'white', borderRadius: 16, width: '100%' }}>
                                            <View style={{}}>

                                                <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Comments:</Text>
                                                <View style={{ height: 100, padding: 8, borderColor: 'black', borderWidth: 1, borderRadius: 4, marginBottom: 16 }}>
                                                    <TextInput multiline={true} placeholder="Please fill in your feedback" style={{ width: '100%' }} value={Input} onChangeText={(text) => {
                                                        if (text.length > 500) {
                                                            Toast.show("Maximum word count is 500 words");
                                                            return;
                                                        }
                                                        setInput(text);
                                                    }} />
                                                </View>
                                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                                    {
                                                        [1, 1, 1, 1, 1].map((item, index) => {
                                                            // if (item) return (<FontAwesome name="star-o" size={24} color="black" />)

                                                            // else return <FontAwesome name="star" size={24} color="#FFC500" />
                                                            if (score > index) return <Pressable key={index} onPress={() => setScore(index + 1)} style={{ marginRight: 8 }}><FontAwesome name="star" size={24} color={config.primaryColor} /></Pressable>
                                                            else return <Pressable key={index} onPress={() => setScore(index + 1)} style={{ marginRight: 8 }}><FontAwesome name="star-o" size={24} color="black" /></Pressable>
                                                        })
                                                    }
                                                </View>
                                                <View style={{ display: 'flex', alignItems: 'flex-end', marginTop: 16 }}>
                                                    <Pressable onPress={() => {
                                                        if (score === 0) {
                                                            return;
                                                        }
                                                        evaluate.mutate(null, {
                                                            onSuccess: (res) => {
                                                                console.log(res);
                                                                setVisible(false);
                                                                Toast.show("evalute success");
                                                            },
                                                            onError: (res) => {
                                                                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                                                                setVisible(false);
                                                            }
                                                        })
                                                    }} style={{ backgroundColor: config.primaryColor, borderRadius: 24 }}>
                                                        <Text style={{ paddingHorizontal: 36, paddingVertical: 8, fontSize: 16, color: 'white' }}>Rata us</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </View>)
                                }
                            </View>)}
                    </View>
                        : <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, marginTop: 24 }}>Rata us:</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                {
                                    [0, 0, 0, 0, 0].map((item, index) => {
                                        console.log(orderStatus.data?.order_evaluate_info?.score)
                                        if (index < orderStatus.data?.order_evaluate_info?.score) {
                                            return <FontAwesome key={index} name="star" size={24} style={{ marginRight: 8 }} color={config.primaryColor} />
                                        } else return <FontAwesome key={index} name="star-o" style={{ marginRight: 8 }} size={24} color="black" />
                                    })

                                    // fetchOrderDetail.data?.order_evaluate_info?.status
                                }
                            </View>
                        </View>}
                </View> : null)}
            </ScrollView>

            {/* </KeyboardAvoidingView>  */}
        </>)
}