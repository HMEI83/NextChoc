import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, TextInput, ActivityIndicator, Dimensions, Linking } from 'react-native';
import ForgetHeaders from '../../../components/ForgetHeaders';
import AccountFlowButton from "../../../components/AccountFlowButton";
import { useState, useEffect } from "react";
import config from "../../../common/config";
import VerifyCode from "../../../components/VerifyCode";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../../../common/api/API_URL";
import LoginAPI from "../../../api/LoginAPI";
import auth, { FirebaseAuthTypes, firebase } from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';
import AccountInput from "../../../components/AccountInput";
import { useCommonActions, useToken, useUser } from "../../../common/store/user";
export default function Verify({ route }) {
  const navigation = useNavigation();
  const token = useToken();
  const [time, setTime] = useState(60);
  const [code, getCode] = useState("");
  const user = useUser();
  const setUser = useCommonActions().setUser;
  const [length, setlength] = useState(6);
  const [confirm, setConfirm] = useState();
  const [loading, setLoading] = useState(false);
  console.log(route.params.type);
  const sendEmail = () => {
    if (time > 0) {
      return;
    }
    setTime(60);
    firebaseSendCode();
  }
  const verify = useMutation({
    mutationFn: (data) => LoginAPI.verifyCode(data),
    mutationKey: ['verifyCodeByEmail'],
  })
  const sendPhoneMess = useMutation({
    mutationFn: (data) => LoginAPI.sendPhoneMess({ mobile: route?.params?.account, area_code: route?.params?.area_code, event: route?.params?.type === "reset" ? "changeinfo" : "changepwd" }),
    mutationKey: ['sendPhoneMess'],
  })
  const updateUserMess = useMutation({
    mutationFn: (data) => LoginAPI.updateUserMess(data),
    mutationKey: ['updateUserMess'],
  })

  const firebaseSendCode = async () => {
    sendPhoneMess.mutate(null, {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (res) => {
        Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
      }
    })

  }
  const ConfirmCode = async () => {
    setLoading(true);
    if (route?.params?.type === "reset") {
      verify.mutate({ account: route?.params?.account, validation_type: 'firebase_validation', code, event: 'changeinfo' }, {
        onSuccess: (res) => {
          console.log(res);
          updateUserMess.mutate({ area_code: route?.params?.area_code, mobile: route?.params?.account, token }, {
            onSuccess: (res) => {
              console.log(res);
              setUser({ ...user, area_code: route?.params?.area_code, mobile: route?.params?.account })
              navigation.pop(3);
              Toast.show("Successfully modified")
            },
            onError: (res) => {
              console.log(res);
            }
          })
          setLoading(false);
        },
        onError: (res) => {
          Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
          setLoading(false);
        }
      })
    } else {
      verify.mutate({ account: route?.params?.account, validation_type: 'firebase_validation', code }, {
        onSuccess: (res) => {
          navigation.navigate("ForgetPassword.resetpsw", { account: route.params.account, area_code: route.params.area_code, type: 0 });
          setLoading(false);
        },
        onError: (res) => {
          Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
          setLoading(false);
        }
      })

    }

  }
  useEffect(() => {
    if (route?.params?.isAllow) {
      firebaseSendCode();
    }

  }, [route?.params?.isAllow])

  useEffect(() => {
    if (time !== 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);
  return (<View style={{ marginTop: Dimensions.get("screen").height * 0.06, paddingHorizontal: 12 }}>
    <ForgetHeaders title={route?.params?.type === "reset" ? "Set Mobile" : "Forget password"} />
    <Text style={{ fontSize: 32, display: 'flex' }}>Verify your phone number</Text>
    <Text style={{ marginTop: 12, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>Enter the 6-Digit code sent to you </Text>
    <Text style={{ marginTop: 12, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>on {"+" + route.params.area_code + route.params.account}</Text>
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
        <Text style={{ fontSize: 14, marginRight: 8 }}>Didn't receive?</Text>
        <Pressable onPress={sendEmail} style={{}}>
          <Text style={{ fontSize: 14, color: config.primaryColor }}>Send again</Text>
        </Pressable>
      </View>
      {
        <Text style={{ width: 120, textAlign: 'center', marginTop: 24, fontSize: 18 }}>
          Resend in : {time}
        </Text>
        // :
        //   <Pressable onPress={() => setTime(60)}>
        //     <Text style={{ width: 120, textAlign: 'center', marginTop: 24, fontSize: 18 }}>
        //       Resend Code
        //     </Text>
        //   </Pressable>
      }
    </View>
    {/* <View style={{ marginRight: '40%' }}> */}
    <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', height: 50, alignItems: 'center', paddingHorizontal: 12, width: '100%', borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1, paddingVertical: 14, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 24 }}>
      <TextInput style={{ flex: 1, fontSize: 16 }} value={code} onChangeText={getCode} maxLength={6} placeholder="code"  ></TextInput>
    </View>


    {loading ? <ActivityIndicator style={{ marginTop: 16 }} size={'large'} color={config.primaryColor} /> : (code.length === length ? <Pressable onPress={() => ConfirmCode()} style={{ paddingVertical: 12, display: 'flex', marginTop: 16, alignItems: 'center', borderRadius: 24, justifyContent: 'center', backgroundColor: config.primaryColor, width: '100%' }}>
      <Text style={{ fontSize: 18, color: 'white' }}>{'Verify Code'}</Text>
    </Pressable> : <View style={{ borderRadius: 24, marginTop: 16, backgroundColor: config.primaryColor, opacity: 0.5 }}><Text style={{ paddingVertical: 12, fontSize: 18, color: 'white', display: 'flex', textAlign: 'center', borderRadius: 24, justifyContent: 'center', opacity: 0.5, width: '100%' }}>
      {'Verify Code'}</Text></View>)}
    <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>

      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
        <Text style={{ lineHeight: 20, textAlign: 'center', fontSize: 11, color: 'gray' }}>By logging in you have agreed to our </Text>
        {/* <Pressable style={{ marginTop: 12, display: 'flex', textAlign: 'center', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}> */}
        <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/terms-and-conditions/")}><Text numberOfLines={2} style={{ color: "#3567E7", lineHeight: 20, fontSize: 11 }}>Terms</Text></Pressable>
        <Text style={{ lineHeight: 20, fontSize: 14, color: 'gray' }}> & </Text>
        <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/privacy-policy/")}><Text numberOfLines={2} style={{ color: '#3567E7', lineHeight: 20, fontSize: 11 }}>Privacy policy</Text></Pressable>
        {/* </Pressable> */}
      </View>


    </View>
  </View>)
}