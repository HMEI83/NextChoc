import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/BottomTab/Home";
import * as React from "react";
import Search from "../screens/BottomTab/Search";
import Orders from "../screens/BottomTab/Orders";
import Profile from "../screens/BottomTab/Profile";
import { Text } from "react-native";
import { Foundation, AntDesign, Feather, Fontisto } from '@expo/vector-icons';
const BottomTab = createBottomTabNavigator();

export function BottomTabNavigator() {

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'green',headerTitleAlign:'center'
        
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerTitle: "NextChoc",
          // tabBarActiveTintColor:'green',  
          tabBarLabel: ({ color }) => <Text style={{ fontSize: 12, color: color }}>Home</Text>,
          tabBarIcon: ({ color }) => <Foundation name="home" size={28} color={color} />
        })}
      />
      <BottomTab.Screen
        name="Search"
        component={Search}
        options={{
          headerTitle: "Discover",
          tabBarLabel: ({ color }) => <Text style={{ fontSize: 12, color: color }}>Discover</Text>,
          tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color={color} />
        }}
      />

      <BottomTab.Screen
        name="Order"
        component={Orders}
        options={{
          tabBarLabel: ({ color }) => <Text style={{ fontSize: 12, color: color }}>Orders</Text>,
          tabBarIcon: ({ color }) => <Fontisto name="file-1" size={24} color={color} />,
          // headerLeft:({})=><AntDesign name="close" size={24} style={{marginLeft:16}} />,
          headerTitleAlign: 'center',
          headerTitle: ({ }) => <Text style={{ fontSize: 18, fontWeight: '600' }}>Your Orders</Text>
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: "Account",
          tabBarLabel: ({ color }) => <Text style={{ fontSize: 12, color: color }}>Account</Text>,
          tabBarIcon: ({ color }) => <Feather name="user" size={28} color={color} />,

        }}
      />
    </BottomTab.Navigator>
  );
}
