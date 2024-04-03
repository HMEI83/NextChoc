
import * as StoreReview from 'expo-store-review'
import { FontAwesome, MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons"
import { useState } from "react"
import { Pressable, ScrollView, Text, View, Switch, Linking, Dimensions, Image, ActivityIndicator } from "react-native"
import ProfileSetting from "./ProfileSetting";
import LoginSettting from "./LoginSetting";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import config from '../../common/config';
import { useCommonActions, useToken, useUser } from '../../common/store/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import UserAPI from '../../api/UserAPI';
export default function NotificationsSetting(props) {
    //console.log(props);
    const navigation = useNavigation();
    const token = useToken();
    const setUser = useCommonActions().setUser;
    const user = useUser();
    const [isEnabled, setIsEnabled] = useState();
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [isEnabled2, setIsEnabled2] = useState();
    // const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);

    const fetchBaseMess = useQuery({
        queryFn: () => LoginAPI.fetchBaseMess({ token }),
        queryKey: ['fetchBaseMess'],
        enabled: !!token,
        onSuccess: (res) => {
            console.log(res.is_allow_push_notify, res.is_allow_promot_notify);
            setUser(res);
            setIsEnabled(!!res.is_allow_push_notify);
            setIsEnabled2(!!res.is_allow_promot_notify)
        }
    })

    const setNotification = useMutation({
        mutationFn: () => UserAPI.changeNotification({ token }),
        mutationKey: ['setNotification'],
    })

    const setPromot = useMutation({
        mutationFn: () => UserAPI.changePromot({ token }),
        mutationKey: ['setPromot'],
    })



    if (fetchBaseMess.isFetching) {
        return <ActivityIndicator style={{ margin: 20, alignSelf: 'center' }} size={'large'} />
    }

    return (
        <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>{/**通知 */}
            {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable onPress={() => props.back()}>
                    <Ionicons style={{ width: 80 }} name="chevron-back" size={24} color="black" />
                </Pressable>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, marginRight: 12 }}>Push References </Text>
                <View style={{ width: 80 }} />
            </View> */}
            <Text style={{ marginTop: 24, fontSize: 18, letterSpacing: 0.1 }}>NOTIFICATIONS</Text>
            <View style={{ display: 'flex', paddingBottom: 18, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', marginTop: 24, alignItems: 'center' }}>
                <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons name="lock" size={24} color="black" />
                </View>
                <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 16 }}>Push notifications</Text>
                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>For daily update you will get</Text>
                </View>
                <View style={{ marginLeft: 'auto' }}>
                    {/* <Pressable onPress> */}
                    {<Switch
                        onValueChange={(e) => {
                            //console.log("1");

                            if (setNotification.isLoading) {
                                Toast.show("Editing, please do not click repeatedly")
                                return;
                            }
                            setIsEnabled(!isEnabled);
                            setNotification.mutate(null, {
                                onSuccess: (res) => {
                                    //console.log("2");
                                    // Toast.show("change success");
                                    fetchBaseMess.refetch();

                                },
                                onError: (res) => {
                                    //console.log("3");
                                    e.preventDefault();
                                    Toast.show("change fail");
                                }
                            })
                        }}
                        trackColor={{ false: '#767577', true: 'rgb(98,141,47)' }}
                        thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        // onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    }
                    {/* </Pressable> */}
                </View>
            </View>
            <View style={{ display: 'flex', paddingBottom: 18, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', marginTop: 24, alignItems: 'center' }}>
                <View style={{ width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons name="lock" size={24} color="black" />
                </View>
                <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 16 }}>Promotional notifications</Text>
                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>For daily update you will get</Text>
                </View>
                <View style={{ marginLeft: 'auto' }}>
                    {/* <Pressable ={}> */}
                    <Switch
                        trackColor={{ false: '#767577', true: 'rgb(98,141,47)' }}
                        thumbColor={isEnabled2 ? 'white' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onChange={(e) => {
                            e.preventDefault();
                        }}
                        onValueChange={(e) => {
                            //console.log(e);
                            if (setPromot.isLoading) {
                                Toast.show("Editing, please do not click repeatedly")
                                return;
                            }
                            setIsEnabled2(!isEnabled2);
                            // e.preventDefault();
                            setPromot.mutate(null, {

                                onSuccess: (res) => {
                                    // Toast.show("change success");

                                    //console.log("success");
                                    fetchBaseMess.refetch();
                                },
                                onError: (res) => {
                                    Toast.show("change fail");
                                    //console.log("fail");
                                }

                            })
                        }}
                        value={isEnabled2}
                    />
                    {/* </Pressable> */}
                </View>
            </View>


        </View>
    )
}