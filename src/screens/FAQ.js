import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview'
import config from '../common/config';
import { ActivityIndicator } from 'react-native';

export default function FAQ() {



  return (
    <View style={{ flex: 1, display: 'flex' }}>

      <WebView source={{ uri: 'https://nextchoc.com.au/faq' }}
        startInLoadingState={true}
        renderLoading={() => <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={'large'} style={{ alignSelf: 'center' }} color={config.primaryColor} /></View>}

        style={{ flex: 1 }} />



    </View>
  )
}