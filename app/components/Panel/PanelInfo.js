import React from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import Carousel from "../../components/Carousel";
const screenWidth = Dimensions.get("window").width;

const PanelInfo = ({ kitchen, openHandler }) => {
  console.log(kitchen.open);
  return (
    <View vertical style={styles.viewBody}>
      <Carousel arrayImages={kitchen.images} height={250} width={screenWidth} />
      <TitleRestaurant
        name={kitchen.name}
        description={kitchen.description}
        open={kitchen.open}
        openHandler={openHandler}
      />
    </View>
  );
};

export default PanelInfo;

function TitleRestaurant(props) {
  const { name, description, open, openHandler } = props;

  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        {open ? (
          <Button title="Abierto" color="green" onPress={() => openHandler()} />
        ) : (
          <Button title="Cerrado" color="red" onPress={() => openHandler()} />
        )}
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    backgroundColor: "#fff",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey",
  },
  button: {
    backgroundColor: "red",
  },
});
