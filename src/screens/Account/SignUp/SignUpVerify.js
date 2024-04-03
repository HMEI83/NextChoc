import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, TextInput,Dimensions, Platform, ActivityIndicator } from 'react-native';
import ForgetHeaders from '../../../components/ForgetHeaders';
import AccountFlowButton from "../../../components/AccountFlowButton";
import { useState, useEffect } from "react";
import config from "../../../common/config";
import VerifyCode from "../../../components/VerifyCode";
import { useMutation } from "@tanstack/react-query";
import { useCommonActions } from "../../../common/store/user";
export default function SignUpVerify({ route }) {
  const navigation = useNavigation();
  const [time, setTime] = useState(60);
  const [code, getCode] = useState("");
  const setToken=useCommonActions().setToken;
  const setUser=useCommonActions().setUser;
    const []=useState();
  //console.log(route.params);

  const _verify = () => {
      
    route.params.type ? registerByTel.mutate({}, {
      onSuccess: (res) => {
        //////console.log(res);
        // Toast.show(res.message);
        setToken(res.token);
        setUser(res.userinfo);
        navigation.popToTop();
      },
      onError: (res) => {
        Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
      }
    }) : registerByEmail.mutate({...route.params,code,device:Platform.OS}, {
      onSuccess: (res) => {
         //console.log(res);
        // Toast.show(res.message);
        setToken(res.token);
        setUser(res.userinfo);
        navigation.popToTop();
      },
      onError: (res) => {
        Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
      }
    })

    
  }
  const _signUp = () => {
    sendCode.mutate({email:route.params.email,event:"register"},{
        onSuccess:(res)=>{
          setTime(60);
          Toast.show("Successfully sent");
        },
        onError:(res)=>{
           Toast.show(res instanceof Error? res.message:JSON.stringify(res));
        }
    })
}

  const registerByEmail = useMutation({
    mutationKey: ['registerByEmail'],
    mutationFn: (data) => LoginAPI.registerByEmail(data),
  })
  const registerByTel = useMutation({
    mutationKey: ['registerByTel'],
    mutationFn: (data) => LoginAPI.registerByTel(data),
  })
  const sendCode=useMutation({
    mutationKey:['sendCodeByEmail'],
    mutationFn:(data)=>LoginAPI.sendCode(data)
})

  useEffect(() => {
    if (time !== 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }

  }, [time]);
  return (<View style={{  marginTop: Dimensions.get("screen").height*0.06, paddingHorizontal: 12 }}>
    {/* <ForgetHeaders /> */}
    <Text style={{ fontSize: 32, display: 'flex' }}>Check your Account</Text>
    <Text style={{ marginTop: 12, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>Enter the 4-Digit code sent to you </Text>
    {/* <Text style={{ marginTop: 12, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>on {route.params.telephone}</Text> */}
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Pressable style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, color: config.primaryColor }}>Having a problem?</Text>
      </Pressable>
      {
        time ? <Text style={{ width: 120, textAlign: 'center', marginTop: 24, fontSize: 18 }}>
          Resend in : {time}
        </Text> :
          <Pressable onPress={_signUp}>
            <Text style={{ width: 120, textAlign: 'center', marginTop: 24, fontSize: 18 }}>
              Resend Code
            </Text>
          </Pressable>
      }
    </View>
    <View style={{ marginRight: '40%' }}>
      <VerifyCode getCode={getCode} />
    </View>



    { registerByEmail.isLoading||registerByTel.isLoading?<ActivityIndicator size={'large'} color={config.primaryColor} />:(code.length === 4 ?<Pressable onPress={_verify} style={{ paddingVertical: 14, display: 'flex', marginTop: 50, alignItems: 'center', borderRadius: 8, justifyContent: 'center', backgroundColor: config.primaryColor, width: '100%' }}>
      <Text style={{ fontSize: 18, color: 'white' }}>{'Verify Code'}</Text>
    </Pressable> : <Text style={{ paddingVertical: 14, fontSize: 18, color: 'white', display: 'flex', marginTop: 50, textAlign: 'center', borderRadius: 8, justifyContent: 'center', opacity: 0.5, backgroundColor: config.primaryColor, width: '100%' }}>
      {'Verify Code'}</Text>)}
  </View>)
}