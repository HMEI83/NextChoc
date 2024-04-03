
import { Intro1 } from "./totalPage";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View, useWindowDimensions, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useCommonActions, useFlag } from "../../../common/store/user";
import config from "../../../common/config";
export default function Intro() {
    const Flag = useFlag();
    const setFlag = useCommonActions().setFlag;
    const setIsIntro = useCommonActions().setIsIntro;
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "second" },
        { key: "third" },
        { key: "fourth" },
    ]);
    //  //////console.log(setIsIntro("close"));
    useEffect(() => {
        const listener = navigation.addListener('beforeRemove', function (e) {
            if (e.data.action.type === 'GO_BACK') e.preventDefault()
        })
        // setIsIntro("");
        setIsIntro("close")
        return listener;
    }, [])
    const toSignUp = () => {
        setFlag("1");
        navigation.navigate("SignIn.LoginWithPhone")
    }
    const renderScene = React.useMemo(() => SceneMap({
        second: () => (
            <Intro1
                uri={require('../../../assets/images/first.png')}
                title="ECO"
                desc="Fight against hunger, food conservation, environmental protection"
                index={1}
            />
        ),
        third: () => (
            <Intro1
                uri={require('../../../assets/images/second.png')}
                title="Surprise box"
                desc="Each opening of the surprise box is a new discovery and surprise"
                index={2}
            />
        ),
        fourth: () => (
            <Intro1
                uri={require('../../../assets/images/last.png')}
                title="Great value"
                desc="Unlocking Great Value for Every Customer's Satisfaction!"
                index={3}
            />
        )
    }), [])
    //////console.log(Dimensions.get("screen").height,Dimensions.get("window").height);
    return (
        <View style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', justifyContent: 'center', marginBottom: Dimensions.get("window").height * 0.08 }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={() => null}
                style={{ marginBottom: Dimensions.get("screen").height * 0.07 }}
            />
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '8%' }}>
                    <View style={index === 0 ? style.button_group_select : style.button_group}></View>
                    <View style={index === 1 ? style.button_group_select : style.button_group}></View>
                    <View style={index === 2 ? style.button_group_select : style.button_group}></View>
                </View>
                {index !== 2 ? <View style={{ display: 'flex', flexDirection: 'row', borderRadius: 30, borderColor: config.primaryColor, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, width: '60%', marginTop: Dimensions.get("window").height * 0.025 }}>
                    <Pressable onPress={() => setIndex(index + 1)} style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ paddingVertical: 18, textAlign: 'center', color: config.primaryColor, fontSize: 18, marginRight: 12 }}>NEXT</Text>
                        <AntDesign name="arrowright" size={20} color={config.primaryColor} />
                    </Pressable>
                </View> : <View style={{ display: 'flex', flexDirection: 'row', borderRadius: 30, borderColor: config.primaryColor, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, width: '60%', marginTop: Dimensions.get("window").height * 0.025 }}>
                    <Pressable onPress={toSignUp} style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ paddingVertical: 18, textAlign: 'center', color: config.primaryColor, fontSize: 18, marginRight: 12 }}>GET STARTED</Text>
                        <AntDesign name="arrowright" size={20} color={config.primaryColor} />
                    </Pressable>
                </View>}
            </View>

        </View>
    );
}

const style = StyleSheet.create({
    button_group: { width: 8, height: 8, borderRadius: 50, backgroundColor: 'rgba(0,0,0,0.4)', marginRight: 12 },
    button_group_select: { width: 12, height: 12, borderRadius: 50, backgroundColor: config.primaryColor, marginRight: 12 }
})