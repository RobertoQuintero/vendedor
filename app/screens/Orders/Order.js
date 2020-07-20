import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { Image, Button } from "react-native-elements";
import Map from "../../components/Orders/Map";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import {
  acceptOrder,
  deniedOrder,
  sendOrder,
  deliveredOrder,
} from "../../utils/ordersRequest";
import Loading from "../../components/Loading";

import { firebaseapp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
const db = firebase.firestore(firebaseapp);

const Order = ({ navigation, route }) => {
  const { id } = route.params;
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [check, setCheck] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const deliveredTime = new Date(order?.deliveredHour?.seconds * 1000);
  const [expoToken, setExpoToken] = useState(null);

  useEffect(() => {
    let isActive = true;

    if (isActive) {
      (async () => {
        const resultPermissions = await Permissions.askAsync(
          Permissions.LOCATION
        );
        const statusPermissions = resultPermissions.permissions.location.status;
        if (statusPermissions !== "granted") {
          toastRef.current.show(
            "Tienes que aceptar los permisos de loacalización para crear el negocio",
            3000
          );
        } else {
          const loc = await Location.getCurrentPositionAsync({});

          setMyLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
        }
      })();
    }
    return () => {
      isActive = false;
    };
  }, [setMyLocation]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) {
        db.collection("orders")
          .doc(id)
          .get()
          .then((response) => {
            setOrder(response.data());
          })
          .catch((error) => {
            console.log(error);
          });
      }
      return () => {
        setOrder(null);
        isActive = false;
      };
    }, [check])
  );

  if (!order)
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text style={{ textAlign: "center" }}>Cargando orden</Text>
      </View>
    );

  const {
    delivered,
    cancelled,
    received,
    sended,
    token,
    image,
    name,
    quantity,
    location,
  } = order;
  return (
    <View style={styles.viewBody}>
      <View style={styles.imageOrder}>
        <Image
          resizeMode="cover"
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={{ uri: image }}
          style={styles.imageSource}
        />
      </View>
      <Text style={styles.text}>
        {name} - {quantity}
      </Text>
      {!delivered ? (
        <View style={styles.buttons}>
          {!received ? (
            !cancelled ? (
              <View style={styles.accept}>
                <Button
                  title="Aceptar"
                  containerStyle={styles.acceptContainerBtn}
                  onPress={() =>
                    confirmRequest(
                      "accept",
                      "Aceptar",
                      id,
                      token,
                      setLoadingOrder,
                      setCheck
                    )
                  }
                />
                <Button
                  title="Rechazar"
                  containerStyle={styles.acceptContainerBtn}
                  buttonStyle={styles.acceptBtnRight}
                  onPress={() =>
                    confirmRequest(
                      "cancell",
                      "Rechazar",
                      id,
                      token,
                      setLoadingOrder,
                      setCheck
                    )
                  }
                />
              </View>
            ) : (
              <View style={styles.accept}>
                <Button
                  title="No disponible"
                  containerStyle={styles.deliveredBtn}
                  buttonStyle={styles.acceptBtnRight}
                />
              </View>
            )
          ) : (
            <>
              {!sended ? (
                <View style={styles.accept}>
                  <Button
                    title="Enviar"
                    containerStyle={styles.acceptContainerBtn}
                    onPress={() =>
                      confirmRequest(
                        "send",
                        "Enviar",
                        id,
                        token,
                        setLoadingOrder,
                        setCheck
                      )
                    }
                  />
                  <Button
                    title="Ubicación"
                    containerStyle={styles.acceptContainerBtn}
                    onPress={() => {
                      setIsVisibleMap(true);
                    }}
                  />
                </View>
              ) : (
                <View style={styles.accept}>
                  <Button
                    title="Ubicación"
                    containerStyle={styles.acceptContainerBtn}
                  />
                  <Button
                    title="Entregado"
                    containerStyle={styles.acceptContainerBtn}
                    onPress={() =>
                      confirmRequest(
                        "delivered",
                        "Entregar",
                        id,
                        token,
                        setLoadingOrder,
                        setCheck
                      )
                    }
                  />
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <View style={styles.deliveredState}>
          <Text>Entregado</Text>
          <Text>
            {deliveredTime.getDate()}/{deliveredTime.getMonth() + 1}/
            {deliveredTime.getFullYear()} - {deliveredTime.getHours()}:
            {deliveredTime.getMinutes() < 10 ? "0" : ""}
            {deliveredTime.getMinutes()}
          </Text>
        </View>
      )}
      {order && (
        <Map
          isVisibleMap={isVisibleMap}
          setIsVisibleMap={setIsVisibleMap}
          location={location}
          myLocation={myLocation}
        />
      )}
      <Loading isVisible={loadingOrder} text="Espere un momento" />
    </View>
  );
};

export default Order;

const confirmRequest = (
  request,
  text,
  id,
  token,
  setLoadingOrder,
  setCheck
) => {
  Alert.alert(
    "Confirmar Instrucción",
    `¿Estas seguro de ${text} el pedido?`,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Enviar",
        onPress: () => {
          switch (request) {
            case "accept":
              acceptOrder(id, token, setLoadingOrder, setCheck);
              break;
            case "cancell":
              deniedOrder(id, token, setLoadingOrder, setCheck);
              break;
            case "send":
              sendOrder(id, token, setLoadingOrder, setCheck);
              break;
            case "delivered":
              deliveredOrder(id, token, setLoadingOrder, setCheck);
              break;
          }
        },
      },
    ],
    { cancelable: false }
  );
};

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageSource: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    width: "63%",
    justifyContent: "center",
  },
  accept: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  acceptContainerBtn: {
    width: "48%",
  },
  acceptBtnRight: {
    backgroundColor: "red",
  },
  deliveredBtn: {
    width: "98%",
  },
  deliveredContainer: {
    height: "100%",
    justifyContent: "space-around",
  },
  deliveredState: {
    width: "63%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageOrder: {
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  loaderOrders: {
    justifyContent: "center",
    alignContent: "center",
  },
});
