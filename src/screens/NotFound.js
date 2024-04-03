import React from 'react';
import { View, Text, Pressable } from 'react-native';
import config from '../common/config';
import { useNavigation } from '@react-navigation/native';

const NotFoundScreen = () => {

    const nav = useNavigation()

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>page not found </Text>
            <Pressable onPress={() => nav.goBack()} style={{ paddingVertical: 15, paddingHorizontal: 40, backgroundColor: config.primaryColor, borderRadius: 30, marginTop: 30 }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>Go Back</Text>
            </Pressable>
        </View>
    );
};

export default NotFoundScreen;