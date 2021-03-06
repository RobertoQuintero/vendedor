import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Button, Avatar } from "react-native-elements";
//
import { firebaseapp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);
//
import { map } from "lodash";

const ListMeals = (props) => {
  const { navigation, idKitchen, check, token } = props;
  const [meals, setMeals] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      });
    setIsRefreshing(false);
  }, [setMeals]);

  useEffect(() => {
    let isActive = true;
    if (isActive) {
      loadMeals();
    }
    return () => {
      isActive = false;
    };
  }, [check]);

  return (
    <View>
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
            idKitchen: idKitchen,
            token: token,
          })
        }
      />
      <View>
        <FlatList
          onRefresh={loadMeals}
          refreshing={isRefreshing}
          data={meals}
          keyExtractor={(item) => item.name}
          renderItem={(itemData) => <Meal meal={itemData.item} />}
        />
      </View>
    </View>
  );
};

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

export default ListMeals;

const styles = StyleSheet.create({
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
