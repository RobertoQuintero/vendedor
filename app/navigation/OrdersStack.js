import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Orders from "../screens/Orders/Orders";
import Order from "../screens/Orders/Order";

const Stack = createStackNavigator();

const OrdersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="orders"
        component={Orders}
        options={{ title: "Ordenes" }}
      />
      <Stack.Screen
        name="order"
        component={Order}
        options={{ title: "Orden" }}
      />
    </Stack.Navigator>
  );
};

export default OrdersStack;
