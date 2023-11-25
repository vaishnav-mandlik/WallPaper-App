import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Category from "./Category";
import SearchWallpaper from "./SearchWallpaper";
import { getWallpaperByTitle } from "../../sanity";

const Home = () => {
  const [isSearchActive, setSearchActive] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchedWallpaper, setSearchedWallpaper] = useState(null);

  const handleSearchToggle = () => {
    setSearchQuery(null);
    Animated.timing(titleOpacity, {
      toValue: isSearchActive ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    if (!isSearchActive) {
      Animated.timing(animatedWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    } else {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      Animated.timing(animatedWidth, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    setSearchActive(!isSearchActive);
  };

  const inputWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "75%"],
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(null);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const fetchWallpapers = async () => {
        try {
          const wallpapers = await getWallpaperByTitle(searchQuery);
          setSearchedWallpaper(wallpapers);
        } catch (error) {
          console.log(error);
        }
      };
      fetchWallpapers();
    }
  }, [debouncedSearchQuery]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          WallPics
        </Animated.Text>
        <Animated.View style={[styles.searchBar, { width: inputWidth }]}>
          {isSearchActive && (
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search wallpapers"
              placeholderTextColor="#666"
              autoFocus={true}
              onChange={(e) => {
                setSearchQuery(e.nativeEvent.text);
              }}
              value={searchQuery}
            />
          )}
        </Animated.View>
        <TouchableOpacity
          onPress={handleSearchToggle}
          style={styles.searchIcon}
        >
          <AntDesign
            name={isSearchActive ? "close" : "search1"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {!debouncedSearchQuery ? (
        <Category />
      ) : (
        <SearchWallpaper data={searchedWallpaper} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25262A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  searchBar: {
    position: "absolute",
    left: 0,
    right: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  searchInput: {
    fontSize: 18,
    color: "white",
    paddingHorizontal: 10,
    width: "100%",
  },
  searchIcon: {
    padding: 5,
  },
});

export default Home;
