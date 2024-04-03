// import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StatusBar } from "react-native";
import { Modal, View, Text } from "react-native";
import RateItem from "./RateItem";

import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import ShopAPI from "../api/ShopAPI";
import { useState } from "react";
export default function RateModal({ visible, onExit, id, token }) {
    //////console.log(visible);
    const [page, setPages] = useState(1);
    const evaluationList = useInfiniteQuery({
        queryFn: () => ShopAPI.fetchEvaluationList({ id: id, token, listRows: 5, page: page }),
        queryKey: ['evaluationList'],
        getNextPageParam: (_d, pages) => {
            return _d.current_page + 1 > _d.last_page ? false : _d.current_page + 1;
        },
        onSuccess: (res) => {
            setPages(page + 1);
            ////console.log(res);
        },
    })

    return (<Modal visible={visible} onDismiss={onExit} transparent={true}>

        <StatusBar backgroundColor="rgba(0,0,0,0.8)" />
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', width: "100%", height: '100%', display: 'flex' }}>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onExit}>

            </Pressable>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ padding: 16, backgroundColor: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <Pressable onPress={onExit}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <ScrollView style={{ marginTop: 12, maxHeight: 400 }}>
                        {/* {
                            <RateItem item={{ score: 4 }} />
                        } */}

                        {
                            evaluationList.isSuccess && evaluationList.data.pages.map((item, index) => {
                                if (!item.data.length) return <Text key={index} style={{textAlign:'center'}}>no comments</Text>
                                return item.data.map((it, idx) => {
                                    return (<RateItem key={idx} item={{ score: 4 }} />)
                                })

                            }


                            )}
                        {
                            evaluationList.isFetchingNextPage && <ActivityIndicator size={'small'} color={config.primaryColor} />
                        }
                    </ScrollView>
                </View>

            </View>
        </View>
    </Modal>)
}