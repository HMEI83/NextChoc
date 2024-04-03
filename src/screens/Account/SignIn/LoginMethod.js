import { View, Text, Pressable, Platform, Dimensions } from "react-native";
import LoginButton from "../../../components/LoginButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
export default function LoginMethod() {
    const navigation = useNavigation();
    return (<View style={{ marginTop: Dimensions.get("screen").height * 0.06, paddingHorizontal: 16 }}>
        <Pressable onPress={() => navigation.canGoBack && navigation.goBack()} >
            <Ionicons name="arrow-back" style={{ width: 80 }} size={24} color="black" />
        </Pressable>
        <Text style={{ fontSize: 28, display: 'flex', marginTop: 24 }}>Choose login method</Text>
        <Text style={{ marginTop: 12, color: 'rgba(0,0,0,0.4)', fontSize: 18 }}>To experience all the features, you need to choose a method to log in
        </Text>

        <Pressable >
            <LoginButton title={'Connect with facebook'} source={require('../../../assets/images/facebook.png')} />
        </Pressable>
        <Pressable>
            <LoginButton title={'Connect with Google'} source={require('../../../assets/images/google.png')} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("SignIn.LoginWithPhone")}>
            <LoginButton title={'Login with phone'} source={require('../../../assets/images/phone.png')} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("SignIn.LoginWithEmail")}>
            <LoginButton title={'Login with email'} source={require('../../../assets/images/email.png')} />
        </Pressable>
    </View>)
}