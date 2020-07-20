import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { AsyncStorage, Platform } from "react-native";
import Home from "../components/Home";
import OrdersStack from "./OrdersStack";
import PanelStack from "./PanelStack";

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const HomeStack = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      AsyncStorage.setItem("osluToken", token).then((x) =>
        console.log("async", x)
      );
      console.log("token", token);
    });
    Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });
    return () => {
      Notifications.removeAllNotificationListeners();
    };
  }, []);

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

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    console.log(existingStatus);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}
