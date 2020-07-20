import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
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

const Panel = ({ navigation }) => {
  const toastRef = useRef();

  const [kitchen, setKitchen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isAuth = true;
      if (isAuth) {
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
                <PanelInfo kitchen={kitchen} />
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
            renderItem={(itemData) => <Meal meal={itemData.item} />}
          />
          <Toast ref={toastRef} position="center" opacity={0.9} />
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
    </>
  );
};

export default Panel;

function Meal(props) {
  const { name, description, price, images } = props.meal;
  return (
    <TouchableOpacity>
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
          <View style={styles.reviewTitle}>
            <Text>{name}</Text>
            <Text>${price}.00</Text>
          </View>
          <Text style={styles.reviewText}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    margin: 10,
    paddingBottom: 10,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
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
});
