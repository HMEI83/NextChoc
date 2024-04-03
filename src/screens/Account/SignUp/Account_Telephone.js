import { ScrollView, View, Text, TextInput, Pressable,Dimensions } from "react-native";
import CountryPicker from 'react-native-country-picker-modal'
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AccountFlowButton from "../../../components/AccountFlowButton";
import { useFlag } from "../../../common/store/user";
import { Ionicons } from "@expo/vector-icons";
export default function Account_Telephone({ route }) {
    const navigation=useNavigation();
    const [countryCode, setCountryCode] = useState('AU')
    const [country, setCountry] = useState({ "callingCode": ["61"], "cca2": "AU", "currency": ["AUD"], "flag": "flag-au", "name": "Australia", "region": "Oceania", "subregion": "Australia and New Zealand" })
    const [visible, setVisible] = useState(false);
    const [withCountryNameButton, setWithCountryNameButton] = useState(false)
    const [withFlag, setWithFlag] = useState(true)
    const [withEmoji, setWithEmoji] = useState(true)
    const [withFilter, setWithFilter] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(false)
    const [withCallingCode, setWithCallingCode] = useState(false)
    // //////console.log(route.params.flag);
    const onSelect = (country) => {
        //////console.log(country);
        setCountryCode(country.cca2)
        setCountry(country)
    }
    const _signUp=()=>{
       navigation.popToTop();
    }
    return (<ScrollView style={{  marginTop: Dimensions.get("screen").height*0.06, paddingHorizontal: 18 }}>
          <Pressable onPress={() => navigation.canGoBack && navigation.goBack()}>
            <Ionicons name="arrow-back" style={{ width: 80 }} size={24} color="black" />
        </Pressable>
        <Text style={{ fontSize: 32, display: 'flex',marginTop:12 }}>Get started with</Text>
        <Text style={{ fontSize: 32 }}>NextChoc</Text>

        <Text style={{ marginTop: 24, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>Enter your phone number to</Text>
        <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>use NextChoc and enjoy your</Text>
        <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>foods.</Text>

        <Text style={{ fontSize: 16, fontWeight: '500',marginTop:36 }}>
            Phone number
        </Text>
        <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, width: '100%', borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 8 }}>
            <CountryPicker
                {...{
                    countryCode,
                    withFilter,
                    withFlag,
                    withCountryNameButton,
                    withAlphaFilter,
                    withCallingCode,
                    withEmoji,
                    onSelect,
                }}
                visible={visible}
            />
            <Pressable style={{marginRight: 12}} onPress={()=>setVisible(true)}>
                <Entypo name="chevron-down" size={16} style={{  }} color="black" />
            </Pressable>
            <Text style={{ fontSize: 16, fontWeight: '600', marginRight: 12 }}>{"+" + country.callingCode[0]}</Text>
            <TextInput style={{ flex: 1, paddingVertical: 12 }} placeholder="please enter your phone number"></TextInput>
        </View>
        
        <View style={{ marginTop: 36 }}>
            <AccountFlowButton title={'SIGN UP'} onClick={_signUp} />
        </View>
    </ScrollView>)
}