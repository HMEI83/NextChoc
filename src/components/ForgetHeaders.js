
import { View,Text, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
export default function ForgetHeaders(props){
    const navigation=useNavigation();
    return (<View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:36}}>
        <Pressable onPress={()=>navigation.canGoBack&&navigation.goBack()}>
        <Ionicons name="arrow-back" style={{width:80}} size={24} color="black" />

        </Pressable>
        <Text style={{textAlign:'center',flex:1,fontSize:18}}>{props.title}</Text>
        <View style={{backgroundColor:'red',width:80}}></View>
    </View>)
}