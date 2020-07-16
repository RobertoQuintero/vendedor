import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as firebase from "firebase";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const setRegister = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
        navigation.navigate("login");
      });
  };
  return (
    <View style={styles.screen}>
      <TextInput
        value={email}
        placeholder="email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        value={password}
        placeholder="password"
        onChangeText={(text) => setPassword(text)}
      />
      <Button onPress={setRegister} title="Registrar" />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
