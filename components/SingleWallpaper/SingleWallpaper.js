import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";

const SingleWallpaper = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { image } = route.params;

  const shareImage = async () => {
    try {
      await Sharing.shareAsync(image);
    } catch (error) {
      // Handle error
      console.log(error, "eerr in shere image");
    }
  };
  return (
    <View className="flex-1 bg-[#25262A]">
      <TouchableOpacity
        className="flex-row items-center p-3"
        onPress={() => navigation.goBack()}
      >
        <Entypo name="chevron-left" size={35} color="#F1B022" />
        <Text className="text-[#F1B022] text-xl font-semibold">Explore</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} className="w-full h-full rounded-3xl" />
      </View>
      <View className="flex-row justify-around items-center border border-[#707070] rounded-2xl mb-10 mx-[8%] bg-[#1c2023]">
        <AntDesign name="clouddownloado" size={45} color="#707070" />
        <MaterialIcons name="now-wallpaper" size={38} color="#707070" />
        <AntDesign name="sharealt" size={38} color="#707070" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 50,
      },
    }),
  },
});

export default SingleWallpaper;
