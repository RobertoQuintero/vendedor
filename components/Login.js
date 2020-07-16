import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as firebase from "firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const setLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
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
      <Button onPress={setLogin} title="logear" />
      <View style={{ marginTop: 20 }}>
        <Text onPress={() => navigation.navigate("register")}>Registrate</Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
