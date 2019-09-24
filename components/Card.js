import React from "react";
import { View, StyleSheet } from "react-native";

const Card = props => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: "white"
  }
});

export default Card;
