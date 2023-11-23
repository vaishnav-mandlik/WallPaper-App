import { StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Intro from "./components/Intro/Intro";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Home from "./components/Home/Home";
import SingleWallpaper from "./components/SingleWallpaper/SingleWallpaper";

const App = () => {
  const Stack = createNativeStackNavigator();
  const [isOnboarded, setIsOnboarded] = useState(null);

  useEffect(() => {
    isUserOnboarded();
  }, []);

  const isUserOnboarded = async () => {
    const isOnboarded = await AsyncStorage.getItem("isOnboarded");
    if (isOnboarded) {
      setIsOnboarded(true);
    } else {
      setIsOnboarded(false);
    }
  };

  if (isOnboarded === null) {
    return null;
  }

  if (!isOnboarded) {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor="#25262A"
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Intro"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Intro" component={Intro} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#25262A"
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="SingleWallpaper" component={SingleWallpaper} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
