import { useNavigation } from "@react-navigation/native"
import { Pressable, View,Text } from "react-native"
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import GoogleMapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
export default function AddressPosition() {
    const navigation = useNavigation();
    const loading = useState(false);
    const mRef = useRef()
    return (<View style={{backgroundColor: 'rgb(251,248,241)',display:'flex',flex:1}}>
        <View style={{ position: 'relative', width: '100%' }}>
            {/* <MapView
                style={{ width: '100%', height: 600 }}
                initialRegion={{
                    latitude:-29.30725436315374,
                    longitude:137.7287693788147,
                    latitudeDelta: 0.092,
                    longitudeDelta: 0.041,
                }}
            /> */}
             <GoogleMapView
                loadingEnabled={loading[0]}
                initialCamera={{
                    zoom: 16, center: pos, heading: 0, pitch: 0
                }}
                scrollEnabled={true}
                showsScale={true}
                ref={(r) => (mRef.current = r)}
                provider={PROVIDER_GOOGLE}
                showsCompass={true}
                zoomControlEnabled={true}
                zoomEnabled={true}
                mapType={"standard"}
                zoomTapEnabled={false}
                style={{ width: '100%', height: 400, backgroundColor: 'red' }}
            >
            </GoogleMapView>
            <View style={{ position: 'absolute', top: 40, display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'space-between', paddingHorizontal: 16 }}>
                {/* <Image source={require("../../assets/images/background_desc.jpg")} /> */}
                <Pressable onPress={() => navigation.canGoBack && navigation.goBack()} style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
            </View>

        </View>
        <View style={{display:'flex',flex:1,justifyContent:'center',alignItems:'center'}}>
             <Text style={{fontSize:18}}>Alice Pizza - P.Le Loreto</Text>
             <Text style={{fontSize:15,marginTop:8}}>Corso Buenos Aires 77</Text>
             <Text style={{fontSize:12}}>20124, Milano MI</Text>
        </View>
    </View>)

}