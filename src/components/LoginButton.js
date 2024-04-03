import { Image, View,Text } from "react-native";

export default function LoginButton(props){
    return (<View style={{display:'flex',width:'100%',flexDirection:'row',alignItems:'center',borderColor:'rgba(0,0,0,0.4)',borderWidth:2,borderRadius:8,marginTop:24,paddingVertical:12,paddingHorizontal:60}}>
        <Image source={props.source} style={{marginRight:16,width:30,height:30}} />
        <View>
          <Text style={{fontSize:18,letterSpacing:0.3}}>{props.title}</Text>
        </View>
    </View>)
}