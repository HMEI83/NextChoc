import React, { Component } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import HomeAPI from '../api/HomeAPI';
import { useState } from 'react';
import { useToken } from '../common/store/user';
import config from '../common/config';


export default function Notice() {
  const [activeSections, setActiveSections] = useState([]);
  const token = useToken();

  const _fetchNoticeList = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) => HomeAPI.fetchnotification({ token, page: pageParam }),
    queryKey: ['fetchNoticeList'],
    getNextPageParam: (_d, pages) => {
      return _d.current_page + 1 > _d.last_page ? false : _d.current_page + 1;
    },
    onSuccess: (res) => {
      // //console.log(res);
      //console.log(res);
    },
    onError: (res) => {
      Toast.show(res instanceof Error ? res.message : JSON.stringify(res));
    }
  })

  const _renderHeader = (section, index) => {
    console.log(section, index);
    return (
      <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 12 }}>
        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',width:'90%'}}>
          <Text style={{}}>{section.title} </Text>
          <Text style={{color:'rgba(0,0,0,0.2)',fontSize:12}}>{section.human_date}</Text>
        </View>

        {
          activeSections[0] === index ? <AntDesign name='up' size={16} /> : <AntDesign name='down' size={16} />
        }
      </View>
    );
  }

  const _renderContent = (section) => {
    console.log(section)
    return (
      <View style={{ padding: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 8 }}>
        <Text>{section.content}</Text>
      </View>
    );
  }

  const _updateSections = (activeSections) => {
    ////////console.log(activeSections);
    setActiveSections(activeSections);
  }


  return (
    <ScrollView style={{ margin: 12, flex: 1 }}>
      {_fetchNoticeList.isFetching ? <ActivityIndicator size={'large'} color={config.primaryColor} style={{ marginTop: 48 }} /> : _fetchNoticeList.isSuccess ? (_fetchNoticeList.data.pages.length ?
        _fetchNoticeList.data.pages.map((item, index) => {
          //console.log(item);
          return (<Accordion
            key={index}
            sections={item.data}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            containerStyle={{ marginBottom: 24 }}
            sectionContainerStyle={{ marginBottom: 24 }}
            underlayColor={"transparent"}
          />)

        })

        : <Text style={{ display: 'flex', textAlign: 'center', fontSize: 18, marginTop: 48, fontWeight: '500' }}>Empty</Text>) : <Text style={{ display: 'flex', marginTop: 48, textAlign: 'center', fontSize: 18, fontWeight: '500' }}>Fetch fail</Text>}
    </ScrollView>

  );
}