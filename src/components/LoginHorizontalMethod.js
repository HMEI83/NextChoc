import { useNavigation } from "@react-navigation/native";
import { View, Image, Pressable, Dimensions, Platform } from "react-native";
import { useMutation } from "@tanstack/react-query";
import LoginAPI from "../api/LoginAPI";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as FaceBook from 'react-native-fbsdk-next';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { useCommonActions, useDevToken } from "../common/store/user";
GoogleSignin.configure();



export default function LoginHorizontalMethod(props) {
  const setToken = useCommonActions().setToken;
  const setUser = useCommonActions().setUser;
  const devToken = useDevToken();
  const setLoginMethod = useCommonActions().setLoginMethod;
  const googleLogin = useMutation({
    mutationFn: (data) => LoginAPI.googleLogin(data),
    mutationKey: ['googleLogin'],
  })
  const facebookLogin=useMutation({
    mutationFn:(data)=>LoginAPI.faceBookLogin(data),
    mutationKey:['facebookLogin'],
  })
  console.log(props.selectedId);
  const googleSignIn = async () => {
    console.log("google登录");
    if (!props.selectedId) {
      Toast.show("Please agree to our terms and privacy policy");
      return
    }
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      console.log("登錄成功，獲取用戶數據成功，正在上傳")
      //console.log(userInfo,token.accessToken);
      googleLogin.mutate({ access_token: token.accessToken, device: Platform.OS, exponent_push_token: devToken }, {
        onSuccess: (res) => {
          setToken(res.token);
          setUser(res.userinfo);
          setLoginMethod("google");
          //console.log(res);
          navigation.popToTop();
        },
        onError: (res) => {
          //console.log("失败");
          //console.log(res);
        }
      })
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        //console.log("cancel")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        //console.log("in_progress")
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        //console.log("play services not avalable")
      } else {
        // some other error happened
        //console.log(error);
      }
    }
  };

  const FaceBookSignIn = async () => {
    if (!props.selectedId) {
      Toast.show("Please agree to our terms and privacy policy");
      return
    }
    try {
      let res = await FaceBook.LoginManager.logInWithPermissions([])
      if (res.isCancelled) {
        console.log("Login cancelled");
      } else {
        console.log(
          "Login success with permissions: " +
          res.grantedPermissions.toString()
        );
        
        if (Platform.OS === 'ios') {
          const result = await FaceBook.AuthenticationToken.getAuthenticationTokenIOS();
          console.log(result?.authenticationToken);
          fetchFaceBookMess(result?.authenticationToken)
        } else {
          const result = await FaceBook.AccessToken.getCurrentAccessToken();
          console.log(result?.accessToken);
          fetchFaceBookMess(result?.accessToken)
        }
        setLoginMethod("facebook");
        console.log(res)
      }


    } catch (er) {
      console.log(er)
    }



    // const response = await fbPromptAsync({
    //   permissions: ['public_profile', 'email']
    // });
    // console.log(response);
  }


  const fetchFaceBookMess=(data)=>{
      facebookLogin.mutate({access_token:data,device:Platform.OS,exponent_push_token:devToken},{
        onSuccess:(res)=>{
          console.log(res);
        },
        onError:(res)=>{
          console.log(res);
        }
      })
  }
  const rt=()=>{

  }
  const navigation = useNavigation();
  return (<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Pressable onPress={() => FaceBookSignIn()} style={{ marginRight: 20, width: 40, height: 40, backgroundColor: '#6495ED', borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
      <FontAwesome name="facebook" color={'#fff'} size={25} />
    </Pressable>
    {/* <LoginButton
      onLoginFinished={(error, result) => {
        if (error) {
          console.log("login has error: " + result.error);
        } else if (result.isCancelled) {
          console.log("login is cancelled.");
        } else {
          console.log(result);
          // AccessToken.getCurrentAccessToken().then(
          //   (data) => {
          //     console.log(data.accessToken.toString())
          //   }
          // )
        }
      }}
      onLogoutFinished={() => console.log('logout.')}
      loginTrackingIOS={'limited'}
      nonceIOS={'my_nonce'}
    /> */}
    <Pressable
      onPress={() => googleSignIn()}
      // onPress={()=>props.google()}
      style={{ marginRight: 20, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
      {/* <FontAwesome name="google" color={'#fff'} size={25} /> */}
      <Image source={require('../assets/images/google.png')} style={{ width: 25, height: 25 }} />
    </Pressable>
    {
      props.type === "phone" ? <Pressable style={{ width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 70, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate("SignIn.LoginWithEmail")}>

        {/* <Image source={require('../assets/images/email.png')} style={{ marginRight: 16, width: 30, height: 30 }} /> */}
        <FontAwesome name="envelope" color={'#fff'} size={25} />
      </Pressable> :
        <Pressable style={{ width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 70, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate("SignIn.LoginWithPhone")}>
          <FontAwesome name="phone" color={'#fff'} size={25} />
          {/* <Image source={require('../assets/images/phone.png')} style={{ marginRight: 16, width: 24, height: 24 }} /> */}
        </Pressable>
    }

  </View>)
}