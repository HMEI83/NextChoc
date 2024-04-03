import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-notifications";
import Navigation from './navigation'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { registerForPushNotificationsAsync } from "../NoticeUtils";
import { useCommonActions } from "./common/store/user";
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency'

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});



export default function App() {
  const setDevToken = useCommonActions().setDevToken;
  const fetchPushNotificationToken = async () => {
    let res = await registerForPushNotificationsAsync()
      .catch((er) => {
        console.warn('通知服务注册失败')
        console.warn(er.message)
      })
    if (res) {
      setDevToken(res)
      console.log(res);
    } else {
      console.warn("Push Token get Failed!");
    }
  }




  useEffect(() => {
    fetchPushNotificationToken();
  }, [])

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
      <StatusBar />
      <Toast
        offsetBottom={150}
        normalColor={'rgba(0,0,0,0.8)'}
        style={{ borderRadius: 30, paddingHorizontal: 20 }}
        textStyle={{ color: 'white' }}
        offset={150}
        duration={2000}
        ref={(ref) => {
          (global as any)["Toast"] = ref;
        }}
      />
    </SafeAreaProvider>
  );
}