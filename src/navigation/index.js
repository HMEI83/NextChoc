import { NavigationContainer, DefaultTheme, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { BottomTabNavigator } from "./BottomNavigation";
import { navigationRef } from "../common/utils";
import SignUp from "../screens/Account/SignUp";
import Intro from "../screens/Account/Intro";
import Account_Telephone from "../screens/Account/SignUp/Account_Telephone";

import ForgetNavigation from "./ForgetNavigation";
import LoginWithPhone from "../screens/Account/SignIn/LoginWithPhone";
import LoginMethod from "../screens/Account/SignIn/LoginMethod";
import LoginWithEmail from "../screens/Account/SignIn/LoginWithEmail";
// import OpenPage from "../screens/Account/Intro/openPage";
import OpenPage from "../screens/Account/Intro/OpenPage";
import Choose from "../screens/Account/location/choose";
import BussinessNavigation from "./BussinessNavigation";
import Card from "../screens/Account/Card";
import FAQ from "../screens/FAQ";
import SearchPage from "../screens/Search/searchPage";
import Notices from "../screens/Notices";
import Aboutus from "../screens/Aboutus";
import SignUpVerify from "../screens/Account/SignUp/SignUpVerify";
import TotalWeb from "../screens/TotalWeb";
import * as Linking from 'expo-linking';
import FavorList from "../screens/Account/FavorList";

import NotFoundScreen from "../screens/NotFound";
import NotificationsSetting from "../screens/BottomAccount/Notification";
import ProfileSetting from "../screens/BottomAccount/ProfileSetting";
import LoginSettting from "../screens/BottomAccount/LoginSetting";
import UpdateCard from "../screens/UpdateCard";

const Stack = createNativeStackNavigator();
const prefix = Linking.createURL('/');
export default function Navigation() {
  DefaultTheme.colors.background = "white";

  //配置404和内部路由
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        App: {
          path: "/",
          screens: {
            Order: {
              path: "Order"
            }
          }
        },
        NotFound: {
          path: "*"
        },
        "Bussiness.shop": {
          path: "/shopDetail"
        }
      }
    }

  };
  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef} theme={DefaultTheme}>
      <Stack.Navigator initialRouteName={"App"} screenOptions={{ animation: "slide_from_right" ,headerTitleAlign:'center'}}>
        <Stack.Screen
          name="openPage"
          component={OpenPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Intro"
          component={Intro}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SignIn.LoginWithPhone"
          component={LoginWithPhone}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SignIn.LoginWithEmail"
          component={LoginWithEmail}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SignIn.Method"
          component={LoginMethod}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="App"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
            animation: "fade_from_bottom",
            gestureEnabled: false,headerTitleAlign:'center'
          }}
        />
        <Stack.Screen
          name="Account.Card"
          component={Card}
          options={{
            headerTitle: "Credit Cards",
            headerTintColor: 'black',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Account.FAQ"
          component={FAQ}
          options={{
            headerTitle: 'F&Q',
            headerTintColor: 'black',
          }}
        />
        <Stack.Screen
          name="Account_telephone"
          component={Account_Telephone}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Account.push"
          component={NotificationsSetting}
          options={{
            headerTitle: 'Notification Setting',
            headerTintColor: 'black',
            // headerShown: false,
          }}
        />

        <Stack.Screen
          name="Account.profile"
          component={ProfileSetting}
          options={{
            headerTitle: 'Profile Setting',
            headerTintColor: 'black',
            // headerShown: false,
          }}
        />

        <Stack.Screen
          name="Account.login.setting"
          component={LoginSettting}
          options={{

            headerBackTitle: "Profile",
            headerTitle: 'Login Setting',
            headerTintColor: 'black',
            // headerShown: false,
          }}
        />
        <Stack.Screen
          name="Account.chooseAddressMethod"
          component={Choose}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SearchPage"
          component={SearchPage}
          options={{
            headerShown: false,
            headerTintColor: 'black',
          }}

        />
        <Stack.Screen
          name="Account.WebPage"
          component={TotalWeb}
          options={{ headerTintColor: 'black' }}
        />
        <Stack.Screen
          name="Account.favorlist"
          component={FavorList}
          options={{

            headerTintColor: '#000',
            headerTitle: 'Favorite lists',
          }}
        />
        <Stack.Screen
          name="Notices"
          component={Notices}
          options={{
            headerTitle: 'Notices Center',
            headerTitleAlign: 'center',
            headerTintColor: 'black'
          }}
        />
        <Stack.Screen
          name="Aboutus"
          component={Aboutus}
          options={{
            headerTitle: 'About us',
            headerTitleAlign: 'center',
            headerTintColor: 'black'
          }}
        />
        <Stack.Screen
          name="SignUp.Verify"
          component={SignUpVerify}
          options={{
            headerShown: false,
          }}
        />
        {/* {AccountNavigation(Stack)} */}
        {/* {忘记密码流程} */}
        {ForgetNavigation(Stack)}
        {/*商家页面*/}
        {BussinessNavigation(Stack)}
         <Stack.Screen 
          name="UpdateCard"
          component={UpdateCard}
          options={{
            headerTitle:"Update"
          }}
          />

        <Stack.Screen
          name="NotFound"
          options={{

            headerTitleAlign: 'center',
            headerTintColor: 'black'
          }}
          component={NotFoundScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
