import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import Carousel from "../../components/Carousel";
const screenWidth = Dimensions.get("window").width;

const PanelInfo = ({ kitchen }) => {
  return (
    <ScrollView vertical style={styles.viewBody}>
      <Carousel arrayImages={kitchen.images} height={250} width={screenWidth} />
      <TitleRestaurant name={kitchen.name} description={kitchen.description} />
    </ScrollView>
  );
};

export default PanelInfo;

function TitleRestaurant(props) {
  const { name, description } = props;

  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
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
});
