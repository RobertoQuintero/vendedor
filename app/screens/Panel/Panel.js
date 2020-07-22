import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Icon, Button, Avatar } from "react-native-elements";
import Toast from "react-native-easy-toast";
//
import { firebaseapp } from "../../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);
//
import PanelInfo from "../../components/Panel/PanelInfo";
import Card from "../../components/Card";

const Panel = ({ navigation }) => {
  const toastRef = useRef();

  const [kitchen, setKitchen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadKitchen = useCallback(() => {
    const idUser = firebase.auth().currentUser.uid;
    db.collection("kitchens")
      .doc(idUser)
      .get()
      .then((response) => {
        setKitchen(response.data());
        setLoading(false);
      })
      .catch((err) => {
        toastRef.current.show("Error al cargar Información");
        setLoading(false);
      });
  }, [setKitchen, setLoading]);

  useFocusEffect(
    useCallback(() => {
      let isAuth = true;
      if (isAuth) {
        loadKitchen();
      }
      return () => {
        isAuth = false;
      };
    }, [setKitchen, setLoading])
  );

  const loadMeals = useCallback(() => {
    setIsRefreshing(true);
    const idKitchen = firebase.auth().currentUser.uid;
    db.collection("meals")
      .where("idKitchen", "==", idKitchen)
      .get()
      .then((response) => {
        const resultMeal = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          resultMeal.push(data);
        });
        setMeals(resultMeal);
        setIsRefreshing(false);
      });
  }, [setMeals, setIsRefreshing]);

  useEffect(() => {
    let isActive = true;
    if (isActive) {
      loadMeals();
    }
    return () => {
      isActive = false;
    };
  }, [loadMeals]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const openHandler = () => {
    const idKitchen = firebase.auth().currentUser.uid;
    db.collection("kitchens")
      .doc(idKitchen)
      .update({ open: !kitchen.open })
      .then(() => {
        loadKitchen();
      });
  };

  return (
    <>
      {kitchen ? (
        <>
          <FlatList
            onRefresh={loadMeals}
            refreshing={isRefreshing}
            style={{ backgroundColor: "white" }}
            ListHeaderComponent={
              <>
                <PanelInfo kitchen={kitchen} openHandler={openHandler} />
                <Button
                  title="Agrega un platillo"
                  buttonStyle={styles.btnAddReview}
                  titleStyle={styles.btnTitleAddReview}
                  icon={{
                    type: "material-community",
                    name: "square-edit-outline",
                    color: "#00a680",
                  }}
                  onPress={() =>
                    navigation.navigate("add-meal", {
                      idKitchen: kitchen.uid,
                      token: kitchen.token,
                    })
                  }
                />
              </>
            }
            data={meals}
            keyExtractor={(item) => item.name}
            renderItem={(itemData) => (
              <Meal meal={itemData.item} loadMeals={loadMeals} />
            )}
          />
        </>
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
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </>
  );
};

export default Panel;

const availableHandler = (id, available, loadMeals) => {
  let mealState = "";
  available ? (mealState = "Disponible") : (mealState = "No disponible");
  Alert.alert(
    `Platillo ${mealState}`,
    "¿Estas seguro de que quieres cambiar la disponibilidad del platillo?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cambiar",
        onPress: () => {
          db.collection("meals")
            .doc(id)
            .update({ available: !available })
            .then(() => {
              loadMeals();
            });
        },
      },
    ],
    { cancelable: false }
  );
};

function Meal(props) {
  const { loadMeals } = props;
  const { name, description, price, images, id, available } = props.meal;
  return (
    <Card style={styles.mealItem}>
      <TouchableOpacity
        onPress={() => availableHandler(id, available, loadMeals)}
      >
        <View style={styles.viewReview}>
          <View style={styles.viewImageAvatar}>
            <Avatar
              size="large"
              rounded
              style={styles.imageAvatarUser}
              source={{ uri: images[0] }}
            />
          </View>
          <View style={styles.viewInfo}>
            {available ? (
              <>
                <View style={styles.reviewTitle}>
                  <Text>{name}</Text>
                  <Text>${price}.00</Text>
                </View>
                <Text style={styles.reviewText}>{description}</Text>
              </>
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={{ fontSize: 18 }}>No disponible</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flexGrow: 1,
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

  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#00a680",
  },
  viewReview: {
    flexDirection: "row",
    // margin: 10,
    // paddingBottom: 10,
    // borderBottomColor: "#e3e3e3",
    // borderBottomWidth: 1,
  },
  viewImageAvatar: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
  },
  reviewTitle: {
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  mealItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
  },
});
