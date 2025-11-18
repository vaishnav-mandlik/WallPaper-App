import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Intro from './components/Intro/Intro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Home from './components/Home/Home';
import SingleWallpaper from './components/SingleWallpaper/SingleWallpaper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedSplash from 'react-native-animated-splash-screen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    isUserOnboarded();
  }, []);

  const isUserOnboarded = async () => {
    try {
      const value = await AsyncStorage.getItem('isOnboarded');
      // stored value might be string 'true' or 'false'
      if (value === 'true' || value === '1') {
        setIsOnboarded(true);
      } else if (value === 'false' || value === '0' || value === null) {
        setIsOnboarded(false);
      } else {
        // fallback: treat any other truthy string as true
        setIsOnboarded(Boolean(value));
      }
    } catch (err) {
      // If reading storage fails, default to showing intro so users aren't blocked
      console.error('Error reading onboarding flag', err);
      setIsOnboarded(false);
    } finally {
      // Mark splash as loaded once onboarding check completes
      setTimeout(() => setIsLoaded(true), 500);
    }
  };

  if (isOnboarded === null) {
    return (
      <AnimatedSplash
        translucent={true}
        isLoaded={false}
        logoImage={require('./assets/icon.png')}
        backgroundColor={'#000000'}
        logoHeight={150}
        logoWidth={150}
      >
        <GestureHandlerRootView style={{ flex: 1 }} />
      </AnimatedSplash>
    );
  }

  if (!isOnboarded) {
    return (
      <AnimatedSplash
        translucent={true}
        isLoaded={isLoaded}
        logoImage={require('./assets/icon.png')}
        backgroundColor={'#000000'}
        logoHeight={150}
        logoWidth={150}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
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
              <Stack.Screen
                name="SingleWallpaper"
                component={SingleWallpaper}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </AnimatedSplash>
    );
  }

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={isLoaded}
      logoImage={require('./assets/icon.png')}
      backgroundColor={'#000000'}
      logoHeight={150}
      logoWidth={150}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </AnimatedSplash>
  );
};

export default App;
