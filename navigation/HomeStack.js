import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../components/Home";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} options={{ title: "Home" }} />
    </Stack.Navigator>
  );
};

export default HomeStack;
