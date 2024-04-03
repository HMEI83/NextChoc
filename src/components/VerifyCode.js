import { StyleSheet, Text, TextInput, View, Pressable, Keyboard } from "react-native";
import React, { useState, useRef } from "react";

const VerifyCode = (props) => {

  const [textString, setTextString] = useState("");

  const renderText = () => {
    let inputs = [];
    for (let i = 0; i < props.length; i++) {
      inputs.push(
        <View
          key={i}
          style={{
            height: 64,
            width: 64,
            textAlign:'center',
            backgroundColor: 'white',
            borderRadius: 12,
            borderBottomColor:'rgba(0,0,0,0.4)',
            borderBottomWidth:1,
            // marginLeft: 16,
          }}
        >
          <Text style={[styles.text]}>{textString[i]}</Text>
        </View>
      );
    }

    return inputs;
  };

  return (
    <View style={{marginTop: 24 }}>
      <View>
        {/**text*/}
        <View style={[styles.textBox, { flexDirection: 'row', justifyContent:'center' }]}>
          <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
          {renderText()}
          </View>
        
        </View>

        {/**input*/}
        <TextInput
          style={styles.intextInputStyle}
          onChangeText={(text) => {
            setTextString(text);
            props.getCode(text);
            if (text.length === props.length) {
            //   Keyboard.dismiss();
            }
          }}
          underlineColorAndroid="transparent"
          maxLength={props.length}
          autoFocus={true}
          keyboardType="numeric"
          selectionColor="transparent"
        />
      </View>
    </View>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({
  viewBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#00aeff",
  },
  textBox: {
    width:'100%',
    position: 'absolute',
    left:0,
    right: 36,
  },
  text: {
    height: 64,
    width: 48,
    lineHeight: 64,

    borderColor: "#b9b9b9",
    color: "black",
    fontSize: 25,
    // marginLeft: 16,
    textAlign: "center",
  },
  focusText: {
    borderColor: "white",
  },
  inputItem: {
    lineHeight: 20,
    width: 80,
    textAlign: "center",
    height: 40,
  },
  intextInputStyle: {
    width: '100%',
    height: 40,
    fontSize: 25,
    color: "transparent",
  },
});