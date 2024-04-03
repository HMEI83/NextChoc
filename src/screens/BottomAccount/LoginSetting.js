import { View, Text, Pressable, TextInput, Dimensions, Keyboard } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCommonActions, useLoginMethod, useToken } from '../../common/store/user';
import config from '../../common/config';
import LoginAPI from '../../api/LoginAPI';
import { ActivityIndicator } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { navigationRef } from '../../common/utils';
export default function LoginSettting(props) {
    // console.log(props.mess);
    const [visible, setVisible] = useState([true, true, true]);
    const logout = useCommonActions().logout;
    // const token=useToken();
    const loginMethod = useLoginMethod();
    const setUser = useCommonActions().setUser;
    const [password, setPassword] = useState({
        password: "",
        new_password: "",
        confirm_password: "",
    })
    const token = useToken(); console.log(token);
    const resetPassword = useMutation({
        mutationFn: () => LoginAPI.resetPassword({ ...password, token }),
        mutationKey: ['resetPassword']
    })
    const backlogout = useMutation({
        mutationFn: (data) => LoginAPI.logout(data),
        mutationKey: ['backLogout'],
    })

    const toLogout = (data) => {
        backlogout.mutate({ token: data }, {
            onSuccess: (res) => {
                console.log(res);

            },
            onError: (res) => {
                console.log(res);
            }
        })
    }

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
        if (password.password === password.new_password) {
            Toast.show("The old and new passwords cannot be the same")
            return;
        }
        if (password.new_password !== password.confirm_password) {
            Toast.show("The two entered passwords do not match");
            return;
        }
        resetPassword.mutate(null, {
            onSuccess: async (res) => {
                Toast.show("update successful!");
                const tk = token;
                toLogout(tk);
                logout();
                if (loginMethod === "google") {
                    console.log("google登錄");
                    try {
                        await GoogleSignin.signOut();
                    } catch (error) {
                        console.error(error);
                    }
                }

                navigationRef.goBack();
            },
            onError: (res) => {
                Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
            }
        })
    }
    return (<View style={{ paddingHorizontal: 16 }}>
        {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable onPress={() => props.back()}>
                <Ionicons style={{ width: 80 }} name="chevron-back" size={24} color="black" />
            </Pressable>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, marginRight: 12 }}>Profile settings</Text>
            <View style={{ width: 80 }} />
        </View> */}
        {!!fetchBaseMess.data?.is_set_password && <View style={{ marginTop: 36, }}>
            <Text style={{ fontSize: 18 }}>Password</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 1 }}>
                <TextInput secureTextEntry={visible[0]} style={{ flex: 1, paddingVertical: 12, color: 'rgba(0,0,0,0.2)', fontSize: 18 }} value={password.password} onChangeText={(data) => setPassword({ ...password, password: data })} placeholder="old password" />
                <Pressable onPress={() => setVisible([!visible[0], visible[1], visible[2]])}>
                    {visible[0] ?
                        <Feather color={'rgba(0,0,0,0.4)'} name="eye-off" size={24} />
                        :
                        <Feather name="eye" size={24} color={'rgba(0,0,0,0.4)'} />
                    }
                </Pressable>
            </View>
        </View>}
        <View style={{ marginTop: 36 }}>
            <Text style={{ fontSize: 18 }}>New password</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 1 }}>
                <TextInput secureTextEntry={visible[1]} style={{ flex: 1, paddingVertical: 12, color: 'rgba(0,0,0,0.2)', fontSize: 18 }} value={password.new_password} onChangeText={(data) => setPassword({ ...password, new_password: data })} placeholder='new password' />
                <Pressable onPress={() => setVisible([visible[0], !visible[1], visible[2]])}>
                    {visible[1] ?
                        <Feather color={'rgba(0,0,0,0.4)'} name="eye-off" size={24} />
                        :
                        <Feather name="eye" size={24} color={'rgba(0,0,0,0.4)'} />}
                </Pressable>
            </View>
        </View>
        <View style={{ marginTop: 36 }}>
            <Text style={{ fontSize: 18 }}>Confrim password</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 1 }}>
                <TextInput secureTextEntry={visible[2]} style={{ flex: 1, paddingVertical: 12, color: 'rgba(0,0,0,0.2)', fontSize: 18 }} value={password.confirm_password} onChangeText={(data) => setPassword({ ...password, confirm_password: data })} placeholder='confrim password' />
                <Pressable onPress={() => setVisible([visible[0], visible[1], !visible[2]])}>
                    {visible[2] ?
                        <Feather color={'rgba(0,0,0,0.4)'} name="eye-off" size={24} />
                        :
                        <Feather name="eye" size={24} color={'rgba(0,0,0,0.4)'} />
                    }
                </Pressable>
            </View>
        </View>
        {
            resetPassword.isLoading ? <ActivityIndicator size={'large'} style={{ marginTop: 24 }} color={config.primaryColor} /> : <Pressable onPress={() => {
                Keyboard.dismiss();
                _submit();
            }} style={{ marginHorizontal: 24, marginTop: 24, borderRadius: 24, display: 'flex', backgroundColor: config.primaryColor, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', paddingVertical: 12, fontSize: 16 }}>Update</Text>
            </Pressable>


        }
        {/* <Pressable onPress={() => props.back()} style={{ marginHorizontal: 24, marginTop: 24, borderRadius: 24, display: 'flex', backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', paddingVertical: 12, fontSize: 16 }}>Go Back</Text>
        </Pressable> */}

    </View>)
}