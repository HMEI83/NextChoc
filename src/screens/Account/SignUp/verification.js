import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from "react-native";
import { ST_Container } from "../../../components/ST_ScrollView";
import { AppStyle } from "../../AppStyle";
import VerifyCode from "../../../components/ST_VerifyCode";
import Config from "../../../constants/Colors";
import Check from "./check";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginAPI } from "../../../common/api/loginQuery";
import SignButton from "../../../components/ST_SignButton";
import { useNavigation } from "@react-navigation/native";
import {
  useCommonActions,
  useIsIntro,
  useToken,
} from "../../../common/store/user";
// import i18n from "../../../common/language";
const Login_verification = (props) => {
  const nav = useNavigation();
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(60);
  const [code, setCode] = useState("");


  const setToken = useCommonActions().setToken;
  const setIntro = useCommonActions().setIsIntro;
  const setProfile = useCommonActions().setProfile;
  const isIntro = useIsIntro();
  // const getVerify=useQuery({
  //   queryKey: ["getVerify"],
  //   queryFn: ()=>LoginAPI.sendVerify({email:props.route.params.userInfo.email,event:'register'}),
  //   enabled: !!props.route.params.userInfo.email,
  //   onError:(err)=>{
  //     Toast.show(err.message);
  //   },
  //   onSuccess:()=>Toast.show("Send successfully, please check it"),
  // })
  const getVerify=useMutation((data)=>LoginAPI.sendVerify(data))
  // getVerify.isSuccess&&//////console.log(getVerify.data)

  let register = useMutation((data) => LoginAPI.register(data));
  useEffect(() => {
    nav.setOptions({
      headerRight: () => "",
    });
  }, []);

  const setSecrete = () => {
    let ar2 = props.route.params.userInfo.email.split("@");
    let ar1;
    if (ar2[0].length <= 4) {
      ar1 = props.route.params.userInfo.email.slice(0, 1);
    } else {
      ar1 = props.route.params.userInfo.email.slice(0, 4);
    }
    let len = props.route.params.userInfo.email.length - ar1.length - ar2[1].length - 1;
    let str = ar1;
    for (let i = 0; i < len; i++) {
      str = str + "*";
    }
    str += "@" + ar2[1];
    return str;
  };
  const reset = () => {
    getVerify.mutate({email:props.route.params.userInfo.email,username:props.route.params.userInfo.username,event:'register'},{onError:(err)=>Toast.show(err.message)})
    setTime(60);
  };
  const submit = async () => {
    let params = {};
    if (props.route.params?.data?.baseInfo) {
      params = {
        ...props.route.params.data.baseInfo,
        name: props.route.params.data.remark,
        sex: props.route.params.data.sex,
        type: props.route.params.data.type,
        ...props.route.params.userInfo,
        code,
      };
    } else {
      params = {
        ...props.route.params.userInfo,
        code,
      };
    }
    try {
      let res = await register.mutateAsync(params);
      //////console.log(res);
      setToken(res.userinfo.token);
      setProfile(res.userinfo);
      setIntro("close");
      setVisible(true);
    } catch (e) {
      Toast.show(e.message);
    }
  };
  const getCode = (data) => {
    setCode(data);
  };
  const close = () => {
    setVisible(false);
    nav.navigate("App");
  };
  useEffect(() => {
    if (time !== 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);

  return (
    <ST_Container>
      <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, marginTop: 16, justifyContent: "space-between" }}
          >
            <View style={{ flex: 1 }}>
              <Text style={AppStyle.h1Title}>{i18n.t("sign_up_15")}</Text>
              <Text style={{}}>{i18n.t("sign_up_16")}</Text>
              <Text>{props.route.params.userInfo.email && setSecrete()}</Text>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <Text>{i18n.t("sign_up_17")}</Text>
                {time ? (
                  <Text>{"(" + time + "s)"}</Text>
                ) : (
                  <Pressable style={{ marginLeft: 20 }} onPress={() => reset()}>
                    <Text>{i18n.t("sign_up_22")}</Text>
                  </Pressable>
                )}
              </View>
              <VerifyCode getCode={getCode}></VerifyCode>
            </View>
            <View style={{}}>
              <Text
                style={{
                  color: Config.brandColor1,
                  fontSize: Config.captionSize,
                }}
              >
                {i18n.t("sign_up_7")}
              </Text>
              {/* <TouchableOpacity
                        style={{ marginTop: 16, width: '100%', backgroundColor: Config.natureColor1, height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}
                        onPress={() => submit()}
                    >
                        <Text style={AppStyle.h2ButtonTitle}>Comfirm</Text>
                    </TouchableOpacity> */}
              <SignButton
                Title={i18n.t("sign_up_18")}
                Press={() => submit()}
                canClick={code.length === 4}
              ></SignButton>
            </View>
          </View>
          <Check visible={visible} close={close}></Check>
        </View>
      </Pressable>
    </ST_Container>
  );
};

export default Login_verification;
