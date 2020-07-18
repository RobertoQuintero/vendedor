import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { StyleSheet, View, TextInput, Button, Platform } from "react-native";
import { firebaseapp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const InputForm = () => {
  const [name, setName] = useState();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      const UID = firebase.auth().currentUser.uid;
      db.collection("user").doc(UID).update({
        token: token,
      });
      setExpoPushToken(token);
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
  const setNameHandler = (text) => {
    setName(text);
  };
  const sendRequest = () => {
    const UID = firebase.auth().currentUser.uid;
    db.collection("user").doc(UID).set({
      name: name,
      date: new Date(),
      token: expoPushToken,
      userUid: UID,
    });
  };
  return (
    <View>
      <View style={{ padding: 10 }}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setNameHandler}
          style={{ marginBottom: 10 }}
        />
        <View style={{ marginBottom: 10 }}>
          <Button title="Enviar" onPress={sendRequest} />
        </View>
        <View>
          <Button
            title="Cerrar Sesión"
            onPress={() => firebase.auth().signOut()}
          />
        </View>
      </View>
    </View>
  );
};
export default InputForm;

export async function sendPushNotification(token) {
  const message = {
    to: token,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { data: "goes here" },
  };
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
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
    console.log(token);
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

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
