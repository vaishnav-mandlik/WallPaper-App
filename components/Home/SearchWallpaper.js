import { View, Text, FlatList } from "react-native";
import React from "react";
import Wallpaper from "./Wallpaper";

const SearchWallpaper = (data) => {
  return (
    <View style={{ flex: 1 }}>
      {data.data && data.data.length > 0 && (
        <FlatList
          data={data.data}
          numColumns={3}
          renderItem={({ item }) => <Wallpaper item={item} />}
        />
      )}
      {data.data && data.data.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-center">Wallpaper not found</Text>
        </View>
      )}
    </View>
  );
};

export default SearchWallpaper;
