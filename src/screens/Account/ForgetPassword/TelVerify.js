import { View, Text, Pressable, TextInput, ActivityIndicator, Dimensions, Linking } from 'react-native'
import AccountInput from '../../../components/AccountInput'
import AccountFlowButton from '../../../components/AccountFlowButton'
import { useNavigation } from '@react-navigation/native'
import ForgetHeaders from '../../../components/ForgetHeaders';
import { useState } from 'react';
import auth, { FirebaseAuthTypes, firebase } from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';
import { Entypo } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal'
import config from '../../../common/config';
import { useMutation } from '@tanstack/react-query';
import LoginAPI from '../../../api/LoginAPI';
export default function TelVerify({ route }) {
    const navigation = useNavigation();
    const [account, setAccount] = useState("");
    const [haccount, setHAccount] = useState("")
    const [countryCode, setCountryCode] = useState('AU')
    const [country, setCountry] = useState({ "callingCode": ["61"], "cca2": "AU", "currency": ["AUD"], "flag": "flag-au", "name": "Australia", "region": "Oceania", "subregion": "Australia and New Zealand" })
    const [visible, setVisible] = useState(false);
    const [withCountryNameButton, setWithCountryNameButton] = useState(false)
    const [withFlag, setWithFlag] = useState(true)
    const [withEmoji, setWithEmoji] = useState(true)
    const [withFilter, setWithFilter] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(false)
    const [withCallingCode, setWithCallingCode] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const verifyIsRegister = useMutation({
        mutationFn: () => LoginAPI.verifyIsRegister(account),
        mutationKey: ['verifyIsRegister'],
    })
    const onSelect = (country) => {
        //////console.log(country);
        setCountryCode(country.cca2)
        setCountry(country)
    }

    async function senCode() {
        if (account.trim() === "") {
            Toast.show("please enter your phone first!");
            return;
        }

        verifyIsRegister.mutate(null, {
            onSuccess: (res) => {
                if (route?.params?.type === "reset") {
                    if (!res.is_exists) {
                        navigation.navigate("ForgetPassword.Verify", { account: account, area_code: country.callingCode[0], isAllow: true, type: route?.params?.type })
                    } else {
                        Toast.show("This number is already registered");
                    }
                } else {
                    if (res.is_exists) {
                        navigation.navigate("ForgetPassword.Verify", { account: account, area_code: country.callingCode[0], isAllow: true, type: route?.params?.type })
                    } else {
                        Toast.show("You have not registered an account yet");
                    }
                }


                // console.log(res);

            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
            }
        })


    }
    return (<View style={{ marginTop: Dimensions.get("screen").height * 0.06, paddingHorizontal: 12 }}>
        <ForgetHeaders title={route?.params?.type === "reset" ? "Set Mobile" : "Forget password"} />
        <Text style={{ fontSize: 32, display: 'flex' }}>Verify Mobile</Text>
        <Text style={{ marginTop: 12, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>Enter your telephone number</Text>
        <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 50, width: '100%', borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 24 }}>
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
            <Pressable style={{ marginRight: 12 }} onPress={() => {
                // <Pressable style={{ marginRight: 12 }} onPress={() => {
                //console.log("1");
                setVisible(true);

            }}>
                <Entypo name="chevron-down" size={16} style={{}} color="black" />
            </Pressable>
            <Text style={{ fontSize: 16, fontWeight: '600', marginRight: 12 }}>{"+" + country.callingCode[0]}</Text>
            <TextInput style={{ flex: 1, fontSize: 16 }} value={haccount} onChangeText={(res) => {
                console.log(num);
                let num = res.trim();
                setHAccount(res);
                if (num[0] === "0") {
                    console.log(num.replace())
                    console.log("第一個是0");
                    setAccount(num.replace("0", ""))
                } else setAccount(num);
            }} placeholder="please enter your phone number"></TextInput>
        </View>
        {verifyIsRegister.isLoading ? <ActivityIndicator style={{ marginTop: 16 }} size={'large'} color={config.primaryColor} /> : <AccountFlowButton topStyle={{ marginTop: 16 }} title={"Send Verify Code"} onClick={senCode} />}
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
            {/* <Text style={{ lineHeight: 20, textAlign: 'center', fontSize: 11, color: 'gray' }}>By logging in you have agreed to our </Text> */}
            {/* <Pressable style={{ marginTop: 12, display: 'flex', textAlign: 'center', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}> */}
            {/* <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/terms-and-conditions/")}><Text numberOfLines={2} style={{ color: "#3567E7", lineHeight: 20, fontSize: 11 }}>Terms</Text></Pressable> */}
            {/* <Text style={{ lineHeight: 20, fontSize: 14, color: 'gray' }}> & </Text> */}
            {/* <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/privacy-policy/")}><Text numberOfLines={2} style={{ color: '#3567E7', lineHeight: 20, fontSize: 11 }}>Privacy policy</Text></Pressable> */}
            {/* </Pressable> */}
        </View>
    </View>)
}