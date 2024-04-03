
import { Feather } from "@expo/vector-icons"
import { useState } from "react"
import { View,Text, TextInput, Pressable } from "react-native"
export default function AccountInput({topStyle,title,type,placeholder,onInput,input,maxLength}){
    const [posible,setPosible]=useState(type==="password"?true:false);
    // console.log(maxLength)
    const [flag,setFlag]=useState(true);
     return (<View style={{...topStyle}}>
        {/* <Text style={{fontSize:16,fontWeight:'500'}}>
            {title}
        </Text> */}
        <View style={{display:'flex',height:50,flexDirection:'row',alignItems:'center',paddingHorizontal:12,width:'100%',borderColor:'rgba(0,0,0,0.2)',borderWidth:1,backgroundColor:'rgba(0,0,0,0.06)',borderRadius:24}}>
            <TextInput style={{flex:1,fontSize:16}} maxLength={maxLength??1000} placeholder={placeholder} value={input} onChangeText={(e)=>onInput&&onInput(e)}  secureTextEntry={!posible?false:true} ></TextInput>
            <Pressable onPress={()=>setPosible(!posible)}>
            {
                type==="password"&&(posible?<Feather name="eye" size={24} color={'rgba(0,0,0,0.4)'}/>:<Feather color={'rgba(0,0,0,0.4)'} name="eye-off" size={24} />)
            }
            </Pressable>
        </View>
     </View>)
}