import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import Home from "../components/Home";
import OrdersStack from "./OrdersStack";
import PanelStack from "./PanelStack";

const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="kitchens"
      tabBarOptions={{
        inactiveTintColor: "#646464",
        activeTintColor: "#00a680",
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => screenOptions(route, color),
      })}
    >
      <Tab.Screen
        name="orders"
        component={OrdersStack}
        options={{ title: "Ordenes" }}
      />
      <Tab.Screen
        name="panel"
        component={PanelStack}
        options={{ title: "Panel" }}
      />
      <Tab.Screen
        name="account"
        component={Home}
        options={{ title: "Cuenta" }}
      />
    </Tab.Navigator>
  );
};

export default HomeStack;

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "orders":
      iconName = "notebook-outline";
      break;
    case "panel":
      iconName = "magnify";
      break;
    case "account":
      iconName = "home-outline";
      break;
    default:
      break;
  }

  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
