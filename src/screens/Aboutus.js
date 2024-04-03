import { useState, useRef } from "react";
import { ScrollView, View, Image, Text, Pressable, ActivityIndicator } from "react-native";
import Lottie from 'lottie-react-native';
import { WebView } from 'react-native-webview'
// import { navigationRef } from "../../../common/utils";/
import { navigationRef } from "../common/utils";
import config from "../common/config";
export default function Aboutus() {
    const [isAnima, setIsAnima] = useState(true);
    const animationRef = useRef(null);
    // const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const animate = () => {
        animationRef.current?.play(0, 80);
    }
    return (
        <View style={{ display: 'flex', flex: 1 }}>
            {/* <ScrollView style={{ display: 'flex', flex: 1 }}> */}

            {
                // <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    // {
                        // <WebView source={{ uri: 'https://nextchoc.com.au/about-us/' }} onLoad={() => } style={{ flex: 1 }} />
                        <WebView source={{ uri: 'https://nextchoc.com.au/about-us/' }}
                        startInLoadingState={true}
                        renderLoading={() => <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
                          <ActivityIndicator size={'large'} style={{ alignSelf: 'center' }} color={config.primaryColor} /></View>}
                
                        style={{ flex: 1 }} />
                    // }
                // </View>

            }



            {/* </ScrollView> */}
            {/* <WebView source={{uri:'https://nextchoc.com.au/faq/'}} onLoad={()=><ActivityIndicator size={"large"} color={config.primaryColor} />} style={{ flex: 1 }} /> */}

            {/* <View style={{ marginVertical: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'rgba(0,0,0,0.6)' }}>version 0.0.1-alpha</Text>
            </View> */}
        </View>)
}