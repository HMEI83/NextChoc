import { useNavigation } from "@react-navigation/native";
import { Pressable, View, Text, ScrollView, Image, ActivityIndicator, Dimensions, KeyboardAvoidingView } from "react-native";
import AccountInput from "../../../components/AccountInput";
import AccountFlowButton from "../../../components/AccountFlowButton";
import { useCommonActions, useFlag } from "../../../common/store/user";
import { Ionicons } from "@expo/vector-icons";
import config from "../../../common/config";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import LoginAPI from '../../../api/LoginAPI'

export default function SignUp({ route }) {
    const setFlag = useCommonActions().setFlag;
    const flag = useFlag();
    const [selectedId, setSelectedId] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const [Loading, setLoading] = useState(false);
    const _signUp = () => {
        if (!selectedId) {
            Toast.show("Please agree to our terms and privacy policy");
            return;
        }
        setLoading(true);
        sendCode.mutate({ email: email, event: "register" }, {
            onSuccess: (res) => {
                setLoading(false);
                navigation.navigate("SignUp.Verify", { nickname: name, email, password, type: 0 })//type:0 注册邮箱 type:1 注册手机号
            },
            onError: (res) => {
                setLoading(false);
                //////console.log(res);
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
            }
        })
    }
    const toLogin = () => {
        navigation.navigate("SignIn.LoginWithPhone")
    }
    const sendCode = useMutation({
        mutationKey: ['sendCodeByEmail'],
        mutationFn: (data) => LoginAPI.sendCode(data)
    })


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, width: "100%" }}
            keyboardVerticalOffset={0}
            enabled={true}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        ><ScrollView style={{ marginTop: Dimensions.get("screen").height * 0.06, paddingHorizontal: 18 }}>
                <Pressable onPress={() => navigation.canGoBack && navigation.goBack()}>
                    <Ionicons name="arrow-back" style={{ width: 80 }} size={24} color="black" />
                </Pressable>
                <Text style={{ fontSize: 32, marginTop: 12, display: 'flex' }}>Let's <Text style={{ color: config.primaryColor }}>Sign you up,</Text></Text>
                <Text style={{ fontSize: 32 }}>your surprise box awaits</Text>
                <Text style={{ marginTop: 24, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>If you have an</Text>
                <View style={{ color: 'rgba(0,0,0,0.4)', fontSize: 18, display: 'flex', alignItems: 'center', flexDirection: 'row' }}><Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>account please </Text><Pressable onPress={toLogin}><Text style={{ color: config.primaryColor, fontSize: 18 }}>Sign in here</Text></Pressable></View>

                <AccountInput title={'Full name'} input={name} onInput={setName} placeholder={"Full name"} topStyle={{ marginTop: 24 }} />
                <AccountInput title={'Email address'} input={email} onInput={setEmail} placeholder={"abel@domain.com"} topStyle={{ marginTop: 24 }} />
                <AccountInput title={'Password'} input={password} onInput={setPassword} placeholder={"password"} topStyle={{ marginTop: 24 }} type={'password'} />

                <View style={{ marginTop: 36 }}>
                    {
                        sendCode.isLoading ? <ActivityIndicator size={'large'} color={config.primaryColor} /> : <AccountFlowButton title={'SIGN UP'} onClick={_signUp} />
                    }
                    {/* <AccountFlowButton title={'SIGN UP'} onClick={()=>navigation.popToTop()} /> */}
                </View>

                {/* <View style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                    <View><Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)' }}>By signing up, you have agreed to our</Text></View>
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
                        <Pressable><Text style={{ fontSize: 15, color: 'rgb(103,140,236)' }}>Terms and condition</Text></Pressable>
                        <Text style={{ color: 'rgba(0,0,0,0.5)' }}> & </Text>
                        <Pressable><Text style={{ fontSize: 15, color: 'rgb(103,140,236)' }}>Privacy policy</Text></Pressable>
                    </View>
                </View> */}

                <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>

                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Pressable onPress={() => setSelectedId(!selectedId)} style={{ width: 16, height: 16, borderColor: 'black', borderWidth: 1, marginRight: 8, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, backgroundColor: selectedId ? config.primaryColor : '#fff' }}>
                            {selectedId && <AntDesign name="check" size={16} color={selectedId ? '#fff' : '#000'} style={{}} />}
                        </Pressable>
                        <Text style={{ lineHeight: 20, textAlign: 'center', fontSize: 11, color: 'gray' }}>By logging in you have agreed to our </Text>
                        {/* <Pressable style={{ marginTop: 12, display: 'flex', textAlign: 'center', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}> */}
                        <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/terms-and-conditions/")}><Text numberOfLines={2} style={{ color: "#3567E7", lineHeight: 20, fontSize: 11 }}>Terms</Text></Pressable>
                        <Text style={{ lineHeight: 20, fontSize: 14, color: 'gray' }}> & </Text>
                        <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/privacy-policy/")}><Text numberOfLines={2} style={{ color: '#3567E7', lineHeight: 20, fontSize: 11 }}>Privacy policy</Text></Pressable>
                        {/* </Pressable> */}
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>)
}