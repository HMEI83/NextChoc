import { Pressable, Text, View } from "react-native";
import { navigationRef } from "../../../common/utils";
import * as Splash from 'expo-splash-screen'
import { useEffect, useRef, useState } from "react";
import Lottie from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";
import { PanResponder } from "react-native";
export default function OpenPage() {
    const animationRef = useRef(null);
    const navigation = useNavigation();
    const isOpen = useState(false);
    const animate = () => {
        // animationRef.current?.play(0, 80);


    }
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onPanResponderMove: (evt, gestureState) => {
            },
            onPanResponderRelease: (evt, gestureState) => {

                if (gestureState.dx >= 80) {
                    animationRef.current?.play(0, 150);
                } else {
                    Toast.show("Please swipe from the seat to the right")
                }
            },
            onPanResponderTerminate: (evt, gestureState) => {
            },
            onShouldBlockNativeResponder: (evt, gestureState) => false,
        })
    ).current;
    useEffect(() => {
        const listener = navigation.addListener('beforeRemove', function (e) {
            if (e.data.action.type === 'GO_BACK') e.preventDefault()
        })
        setTimeout(() => {
            console.log('llllll')
            Splash.hideAsync();
            isOpen[1](true);
        }, 1500);
        setTimeout(() => {
            navigationRef.navigate("Intro");
        }, 5000);



        return listener;
    }, [])
    return (<View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <View
        // {...panResponder.panHandlers}
        >
            <Lottie
                // progress={0.1}
                loop={false}
                onAnimationFinish={(e) => {
                    console.log(e)
                    console.log("=======");
                    //
                }}

                style={{ width: "90%", transform: [{ scale: 1.3 }] }}
                autoPlay={isOpen[0]}
                autoSize={true}
                ref={animationRef}
                source={require('../../../assets/lottie/a2.json')}
            />
        </View>
        <Pressable onPress={animate} style={{ marginTop: 36 }}>
            <Text style={{ marginTop: 34, fontSize: 32, fontWeight: 'bold', textShadowColor: 'grey', textShadowRadius: 5, textShadowOffset: { width: 0, height: 2 }, textAlign: 'center' }}>NextChoc</Text>
            <Text style={{ textAlign: 'center', opacity: 0.6, marginTop: 10 }}>Change the World, One Box at a Time </Text>

        </Pressable>
    </View>)
}