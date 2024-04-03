import { View,Pressable,Text,Dimensions } from "react-native";
import { CardField } from "@stripe/stripe-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import UserAPI from "../api/UserAPI";
import config from "../common/config";
import { useNavigation } from "@react-navigation/native";
import { useToken } from "../common/store/user";
export default function UpdateCard({route}){
    const token=useToken();
    const navigation=useNavigation();
    const [cardInfo,setCardInfo]=useState({});
    const update = useMutation({
        mutationFn: (data) => UserAPI.UpdateCard({ ...data, token }),
        mutationKey: ['update']
    })
    const UpdateCard = () => {
        update.mutate({ number: cardInfo.number,id:route.params.id, date: cardInfo.expiryMonth + "/" + cardInfo.expiryYear, name: cardInfo.brand }, {
            onSuccess: (res) => {
                navigation.goBack();
                Toast.show("Successfully modified")
            },
            onError: (res) => {
                Toast.show("Modification failed")
            }
        })
    }

    return (<View>
         <View style={{ width: '100%', height: '100%', backgroundColor: 'white',paddingHorizontal:24 }}>
                {/* <Pressable onPress={() => { setVisible(false) }} style={{ marginTop: Dimensions.get('screen').height * 0.02, width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={30} color={'black'} />
                </Pressable> */}
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

                    if (update.isLoading) return;
                    if (cardInfo.brand && cardInfo.complete) {
                        UpdateCard()
                    } else {
                        Toast.show('invalid card!')
                    }

                }} style={{ marginTop: 10, height: 50, backgroundColor: update.isLoading ? 'gray' : config.primaryColor, borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ paddingVertical: 16, fontSize: 16, color: 'white' }}>{update.isLoading ? 'Submiting' : 'ADD CARD'}</Text>
                </Pressable>
            </View>
    </View>)
}