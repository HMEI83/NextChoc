import { View, Text, Pressable, TextInput, Dimensions, Keyboard, ActivityIndicator } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons';
import LoginSettting from './LoginSetting';
import { useState, useEffect } from 'react';
import config from '../../common/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoginAPI from '../../api/LoginAPI';
import { useCommonActions, useLoginMethod, useToken, useUser } from '../../common/store/user';
import { useNavigation } from '@react-navigation/native';
export default function ProfileSetting(props) {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [nickname, setnickname] = useState("");
    const [loginmess, setLoginmess] = useState(false);
    const LoginMethod = useLoginMethod();
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState("");
    const setUser = useCommonActions().setUser;
    const user = useUser();
    const token = useToken();
    const updateUserMess = useMutation({
        mutationFn: (data) => LoginAPI.updateUserMess(data),
        mutationKey: ['updateUserMess'],
    })


    const fetchBaseMess = useQuery({
        queryFn: () => LoginAPI.fetchBaseMess({ token }),
        queryKey: ['fetchBaseMess'],
        enabled: !!token,
        onSuccess: (res) => {
            console.log(res);
            setUser(res);
        }
    })

    const _submit = () => {
        if (nickname === "") return;
        setLoading(true);
        updateUserMess.mutate({ nickname, token }, {
            onSuccess: (res) => {
                setLoading(false)
                Toast.show("update successful !");
                fetchBaseMess.refetch();

            },
            onError: (res) => {
                setLoading(false)
                Toast.show("update fail");
                //console.log("=====");
                //console.log(res);
            }
        })
    }
    useEffect(() => {
        //清除状态
        navigation.addListener("blur", () => {
            setLoginmess(false);
        })
    }, [])
    //console.log(props.mess);
    return (<View style={{ paddingHorizontal: 16 }}>
        {!loginmess && <>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* <Pressable onPress={() => props.back()}>
                    <Ionicons style={{ width: 80 }} name="chevron-back" size={24} color="black" />
                </Pressable> */}
                {/* <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, marginRight: 12 }}>Profile settings</Text> */}
                {/* <View style={{ width: 80 }} /> */}
            </View>
            <View style={{ marginTop: 16, borderBottomColor: 'rgba(0,0,0,0.1)', borderBottomWidth: 1, paddingBottom: 0 }}>
                <Text style={{ fontSize: 18 }}>Full name</Text>
                <TextInput style={{ paddingVertical: 12, fontSize: 18 }} placeholder={user.nickname} onChangeText={(data) => setnickname(data)} value={nickname} />
            </View>
            <Pressable onPress={
                () =>{
                    if(fetchBaseMess.data.primary_account==="email"){
                        return;
                      }else{
                         navigation.navigate("ForgetPassword.ResentLink",{type:"reset"});
                      // Toast.show("waiting");
                      }
                }
            } style={{ marginTop: 36, borderBottomColor: 'rgba(0,0,0,0.1)', borderBottomWidth: 1, paddingBottom: 0 }}>
                <Text style={{ fontSize: 18 }}>Email address</Text>
                <Text style={{ paddingVertical: 12, color: 'rgba(0,0,0,0.2)', fontSize: 18 }}>{user.email}</Text>
            </Pressable>
            <Pressable onPress={
                () =>{
                    if(fetchBaseMess.data.primary_account==="mobile"){
                        return;
                      }else{
                        navigation.navigate("ForgetPassword.telver",{type:"reset"});
                        // Toast.show("waiting");
                      }
                }
            } style={{ marginTop: 36, borderBottomColor: 'rgba(0,0,0,0.1)', borderBottomWidth: 1, paddingBottom: 0 }}>
                <Text style={{ fontSize: 18 }}>Phone number</Text>
                {
                    // LoginMethod==="google"|LoginMethod==="email"?
                    // <TextInput style={{ paddingVertical: 12, borderBottomColor: 'rgba(0,0,0,0.2)', color: 'rgba(0,0,0,0.2)', borderBottomWidth: 1, fontSize: 18 }} placeholder={props.mess.mobile} value={mobile} onChangeText={(data)=>setMobile(data)} />
                    // :
                    <Text style={{ paddingVertical: 12, color: 'rgba(0,0,0,0.2)', fontSize: 18 }}>+{user.area_code}{user.mobile}</Text>
                }
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Account.login.setting')} style={{ marginTop: 36 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'rgba(0,0,0,0.1)', borderBottomWidth: 1, paddingBottom: 20 }}>
                    <Text style={{ fontSize: 18 }}>Set new password</Text>
                    <AntDesign style={{ marginLeft: 12 }} name="right" size={20} color="gray" />

                </View>
            </Pressable>


            {
                loading && <ActivityIndicator style={{ alignSelf: 'center', margin: 20 }} size={'large'} />
            }
            {
                !loading && <Pressable onPress={() => {
                    Keyboard.dismiss();
                    _submit();
                }} style={{ marginHorizontal: 24, marginTop: 24, borderRadius: 24, display: 'flex', backgroundColor: config.primaryColor, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', paddingVertical: 12, fontSize: 16 }}>Update</Text>
                </Pressable>
            }

            {/* <Pressable onPress={() => props.back()} style={{ marginHorizontal: 24, marginTop: 24, borderRadius: 24, display: 'flex', backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', paddingVertical: 12, fontSize: 16 }}>Go Back</Text>
            </Pressable> */}




        </>}
        {/* {
            loginmess && <LoginSettting backToTop={() => {
                setLoginmess(false);
                props.back();
            }} back={() => setLoginmess(false)} mess={fetchBaseMess} />
            // loginmess&&<Text>123</Text>
        } */}
    </View>)
}