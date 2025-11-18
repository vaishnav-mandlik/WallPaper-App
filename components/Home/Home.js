import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  Animated,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Category from './Category';
import SearchWallpaper from './SearchWallpaper';
import { getWallpaperByTitle } from '../../sanity';

const Home = () => {
  const [isSearchActive, setSearchActive] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchedWallpaper, setSearchedWallpaper] = useState(null);
  const debounceTimerRef = useRef(null);

  const handleSearchToggle = useCallback(() => {
    setSearchQuery(null);
    setSearchedWallpaper(null);

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
  }, [isSearchActive, titleOpacity, animatedWidth]);

  const inputWidth = useMemo(
    () =>
      animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '75%'],
      }),
    [animatedWidth],
  );

  const handleSearchChange = useCallback(text => {
    setSearchQuery(text);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer (500ms)
    debounceTimerRef.current = setTimeout(async () => {
      if (text && text.trim().length > 0) {
        try {
          const wallpapers = await getWallpaperByTitle(text);
          setSearchedWallpaper(wallpapers);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSearchedWallpaper(null);
      }
    }, 500);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#25262A" />
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
              onChangeText={handleSearchChange}
              value={searchQuery || ''}
            />
          )}
        </Animated.View>
        <TouchableOpacity
          onPress={handleSearchToggle}
          style={styles.searchIcon}
        >
          <MaterialIcons
            name={isSearchActive ? 'close' : 'search'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {!searchedWallpaper ? (
        <Category />
      ) : (
        <SearchWallpaper data={searchedWallpaper} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25262A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  searchBar: {
    position: 'absolute',
    left: 0,
    right: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    fontSize: 18,
    color: 'white',
    paddingHorizontal: 10,
    width: '100%',
  },
  searchIcon: {
    padding: 5,
  },
});

export default React.memo(Home);
