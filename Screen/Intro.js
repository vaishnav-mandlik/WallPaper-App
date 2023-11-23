import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Intro = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/BgImage.jpg")}
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
          <TouchableOpacity className="bg-white p-3 rounded-lg">
            <Text className="text-center text-white font-bold">
              jsf sdfwith Google
            </Text>
          </TouchableOpacity>
          {/* Repeat for other login methods */}
          <Text className="text-white text-center mt-3">Skip</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  topSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  bottomSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderColor: "#000",
  },
  buttonText: {
    color: "#000",
  },
  skipText: {
    color: "#fff",
    alignSelf: "flex-end",
    margin: 16,
  },
});

export default Intro;
