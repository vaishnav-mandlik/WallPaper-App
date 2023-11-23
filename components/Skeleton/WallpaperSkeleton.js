import { View, Dimensions } from "react-native";
import React from "react";

const WallpaperSkeleton = () => {
  const windowWidth = Dimensions.get("window").width;
  const imageWidth = windowWidth / 3 - 20;

  return (
    <View
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
    ></View>
  );
};

export default WallpaperSkeleton;
