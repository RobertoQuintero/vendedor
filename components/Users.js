import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { firebaseapp } from "../firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { sendPushNotification } from "./InputForm";
const db = firebase.firestore(firebaseapp);

const Users = () => {
  const [users, setUsers] = useState();
  useEffect(() => {
    db.collection("user")
      .get()
      .then((response) => {
        const usersArray = [];
        response.forEach((doc) => {
          const user = doc.data();
          user.id = doc.id;
          usersArray.push(user);
        });
        setUsers(usersArray);
      });
  }, []);

  return (
    <View style={{ padding: 10, borderWidth: 1, borderColor: "#ccc" }}>
      {users ? (
        users.map((user, i) => <User user={user} key={i} />)
      ) : (
        <Text>No hay ususarios</Text>
      )}
    </View>
  );
};

export default Users;

const User = (props) => {
  const { name, token } = props.user;
  return (
    <View
      style={{
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 5,
      }}
    >
      <Text style={{ fontSize: 18, color: "#068908" }}>{name}</Text>
      <View style={{ alignItems: "center" }}>
        <Button
          title="Notificación"
          onPress={() => sendPushNotification(token)}
        />
      </View>
      <Text>{token}</Text>
    </View>
  );
};
const styles = StyleSheet.create({});
