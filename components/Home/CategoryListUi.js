import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CategoryListUi = ({ item, isActive, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.name)}
      style={{
        backgroundColor: "#1F2125",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: isActive ? "#C68822" : "#4D4E51",
        borderWidth: 1,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: isActive ? "#C68822" : "#4D4E51",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};
export default CategoryListUi;
