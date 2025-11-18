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
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Google</Text>
          </TouchableOpacity>

          <Text style={styles.skipText}>Skip</Text>
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
    padding: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  skipText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
});

export default Intro;
