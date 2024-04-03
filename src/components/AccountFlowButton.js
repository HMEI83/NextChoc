import { Pressable, Text, View } from "react-native";
import config from "../common/config";
export default function AccountFlowButton(props) {
    return (<Pressable style={{ ...props.topStyle }} onPress={() => props.onClick()}>
        <View style={{  display: 'flex', alignItems: 'center', borderRadius: 30,height:50,lineHeight:50,borderWidth:1,borderColor: config.primaryColor, justifyContent: 'center', backgroundColor: config.primaryColor, width: '100%', ...props.borderStyle }}>
            <Text style={{ fontSize: 16, color: 'white' }}>{props.title}</Text>
        </View>
    </Pressable>)
}