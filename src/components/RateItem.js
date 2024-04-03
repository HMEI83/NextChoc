import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function RateItem(props) {
    return (<View style={{ paddingBottom: 12, borderBottomColor: 'rgba(0,0,0,0.1)', borderBottomWidth: 1 }}>
        <View style={{display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
            <View>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>zhzhf</Text>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.3)', marginTop: 4 }}>2020.02.12</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {
                    [1, 2, 3, 4, 5].map((item, index) => {
                        if (props.item.score >= index) {
                            return (<AntDesign key={index} name="star" size={18} color="rgb(240,185,55)" style={{ marginRight: 4 }} />)
                        } else return (<AntDesign key={index} name="star" size={18} color="rgba(0,0,0,0.1)" style={{ marginRight: 4 }} />)
                    })
                }
            </View>
        </View>



        <Text numberOfLines={3} style={{ marginTop: 4 }}>we are going to a xxx x x x x x   xxxx x  xx  x   x  x xxxxx xx x xx x x x x</Text>
    </View>)
}