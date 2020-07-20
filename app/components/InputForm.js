import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  AsyncStorage,
} from "react-native";
import { firebaseapp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

const InputForm = () => {
  const [name, setName] = useState();
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("osluToken").then((token) => {
      const UID = firebase.auth().currentUser.uid;
      db.collection("kitchens").doc(UID).update({
        token: token,
      });
      setExpoPushToken(token);
    });
  }, [expoPushToken]);
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
            onPress={() => {
              AsyncStorage.removeItem("osluToken").then(() =>
                firebase.auth().signOut()
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};
export default InputForm;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
