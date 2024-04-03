import { View, Text, Pressable, TouchableHighlight, ScrollView, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, Linking } from "react-native";
import AccountInput from "../../../components/AccountInput";
import AccountFlowButton from "../../../components/AccountFlowButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import config from "../../../common/config";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import LoginAPI from '../../../api/LoginAPI'
import { useCommonActions, useDevToken } from "../../../common/store/user";
import LoginHorizontalMethod from "../../../components/LoginHorizontalMethod";
import { AntDesign } from "@expo/vector-icons";
import { registerForPushNotificationsAsync } from '../../../../NoticeUtils'

export default function LoginWithEmail() {
    const navigation = useNavigation();
    const loading = useState(false);
    const setUser = useCommonActions().setUser;
    const setLoginMethod = useCommonActions().setLoginMethod;
    const setToken = useCommonActions().setToken;
    const [method, setMethod] = useState(0);//0是密碼登錄，1為驗證碼登錄
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [selectedId, setSelectedId] = useState(false);
    const [flag, setFlag] = useState(0);
    const [time, setTime] = useState(0);
    // const [devToken,setDevToken]=useState("");
    const devToken = useDevToken();
    // console.log("========");
    // console.log(devToken);
    const googleLogin = useMutation({
        mutationFn: (data) => LoginAPI.googleLogin(data),
        mutationKey: ['googleLogin'],
    })

    const sendCode = () => {
        if (account.trim() === "") {
            Toast.show("please enter your account");
            return;
        }
        setTime(60)
        TosendCode.mutate({ email: account, event: "emaillogin" }, {
            onSuccess: (res) => {
                Toast.show("successful send");
            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
            }
        })
    }
    const Login = () => {
        //console.log(method, password);
        if (!selectedId) {
            Toast.show("Please agree to our terms and privacy policy");
            return;
        }
        if (password === "") {
            Toast.show(`Please enter your ${method ? "code" : "password"} !`);
            return;
        }

        loading[1](true);

        if (method) {
            if (password.length !== 6) {
                loading[1](false)
                Toast.show("Verification Code is Incorrect")
                return;
            }
            LoginByEmailWithCode.mutate({ account, code: password, exponent_push_token: devToken, device: Platform.OS, validation_type: "email_validation" }, {
                onSuccess: (res) => {
                    //////console.log(res);
                    setLoginMethod("Email");
                    setUser(res.userinfo);
                    setToken(res.token);
                    navigation.popToTop();
                    loading[1](false)
                },
                onError: (res) => {
                    loading[1](false)
                    Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                }
            })
        } else {
            LoginByEmailWithPassword.mutate({ account, exponent_push_token: devToken, password, device: Platform.OS }, {
                onSuccess: (res) => {
                    //////console.log(res);
                    loading[1](false)
                    setLoginMethod("Email");
                    setUser(res.userinfo);
                    setToken(res.token);
                    navigation.popToTop();
                },
                onError: (res) => {
                    loading[1](false)
                    Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
                }
            })

        }


    }


    const LoginByEmailWithPassword = useMutation({
        mutationKey: ['LoginByEmailWithPassword'],
        mutationFn: (data) => LoginAPI.loginByPassword(data),
    })
    const LoginByEmailWithCode = useMutation({
        mutationKey: ['LoginByEmailWithCode'],
        mutationFn: (data) => LoginAPI.loginByCode(data),
    })
    const TosendCode = useMutation({
        mutationFn: (data) => LoginAPI.sendCode(data),
        mutationKey: ['sendCode'],
    })

    useEffect(() => {
        let timer;
        if (time) {
            timer = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [time])
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, width: "100%" }}
            keyboardVerticalOffset={0}
            enabled={true}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView style={{ marginTop: Dimensions.get("screen").height * 0.06, paddingHorizontal: 18, display: 'flex' }} >
                <View style={{ flex: 1, height: Dimensions.get("window").height * 0.8 }}>
                    <Pressable onPress={() => navigation.canGoBack && navigation.goBack()}>
                        <Ionicons name="arrow-back" style={{ width: 80 }} size={24} color="black" />
                    </Pressable>
                    {/* <Text style={{ fontSize: 32, display: 'flex', marginTop: 24 }}>JUST <Text style={{ color: config.primaryColor }}>Sign in,</Text></Text>
                    <Text style={{ fontSize: 32 }}>we'll do the work</Text> */}
                    <Text style={{ fontSize: 32, display: 'flex', marginTop: 36 }}>Welcome to NextChoc</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', marginTop: 24 }}>
                        Please Enter Your Email Address
                    </Text>
                    <AccountInput title={'Email address'} input={account} onInput={setAccount} placeholder={"abel@domain.com"} topStyle={{ marginTop: 12 }} />
                    {
                        !!flag && (!method ?
                            <AccountInput title={'Password'} input={password} onInput={setPassword} topStyle={{ marginTop: 16 }} placeholder={"password"} type={'password'} />
                            : <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <AccountInput title={'Verify Code'} input={password} onInput={setPassword} maxLength={6} topStyle={{ display: 'flex', flex: 1, marginRight: 12 }} placeholder={"Verify Code"} />
                                {!time ?
                                    <Pressable onPress={() => sendCode()} style={{ height: 45, width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 16 }}>Resend</Text>
                                    </Pressable>
                                    :
                                    <Text style={{ height: 45, width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 45 }}>{time}</Text>
                                }
                            </View>)
                    }


                    <View style={{ marginTop: 16 }}>
                        {
                            !flag ? <AccountFlowButton title={'Continue'} onClick={() => {
                                if (selectedId) {
                                    setFlag(1);
                                    method && sendCode();
                                } else if (account === "") {
                                    Toast.show("Please enter your email address first");
                                }
                                else {
                                    Toast.show("Please agree to our terms and privacy policy");
                                }
                            }} /> : (loading[0] ? <ActivityIndicator size={'large'} color={config.primaryColor} /> : <AccountFlowButton title={'SIGN IN'} onClick={Login} />)
                        }
                    </View>
                    {
                        (<View style={{ width: '100%', marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            {!method ? <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => setMethod(1)}>
                                <FontAwesome name="exchange" style={{ marginRight: 8 }} size={16} color="black" />
                                <Text>Switch to code</Text>
                            </Pressable> : <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => setMethod(0)}>
                                <FontAwesome name="exchange" style={{ marginRight: 8 }} size={16} color="black" />
                                <Text>Switch to password</Text>
                            </Pressable>}
                            {
                                !method && <Pressable onPress={() => navigation.navigate("ForgetPassword.ResentLink")}>
                                    <Text>Forget password?</Text>
                                </Pressable>
                            }
                        </View>)
                    }

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
                </View>
                <LoginHorizontalMethod selectedId={selectedId} type="email" />
            </ScrollView>

        </KeyboardAvoidingView>)
}