import { View, Pressable, Text, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, Modal, Alert, RefreshControl } from "react-native";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { CardField } from "@stripe/stripe-react-native";
import { useEffect, useRef, useState } from "react";
import config from "../../common/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToken } from "../../common/store/user";
import UserAPI from "../../api/UserAPI";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get('window');
const visaIcon = require('../../assets/images/visa.png');
const masterIcon = require('../../assets/images/mastercard.png')
export default function Card() {
    const navigation = useNavigation();
    const [index, setIndex] = useState({ index: 0 });
    const [visible, setVisible] = useState(false)
    const [cardInfo, setCardInfo] = useState({});
    const token = useToken();

    const cardList = useQuery({
        queryFn: () => UserAPI.cardList({ token }),
        queryKey: ['cardList']
    })
    const setDefault = useMutation({
        mutationFn: (data) => UserAPI.setDefault({ ...data, token }),
        mutationKey: ['setDefault']
    })
    const AddCard = useMutation({
        mutationFn: () => UserAPI.AddCard({ number: cardInfo.number, date: cardInfo.expiryMonth + "/" + cardInfo.expiryYear, name: cardInfo.brand, token }),
        mutationKey: ['addCard'],
    })
    const DeleteCard = useMutation({
        mutationFn: (data) => UserAPI.DeleteCard({ ...data, token }),
        mutationKey: ['deleteCard'],
    })

    // useEffect(()=>{
    //   console.log(id);
    // },[id])
    // useEffect(()=>{
    //     console.log(index);
    // },[index])
    const DelAddress = (index) => {
        console.log("===========");
        console.log(cardList.data);
        DeleteCard.mutate({ id: cardList.data[index].id }, {
            onSuccess: (res) => {
                Toast.show("Successfully deleted");
                cardList.refetch();
            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
            }
        })
    }
    const AddDefault = () => {
        console.log(cardList.data[index.index].id)
        setDefault.mutate({ id: cardList.data[index.index].id }, {
            onSuccess: (res) => {
                Toast.show("Successfully modified");
                cardList.refetch();
            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
            }
        })
    }



    if (cardList.isLoading) {

        return (
            <ActivityIndicator style={{ alignSelf: 'center', margin: 20 }} size={'larges'} />
        )
    }

    const renderItem = (item, i) => {
        // item={
        //    ...item,
        //    name:'Mastercard'
        // }
        return (<View key={i} style={{

            backgroundColor: item.name == 'Visa' ? '#4d7bc6' : (item.name === 'MasterCard' ? '#939ba2' : '#121e2c')
            , width: width - 32, padding: 10, borderRadius: 10, borderColor: (item.name !== 'Visa' || item.name !== "MasterCard") ? "rgba(0,0,0,0.3)" : null, borderWidth: 1,

            shadowColor: 'rgba(0,0,0,0.5)', shadowOffset: { width: 2, height: 2 }, shadowRadius: 20, shadowOpacity: 0.3, marginTop: 10
        }}>
            {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 5, height: 25, backgroundColor: 'rgb(98,141,47)', borderRadius: 12, marginRight: 4 }}></View>
                <Octicons style={{ marginRight: 4 }} name="dot-fill" size={28} color="rgb(180,223,122)" />
            </View> */}

            <View>
                <View style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 18, color: item.name !== 'Visa' && item.name !== 'MasterCard' ? '#000' : '#fff' }}>**** **** **** {item?.number?.slice(item.number.length - 4, item.number.length)}</Text>
                    {/* <Pressable onPress={() => {
                        if (item.is_default) return;
                        AddDefault();
                    }}>
                        <Text style={{ color: item.name !== 'Visa' && item.name !== 'Mastercard' ? '#000' : '#fff', fontWeight: item.is_default ? 'normal' : 'bold' }}>{item.is_default ? 'Default' : "Use this card"}</Text>
                    </Pressable> */}
                    <View>
                        <Pressable style={{ paddingHorizontal: 12, paddingVertical: 5 }} onPress={() => {
                            navigation.navigate("UpdateCard", { id: item.id })
                        }}>
                            <FontAwesome name="pencil" size={18} color={(item.name !== 'Visa' && item.name !== "MasterCard") ? "rgba(0,0,0,0.3)" : "white"} />
                        </Pressable>
                        <Pressable style={{ paddingHorizontal: 12, paddingVertical: 5, marginTop: 12 }} onPress={() => {
                            Alert.alert("Notice", "Are you sure you want to delete this card ?", [
                                {
                                    text: 'Confirm',
                                    style: "cancel",
                                    onPress: () => {
                                        DelAddress(i);
                                    }
                                },
                                {
                                    text: "Cancel",
                                    onPress: () => {

                                    }
                                }
                            ])
                            //
                        }}>
                            <AntDesign name="delete" size={18} color={(item.name !== 'Visa' && item.name !== "MasterCard") ? "rgba(0,0,0,0.3)" : "white"} />
                        </Pressable>
                    </View>
                </View>
                <Text style={{ marginTop: 16 }}></Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={{ color: item.name !== 'Visa' && item.name !== 'MasterCard' ? '#000' : '#fff' }}>EXP:{item?.date}</Text>
                    {
                        (item.name === 'Visa' || item.name === 'MasterCard') ? <Image style={{ width: 80, height: 40 }} resizeMode="contain" source={item.name === 'Visa' ? visaIcon : masterIcon} /> : <Text style={{ fontWeight: 'bold', height: 40, fontSize: 25, color: '#fff', lineHeight: 40 }}>{item?.name}</Text>
                    }
                </View>
            </View>
        </View>)
    }

    return (<ScrollView refreshControl={<RefreshControl onRefresh={cardList.refetch} refreshing={cardList.isLoading || cardList.isFetching} />} style={{ paddingHorizontal: 16 }}>


        {

            cardList.isSuccess && cardList.data.map((r, i) => {
                return (
                    renderItem(r, i)
                )
            })
        }

        {/* <Text style={{ textAlign: 'center', marginTop: 18, color: 'rgba(0,0,0,0.4)', marginTop: 50, marginBottom: 10 }}>{cardList?.data?.length ? "OR" : "Please add your card at first"}</Text> */}
        {/* {!cardList?.data?.length} */}
        <Pressable onPress={() => setVisible(true)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 12, marginBottom: 96 }}>
            <Ionicons name="add-circle-outline" size={24} color="black" style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16 }}>Click to add bank card</Text>
        </Pressable>

        {/* 
     
*/}
        <Modal visible={visible} onRequestClose={() => setVisible(false)} transparent={true}>
            {/* <StatusBar backgroundColor="rgba(0,0,0,0.5)" /> */}
            <View style={{ width: '100%', height: '100%', backgroundColor: 'white', paddingHorizontal: 16 }}>
                <Pressable onPress={() => { setVisible(false) }} style={{ marginTop: Dimensions.get('screen').height * 0.06, width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={30} color={'black'} />
                </Pressable>
                <CardField
                    postalCodeEnabled={true}

                    placeholder={{
                        number: ''
                    }}
                    onCardChange={(e) => {
                        console.log(e);
                        if (e.brand && e.complete) {
                            setCardInfo(e);
                        }
                    }}

                    dangerouslyGetFullCardDetails={true}
                    style={{ height: 60, margin: '2.5%' }}

                />


                <Pressable onPress={() => {
                    //////console.log(1)

                    if (AddCard.isLoading) return;
                    if (cardInfo.brand && cardInfo.complete) {
                        AddCard.mutate(null, {
                            onSuccess: (res) => {
                                Toast.show("Card successfully added");
                                cardList.refetch();
                                // setCardInfo({})
                                setVisible(false);
                            },
                            onError: (res) => {
                                Alert.alert("Notice", res instanceof Error ? res.message : JSON.stringify(res))
                            }
                        })
                    } else {
                        Alert.alert("Notice", 'Invalid card!')
                    }

                }} style={{ marginTop: 10, height: 50, backgroundColor: AddCard.isLoading ? 'gray' : config.primaryColor, borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ paddingVertical: 16, fontSize: 16, color: 'white' }}>{AddCard.isLoading ? 'Submiting' : 'ADD CARD'}</Text>
                </Pressable>
            </View>
        </Modal>

    </ScrollView>)
}