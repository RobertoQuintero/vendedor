import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Image, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Card from "../Card";

const OrdersList = ({
  orders,
  setLoadingOrder,
  setCheck,
  handleLoadMore,
  isLoading,
  loadOrders,
  isRefreshing,
}) => {
  // console.log(orders);
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      {orders[0] ? (
        <FlatList
          onRefresh={loadOrders}
          refreshing={isRefreshing}
          data={orders}
          renderItem={(order) => (
            <Order
              order={order}
              setLoadingOrder={setLoadingOrder}
              setCheck={setCheck}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View
          style={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No tienes ordenes</Text>
        </View>
      )}
    </View>
  );
};

export default OrdersList;

function Order({ order, navigation }) {
  const {
    name,
    total,
    createAt,
    quantity,
    image,
    id,
    received,
    cancelled,
    sended,
    delivered,
    deliveredHour,
  } = order.item;
  const createOrder = new Date(createAt.seconds * 1000);
  const deliveredTime = new Date(deliveredHour?.seconds * 1000);
  return (
    <Card style={styles.orderItem}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("order", { id: id });
        }}
      >
        <View style={styles.viewInfo}>
          <View style={styles.viewKitchen}>
            <View style={styles.imageKitchen}>
              <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="#fff" />}
                source={
                  image
                    ? { uri: image }
                    : require("../../../assets/img/no-image.png")
                }
                style={styles.imageSource}
              />
            </View>
            {!delivered ? (
              <View style={styles.buttons}>
                {!received ? (
                  !cancelled ? (
                    <View style={styles.accept}>
                      <Button
                        title="Aceptar"
                        containerStyle={styles.acceptContainerBtn}
                      />
                      <Button
                        title="Rechazar"
                        containerStyle={styles.acceptContainerBtn}
                        buttonStyle={styles.acceptBtnRight}
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
                        />
                        <Button
                          title="Ubicación"
                          containerStyle={styles.acceptContainerBtn}
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
          </View>
          <Text style={styles.reviewTitle}>
            {name} - {quantity}
          </Text>
          <Text style={styles.reviewText}>${total}.00</Text>
          {
            <Text style={styles.reviewDate}>
              {createOrder.getDate()}/{createOrder.getMonth() + 1}/
              {createOrder.getFullYear()} - {createOrder.getHours()}:
              {createOrder.getMinutes() < 10 ? "0" : ""}
              {createOrder.getMinutes()}
            </Text>
          }
        </View>
      </TouchableOpacity>
    </Card>
  );
}
function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderOrders}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundOrders}>
        <Text>No quedan ordenes por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewInfo: {
    // borderWidth: 1,
    // borderColor: "#eee",
    // padding: 5,
    // marginBottom: 5,
  },
  reviewTitle: {
    fontWeight: "bold",
    // marginTop: 5,
  },
  reviewText: {
    // paddingTop: 2,
    color: "grey",
    // marginBottom: 5,
  },
  reviewDate: {
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 5,
    bottom: 5,
  },
  viewKitchen: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
  },
  imageKitchen: {
    width: "32%",
    height: 90,
  },
  imageSource: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    width: "67%",
    justifyContent: "center",
  },
  accept: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginBottom: "2%",
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
  notFoundOrders: {
    alignItems: "center",
  },
  orderItem: {
    margin: 5,
    padding: 10,
  },
});
