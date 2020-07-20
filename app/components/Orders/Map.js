import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import Modal from "../Modal";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const Map = (props) => {
  const { isVisibleMap, setIsVisibleMap, location, myLocation } = props;

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && myLocation && (
          <MapView
            style={styles.mapStyle}
            provider={PROVIDER_GOOGLE}
            initialRegion={myLocation}
            showsUserLocation={true}
          >
            <MapView.Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
            />
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              pinColor="#00a680"
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Salir"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Map;

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 60,
    width: 60,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 60,
    height: 60,
    marginRight: 5,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 500,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
  },
});
