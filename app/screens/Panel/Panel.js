import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";
//
import { firebaseapp } from "../../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);
//
import Loading from "../../components/Loading";
// import PanelInfo from "../../components/Panel/PanelInfo";
// import ListMeals from "../../components/Panel/ListMeals";

const Panel = ({ navigation }) => {
  const toastRef = useRef();

  const [kitchen, setKitchen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(false);

  const loadKitchen = useCallback(() => {
    setCheck(true);
    try {
      const idUser = firebase.auth().currentUser.uid;
      db.collection("kitchens")
        .doc(idUser)
        .get()
        .then((response) => {
          setKitchen(response.data());
        })
        .catch((err) => {
          toastRef.current.show("Error al cargar Información");
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setCheck(false);
  }, [setKitchen, setLoading]);

  useEffect(() => {
    let isAuth = true;
    if (isAuth) {
      loadKitchen();
    }
    return () => {
      isAuth = false;
    };
  }, [loadKitchen]);

  if (loading) return <Loading isVisible={true} text="Cargando" />;
  return (
    <>
      {console.log(kitchen)}
      {kitchen ? (
        <ScrollView style={styles.viewBody}>
          {/* <PanelInfo kitchen={kitchen} />
          <ListMeals
            navigation={navigation}
            idKitchen={kitchen.uid}
            token={kitchen.token}
            check={check}
          />*/}
          <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
      ) : (
        <View style={styles.viewIcon}>
          <Icon
            reverse
            type="material-community"
            name="plus"
            color="#00a680"
            containerStyle={styles.btnContainer}
            onPress={() => navigation.navigate("set-panel")}
          />
        </View>
      )}
    </>
  );
};

export default Panel;

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  viewIcon: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
