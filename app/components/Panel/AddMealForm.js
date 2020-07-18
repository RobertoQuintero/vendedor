import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { map, size, filter } from "lodash";
import { firebaseapp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import uuid from "random-uuid-v4";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

const widthScreen = Dimensions.get("window").width;

const AddMealForm = ({
  toastRef,
  navigation,
  setIsLoading,
  idKitchen,
  token,
}) => {
  const [mealName, setMealName] = useState("");
  const [mealPrice, setMealPrice] = useState(0);
  const [mealDescription, setMealDescription] = useState("");
  const [imageSelected, setImageSelected] = useState([]);

  const AddMeal = () => {
    if (!mealName || !mealPrice || !mealDescription) {
      toastRef.current.show("Todos loa campos son obligatorios");
    } else if (size(imageSelected) === 0) {
      toastRef.current.show("El platillo debe tener almenos una foto");
    } else {
      setIsLoading(true);
      uploadImageStorage().then((response) => {
        db.collection("meals")
          .add({
            name: mealName,
            price: parseInt(mealPrice),
            description: mealDescription,
            images: response,
            createAt: new Date(),
            idKitchen: idKitchen,
            token: token,
          })
          .then(() => {
            // console.log("0k");
            setIsLoading(false);
            navigation.navigate("panel");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error al subir el platillo,intentelo mas tarde"
            );
          });
      });
    }
  };
  //after map
  const uploadImageStorage = async () => {
    // console.log(imageSelected);
    const imageBlob = [];

    await Promise.all(
      map(imageSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("meals").child(uuid());
        await ref.put(blob).then(async (result) => {
          //subiendo a storage
          await firebase
            .storage()
            .ref(`meals/${result.metadata.name}`)
            .getDownloadURL() //obteniendo url de la imagen subida
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
      })
    );

    return imageBlob;
  };
  return (
    <ScrollView style={styles.scrollView}>
      <ImageMeal imageMeal={imageSelected[0]} />
      <FormAdd
        setMealName={setMealName}
        setMealPrice={setMealPrice}
        setMealDescription={setMealDescription}
      />
      <UploadImage
        toastRef={toastRef}
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
      />
      <Button
        title="Crear platillo"
        onPress={AddMeal}
        buttonStyle={styles.btnAddRestaurant}
      />
    </ScrollView>
  );
};
//1
function FormAdd({ setMealName, setMealPrice, setMealDescription }) {
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del platillo"
        containerStyle={styles.input}
        onChange={(e) => setMealName(e.nativeEvent.text)}
      />
      <Input
        placeholder="precio del platillo"
        containerStyle={styles.input}
        onChange={(e) => setMealPrice(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción del platillo"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setMealDescription(e.nativeEvent.text)}
      />
    </View>
  );
}
//2
function UploadImage({ toastRef, setImageSelected, imageSelected }) {
  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos a la galería, si los han rechazado debes ir a ajustes y activarlos manualmante",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galería sin seleccionar ninguna imagen",
          2000
        );
      } else {
        setImageSelected([...imageSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imagen",
      "¿Estas seguro de que quieres eliminar la imagen?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setImageSelected(
              filter(imageSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImages}>
      {size(imageSelected) < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imageSelected, (imageMeal, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageMeal }}
          onPress={() => removeImage(imageMeal)}
        />
      ))}
    </View>
  );
}

//3
function ImageMeal(props) {
  const { imageMeal } = props;
  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imageMeal
            ? { uri: imageMeal }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}

//4

export default AddMealForm;

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
