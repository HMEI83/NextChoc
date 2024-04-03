/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import ToastContainer from "react-native-toast-notifications";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ToastType = import("react-native-toast-notifications").ToastType;

declare global {

  let Toast: ToastContainer
  let AppToken: string | null


  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }


}

export type RootStackParamList = {
  Home: NavigatorScreenParams<RootTabParamList> | undefined;
  App: undefined;
  signIn: undefined | { flag: number };
  signUp: undefined | { flag: number };
  Intro: undefined;
  Follow: undefined;
  "Account_telephone": undefined | { flag: number };
  "ForgetPassword.ResentLink": undefined;
  "ForgetPassword.CheckEmail": undefined;
  "ForgetPassword.Verify": undefined;

};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Order: undefined;
  Search: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
