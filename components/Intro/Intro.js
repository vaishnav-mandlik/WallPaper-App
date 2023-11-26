import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Intro = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/BgImage.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.topSection}></View>
        <LinearGradient
          colors={[
            "transparent",
            "rgba(0,0,0,0.7)",
            "rgba(0,0,0,0.9)",
            "rgba(0,0,0,1)",
          ]}
          style={styles.bottomSection}
          locations={[0, 0.4, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View className="mb-[-40%]">
            <Text className="text-center text-white text-4xl font-normal">
              WallPics
            </Text>
            <Text className="text-center text-gray-300 text-xl font-light mt-2">
              Set Wallpaper or Download it.
            </Text>
            <View className="flex flex-row justify-center items-center mx-10 ">
              <TouchableOpacity
                className="px-4 py-3 rounded-3xl mt-8 bg-blue-900 w-full"
                onPress={async () => {
                  await AsyncStorage.setItem("isOnboarded", "true");
                  navigation.navigate("Home");
                }}
              >
                <Text className="text-center text-lg text-white font-normal">
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  topSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Intro;
