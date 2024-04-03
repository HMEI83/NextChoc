import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 后端测试通知 https://expo.dev/notifications
export async function registerForPushNotificationsAsync() {
  let token;
  console.log("=============");
  token = (
    await Notifications.getExpoPushTokenAsync({
      // experienceId: "@yusi-dev/NextChoc",
      projectId: '2c3e6d98-2445-40a9-b42a-b131247192f1'
    })
  ).data;
  console.log("token");
  console.log(token);

  if (Device.isDevice) {
    console.log("获取通知权限");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log(finalStatus);
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      coonsole.log('通知被拒绝!')
      return;
    } else {
      console.log('通知已经被授予!')
    }
  } else {
    console.warn("非物理设备，推送不可用");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    }).catch((er) => {
      console.log("error");
      console.error(er);
    });
  }

  return token;
}