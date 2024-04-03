import { StatusBar } from "expo-status-bar";
import { Modal, View, Image, Pressable, Text, Platform } from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import config from "../common/config";
import { useNavigation } from "@react-navigation/native";
export default function ShopModal({ visible, onExit, mess }) {
    ////console.log("=====");
    ////console.log(mess);
    const navigation = useNavigation();
    const urlScheme = () => {

        const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${mess.lat},${mess.lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url).catch((er) => Toast.show('Map Not Found!'))
    }
    return (<Modal visible={visible} onDismiss={onExit} transparent={true}>
        <StatusBar backgroundColor="rgba(0,0,0,0.6)" />
        <View style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <View style={{ width: 355, display: 'flex', backgroundColor: 'white', borderRadius: 12, position: 'relative' }}>
                <Pressable onPress={onExit} style={{ position: 'absolute', top: 12, right: 12, zIndex: 100 }} >
                    <AntDesign name="close" size={28} color="white" />
                </Pressable>
                <Image source={{ uri: mess?.logo_format }} style={{ width: '100%', height: 240, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} resizeMode="cover" />
                <View style={{ padding: 16 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 24, fontWeight: '500' }}>{mess?.merchantname}</Text>
                        {<Pressable onPress={() => {
                            // setRatevisible(true);
                        }} style={{ width: 60, height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 50 }}>
                            <AntDesign name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 4 }} />
                            <Text style={{ color: 'gray' }}>{mess?.score === 0 ? '4.5' : mess?.score}</Text>
                        </Pressable>}
                    </View>

                    <Pressable onPress={urlScheme} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <Ionicons name="location-outline" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                        <View style={{ display: 'flex', justifyContent: 'center', flex: 1, borderBottomColor: 'black' }}>
                            <Text style={{ fontSize: 14, fontWeight: '500' }}>{mess?.merchantaddress ?? "empty"}</Text>
                        </View>
                    </Pressable>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                        <Feather name="clock" size={16} color={config.primaryColor} style={{ marginRight: 4 }} />
                        <View style={{ display: 'flex', justifyContent: 'center', flex: 1, borderBottomColor: 'black' }}>
                            <Text style={{ fontSize: 14, fontWeight: '500' }}>{mess?.bussinesshours ?? "9:00 - 18:00"}</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                        <Pressable onPress={() => {
                            navigation.navigate("Bussiness.shop", { id: mess.id });
                            onExit();
                        }} style={{ paddingHorizontal: 48, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, backgroundColor: config.primaryColor, borderRadius: 50 }}>
                            <Text style={{ color: 'white', marginRight: 12 }}>Go to the store ！</Text>
                            <AntDesign name="arrowright" size={16} color={'white'} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    </Modal>)
}