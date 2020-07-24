import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as Firebase from "firebase";
import firebase from "firebase";
import { firebaseapp } from "../../utils/firebase";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";

const UserLogged = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [reloadUserInfo, setReloadUserInfo] = useState(false);
  const [mealsId, setMealsId] = useState(null);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      const user = await firebase.auth().currentUser;
      setUserInfo(user);
    })();
    setReloadUserInfo(false);
  }, [reloadUserInfo]);

  useEffect(() => {
    let isAuth = true;
    if (isAuth) {
      const idKitchen = firebase.auth().currentUser.uid;
      db.collection("meals")
        .where("idKitchen", "==", idKitchen)
        .get()
        .then((response) => {
          const arrayId = [];
          response.forEach((doc) => {
            arrayId.push(doc.id);
          });
          setMealsId(arrayId);
        });
    }
    return () => (isAuth = false);
  }, []);
  return (
    <View style={styles.viewUserInfo}>
      {userInfo && (
        <InfoUser
          userInfo={userInfo}
          toastRef={toastRef}
          setLoading={setLoading}
          setLoadingText={setLoadingText}
        />
      )}
      <AccountOptions
        userInfo={userInfo}
        toastRef={toastRef}
        setReloadUserInfo={setReloadUserInfo}
      />
      <Button
        title="Cerrar sesión"
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionText}
        onPress={() => {
          AsyncStorage.removeItem("osluToken").then(() => {
            firebase.auth().signOut();
          });
        }}
      />
      <Button
        title="Actualizar Token"
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionText}
        onPress={() => {
          AsyncStorage.getItem("osluToken").then((x) => {
            mealsId.forEach((docId) => {
              db.collection("meals")
                .doc(docId)
                .update({ token: x })
                .then(() => console.log("ok"));
            });
          });
        }}
      />
      <Toast ref={toastRef} position="center" opacity={0.8} />
      <Loading isVisible={loading} text={loadingText} />
    </View>
  );
};

export default UserLogged;

const styles = StyleSheet.create({
  viewUserInfo: {
    minHeight: "100%",
    backgroundColor: "#f2f2f2",
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnCloseSessionText: {
    color: "#00a680",
  },
});
