import { View, Text, Image, ImageBackground, Pressable, ScrollView } from "react-native";
import { Ionicons, AntDesign, Feather, Foundation, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MapView from "react-native-maps";
export default function OrderDetail() {
    const navigation = useNavigation();
    return (<ScrollView>
        <View style={{ position: 'relative', width: '100%' }}>
            {/* <MapView
                style={{ width: '100%', height: 400 }}
                initialRegion={{
                    latitude:-29.30725436315374,
                    longitude:137.7287693788147,
                    latitudeDelta: 0.092,
                    longitudeDelta: 0.041,
                }}
            /> */}
            <View style={{ position: 'absolute', top: 40, display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'space-between', paddingHorizontal: 16 }}>
                {/* <Image source={require("../../assets/images/background_desc.jpg")} /> */}
                <Pressable onPress={() => navigation.canGoBack && navigation.goBack()} style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
            </View>

        </View>
        <View style={{ paddingLeft: 16, paddingRight: 48, paddingTop: 16, backgroundColor: 'rgb(251,248,241)', paddingBottom: 24 }}>
            <View style={{ display: 'flex', alignItems: 'center' }}>

                <Text style={{ paddingHorizontal: 16, fontSize: 48, color: 'rgb(44,76,6)', borderColor: 'rgb(44,76,6)', borderWidth: 2, borderRadius: 8, paddingVertical: 12, backgroundColor: 'rgb(180,223,122)'}}>AK47</Text>

            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>

                <View style={{ fontWeight: 'bold' }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>Alice Pizza - P.Le Loreto</Text>
                </View>
            </View>
            <View style={{ marginLeft: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 8 }}>
                <Ionicons name="location-outline" size={36} color="rgb(17,77,77)" style={{ marginLeft: 12, marginRight: 12 }} />
                <Pressable onPress={() => navigation.navigate("Bussiness.position")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Corso Buenos Aires 77</Text>
                    <Text style={{ marginTop: 4 }}>20124, Milano MI</Text>
                </Pressable>
            </View>
            <View style={{ marginLeft: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 8 }}>
                <Feather name="clock" size={36} color="black" style={{ marginLeft: 12, marginRight: 12 }} />
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Opening hour</Text>
                    <Text style={{ marginTop: 4, fontWeight: 'bold' }}>21:15-23:00</Text>
                </View>
            </View>
            <View style={{ marginLeft: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 8 }}>
                <FontAwesome5 name="pizza-slice" size={30} color="black" style={{ marginLeft: 16, marginRight: 12 }} />
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 8 }}>
                    <Text style={{ fontSize: 16 }}>1 × Magic Box</Text>
                </View>
            </View>
            <View style={{ marginLeft: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingBottom: 8 }}>
                <Foundation name="telephone" size={36} color="black" style={{ marginLeft: 16, marginRight: 12 }} />
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 8 }}>
                    <Text style={{ fontSize: 18 }}>123213123123</Text>
                </View>
            </View>
        </View>
        <View style={{ marginTop: 12 }}>
            <Text style={{ textAlign: "center" }}>#Nextchoc</Text>
            <View style={{ marginTop: 24,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center' }}>
                <View style={{width:60,marginRight:12,display:'flex',justifyContent:'center', shadowOffset: { width: 2, height: 2 }, elevation: 10, shadowRadius: 0, shadowOpacity: 0.1,alignItems:'center',height:60,borderRadius:12,backgroundColor:'rgb(251,248,241)'}}> 
                    <FontAwesome5 name="facebook" size={24} color="black" />
                </View>
                <View style={{width:60,marginRight:12,display:'flex',justifyContent:'center',shadowOffset: { width: 2, height: 2 }, elevation: 10, shadowRadius: 0, shadowOpacity: 0.1,alignItems:'center',height:60,borderRadius:12,backgroundColor:'rgb(251,248,241)'}}>
                    <FontAwesome5 name="instagram" size={24} color="black" />
                </View>
                <View style={{width:60,marginRight:12,display:'flex',justifyContent:'center', shadowOffset: { width: 2, height: 2 }, elevation: 10, shadowRadius: 0, shadowOpacity: 0.1,alignItems:'center',height:60,borderRadius:12,backgroundColor:'rgb(251,248,241)'}}>
                    <FontAwesome5 name="apple" size={24} color="black" />
                </View>
            </View>
        </View>
    </ScrollView>)
}