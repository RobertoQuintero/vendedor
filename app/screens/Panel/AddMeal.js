import React, { useState, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddMealForm from "../../components/Panel/AddMealForm";

export default function AddMeal(props) {
  console.log("add", props);
  const { navigation, route } = props;
  const { idKitchen, token } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();
  return (
    <View>
      <AddMealForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
        idKitchen={idKitchen}
        token={token}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Creando platillo" />
    </View>
  );
}
