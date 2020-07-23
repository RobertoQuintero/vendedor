import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserLogged from "../screens/Account/UserLogged";

const Stack = createStackNavigator();

export default AccountStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="account"
        component={UserLogged}
        options={{ title: "Cuenta" }}
      />
    </Stack.Navigator>
  );
};
