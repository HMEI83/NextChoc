import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, TextInput, ActivityIndicator, Linking } from 'react-native';
import ForgetHeaders from '../../../components/ForgetHeaders';
import AccountFlowButton from "../../../components/AccountFlowButton";
import { useState, useEffect } from "react";
import config from "../../../common/config";
import VerifyCode from "../../../components/VerifyCode";
import { useMutation } from "@tanstack/react-query";
import LoginAPI from "../../../api/LoginAPI";
import AccountInput from "../../../components/AccountInput";
import { useCommonActions, useToken, useUser } from "../../../common/store/user";
export default function CheckEmail({ route }) {
  const navigation = useNavigation();
  const [time, setTime] = useState(60);
  const [code, getCode] = useState("");
  const token = useToken();
  const user = useUser();
  const setUser = useCommonActions().setUser;
  const verify = useMutation({
    mutationFn: (data) => LoginAPI.verifyCode(data),
    mutationKey: ['verifyCodeByEmail'],
  })
  const updateUserMess = useMutation({
    mutationFn: (data) => LoginAPI.updateUserMess(data),
    mutationKey: ['updateUserMess'],
  })
  const sendCode = useMutation({
    mutationFn: (data) => LoginAPI.sendCode(data),
    mutationKey: ['sendCode']
  })
  const sendEmail = () => {
    if (time) {
      return;
    }
    setTime(60);
    sendCode.mutate({ email: route.params.account, event: route?.params?.type === "reset" ? 'changeinfo' : 'changepwd' }, {
      onSuccess: (res) => {
        // console.log(res);
        // navigation.navigate("ForgetPassword.CheckEmail",{account:route.params.account})
      },
      onError: (res) => {
        Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
      }
    })

  }
  const toVerify = () => {
    if (route?.params?.type === "reset") {
      verify.mutate({ account: route.params.account, validation_type: "email_validation", event: 'changeinfo', code }, {
        onSuccess: (res) => {
            updateUserMess.mutate({email:route.params.account,token},{
              onSuccess:(res)=>{
                console.log(res);
                setUser({...user,email:route.params.account})
                navigation.pop(3);
                Toast.show("Successfully modified")
              },
              onError:(res)=>{
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
              }
            })     
        },
        onError: (res) => {
          Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
        }
      })
    } else {
      verify.mutate({ account: route.params.account, validation_type: 'email_validation', code }, {
        onSuccess: (res) => {
          navigation.navigate("ForgetPassword.resetpsw", { account: route.params.account, type: 1 });
        },
        onError: (res) => {
          Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
        }
      })
    }

  }
  useEffect(() => {
    if (time !== 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);
  // useEffect(() => {
  //   if (route?.params?.type === "reset") {
  //     navigation.setOptions({
  //       headerTitle: "Reset Email",
  //     })
  //   }
  // }, [])
  return (<View style={{ marginTop: 60, paddingHorizontal: 12 }}>
    <ForgetHeaders title={route.params.type === "reset" ? "Set Email" : "Forget password"} />
    <Text style={{ fontSize: 32, display: 'flex' }}>Check your email</Text>
    <Text style={{ marginTop: 12, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>We have just sent a instructions email to {route.params.account}</Text>
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
      }
    </View>
    <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 50, width: '100%', borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1, paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 24 }}>
      <TextInput style={{ flex: 1, paddingVertical: 8 }} maxLength={6} value={code} onChangeText={getCode} placeholder="code"  ></TextInput>
    </View>



    {
      verify.isLoading ? <ActivityIndicator size={'large'} color={config.primaryColor} style={{ marginTop: 24 }} /> : (code.length === 6 ? <Pressable onPress={toVerify} style={{ height: 50, display: 'flex', marginTop: 24, alignItems: 'center', borderRadius: 24, justifyContent: 'center', backgroundColor: config.primaryColor, width: '100%' }}>
        <Text style={{ fontSize: 18, color: 'white' }}>{'Verify Code'}</Text>
      </Pressable> : <View style={{ opacity: 0.5, backgroundColor: config.primaryColor, marginTop: 24, height: 50, borderRadius: 24 }}><Text style={{ paddingVertical: 14, fontSize: 18, color: 'white', display: 'flex', textAlign: 'center', justifyContent: 'center', width: '100%' }}>
        {'Verify Code'}</Text></View>)
    }
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
      {/* <Pressable style={{ marginTop: 12, display: 'flex', textAlign: 'center', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}> */}
      {/* <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/terms-and-conditions/")}><Text numberOfLines={2} style={{ color: "#3567E7", lineHeight: 20, fontSize: 11 }}>Terms</Text></Pressable> */}
      {/* <Text style={{ lineHeight: 20, fontSize: 14, color: 'gray' }}> & </Text> */}
      {/* <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/privacy-policy/")}><Text numberOfLines={2} style={{ color: '#3567E7', lineHeight: 20, fontSize: 11 }}>Privacy policy</Text></Pressable> */}
      {/* </Pressable> */}
    </View>
  </View>)
}