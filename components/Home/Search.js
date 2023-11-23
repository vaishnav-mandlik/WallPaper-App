import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";

const Search = () => {
  const [isFocused, setIsFocused] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setIsFocused(true);
    // Animate the input width
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    if (!searchQuery) {
      // Assuming you have a state for managing search query
      setIsFocused(false);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const inputWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["20%", "100%"], // Change width values as needed
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...styles.header,
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0], // Change opacity values as needed
          }),
        }}
      >
        <Text style={styles.title}>Natural Wallpaper</Text>
      </Animated.View>
      <Animated.View style={[styles.searchContainer, { width: inputWidth }]}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity onPress={onFocus}>
          <Text>Search</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 100,
    borderWidth: 1,
    borderColor: "grey",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
  },
});

export default Search;
