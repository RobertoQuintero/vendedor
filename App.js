import React from "react";
import { YellowBox } from "react-native";
import AppNavigator from "./app/navigation/AppNavigator";
import { decode, encode } from "base-64";
import { firebaseapp } from "./app/utils/firebase";

YellowBox.ignoreWarnings(["Setting a timer"]);
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  return <AppNavigator />;
}
