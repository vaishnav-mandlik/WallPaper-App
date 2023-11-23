import { Dimensions, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Wallpaper = ({ item }) => {
  const windowWidth = Dimensions.get("window").width;
  const imageWidth = windowWidth / 3 - 20;
  const navigation = useNavigation();

  const previewWallpaper = () => {
    navigation.navigate("SingleWallpaper", {
      image: item.image.asset.url,
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={previewWallpaper}
        style={{
          borderRadius: 10,
          overflow: "hidden",
          marginHorizontal: 8,
          marginVertical: 6,
          height: 170,
          width: imageWidth,
          backgroundColor: "#30302F",
          borderRadius: 10,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
            },
            android: {
              elevation: 10,
            },
          }),
        }}
      >
        <Image
          source={{ uri: item.image.asset.url }}
          style={{
            width: imageWidth,
            height: 170,
          }}
        />
      </TouchableOpacity>
    </>
  );
};

export default Wallpaper;
