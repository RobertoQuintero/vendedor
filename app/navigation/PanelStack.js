import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Panel from "../screens/Panel/Panel";
import SetPanel from "../screens/Panel/SetPanel";
import AddMeal from "../screens/Panel/AddMeal";

const Stack = createStackNavigator();

const PanelStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="panel"
        component={Panel}
        options={{ title: "Panel" }}
      />
      <Stack.Screen
        name="set-panel"
        component={SetPanel}
        options={{ title: "Actualizar" }}
      />
      <Stack.Screen
        name="add-meal"
        component={AddMeal}
        options={{ title: "Nuevo platillo" }}
      />
    </Stack.Navigator>
  );
};

export default PanelStack;
