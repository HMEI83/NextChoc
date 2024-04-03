import React, { Component, useEffect } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview'
import config from '../common/config';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const type = {
  "Suggest a restaurants": "suggest-restaurants",
  "Chat with us": "contact-us",
  "Join us": "join-us",
  "Private Policy": "private-policy",
}
export default function TotalWeb({ route }) {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.type,
    })
  }, [])

  return (
    <View style={{ flex: 1, display: 'flex' }}>
      <WebView source={{ uri: `${route.params.url}` }}
        startInLoadingState={true}
        renderLoading={() => <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={'large'} style={{ alignSelf: 'center' }} color={config.primaryColor} /></View>}

        style={{ flex: 1 }} />
    </View>
  )
}