import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import InputForm from "./InputForm";
import Users from "./Users";

const Home = () => {
  return (
    <ScrollView>
      <InputForm />
      <Users />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
