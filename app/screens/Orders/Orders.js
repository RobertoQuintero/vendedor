import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import Loading from "../../components/Loading";
//
import { firebaseapp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import OrdersList from "../../components/Orders/OrdersList";

const db = firebase.firestore(firebaseapp);

const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [startOrders, setStartOrders] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [check, setCheck] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const limitOrders = 5;

  const loadOrdersHandler = () => {
    setIsRefreshing(true);
    const idUser = firebase.auth().currentUser.uid;
    db.collection("orders")
      .where("idRestaurant", "==", idUser)
      .orderBy("createAt", "desc")
      .limit(limitOrders)
      .get()
      .then((response) => {
        setTotalOrders(response.size);
        setStartOrders(response.docs[response.docs.length - 1]);
        const resultOrders = [];
        response.forEach((doc) => {
          const order = doc.data();
          order.id = doc.id;
          resultOrders.push(order);
        });
        setOrders(resultOrders);
        setLoadingOrders(false);
      });
    setIsRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) {
        loadOrdersHandler();
      }
      setCheck(false);
      return () => {
        isActive = false;
      };
    }, [setOrders, setLoadingOrders, setTotalOrders, setStartOrders, check])
  );

  const handleLoadMore = () => {
    const resultOrders = [];
    orders.length < totalOrders && setIsLoading(true);
    const idUser = firebase.auth().currentUser.uid;
    db.collection("orders")
      .where("idUser", "==", idUser)
      .orderBy("createAt", "desc")
      .startAfter(startOrders.data().createAt)
      .limit(limitOrders)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartOrders(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }
        response.forEach((doc) => {
          const order = doc.data();
          order.id = doc.id;
          resultOrders.push(order);
        });
        setOrders([...orders, ...resultOrders]);
      });
  };

  return (
    <View style={styles.viewBody}>
      {loadingOrders ? (
        <View style={styles.loaderOrders}>
          <ActivityIndicator size="large" />
          <Text>Cargando ordenes</Text>
        </View>
      ) : (
        <OrdersList
          orders={orders}
          setLoadingOrder={setLoadingOrder}
          setCheck={setCheck}
          isLoading={isLoading}
          handleLoadMore={handleLoadMore}
          loadOrders={loadOrdersHandler}
          isRefreshing={isRefreshing}
        />
      )}
      <Loading isVisible={loadingOrder} text="Espere un momento" />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
    width: Dimensions.get("window").width,
  },
  loaderOrders: {
    justifyContent: "center",
    alignItems: "center",
  },
});
