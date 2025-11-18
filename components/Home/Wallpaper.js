import {
  Image as RNImage,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { urlFor } from "../../sanity";

const Wallpaper = ({ item }) => {
  const windowWidth = Dimensions.get("window").width;
  const imageWidth = useMemo(() => windowWidth / 3 - 20, [windowWidth]);
  const navigation = useNavigation();
  const fullUri = item?.image?.asset?.url;
  const thumbUri = item?.image
    ? urlFor(item.image)
        .width(Math.round(imageWidth * 2))
        .auto("format")
        .url()
    : fullUri;

  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const uriToPrefetch = thumbUri || fullUri;
    if (uriToPrefetch) {
      // prefetch thumbnail when tile mounts (no-op if already cached)
      RNImage.prefetch(uriToPrefetch).catch(() => {});
    }
  }, [thumbUri, fullUri]);

  const previewWallpaper = useCallback(
    (image) => {
      navigation.navigate("SingleWallpaper", {
        image,
      });
    },
    [navigation]
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => previewWallpaper(fullUri)}
        style={{
          borderRadius: 10,
          overflow: "hidden",
          marginHorizontal: 8,
          marginVertical: 6,
          height: 170,
          width: imageWidth,
          backgroundColor: "#30302F",
          borderRadius: 10,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
            },
            android: {
              elevation: 10,
            },
          }),
        }}
      >
        <Animated.Image
          source={{ uri: thumbUri }}
          style={{
            width: imageWidth,
            height: 170,
            opacity: imageOpacity,
            backgroundColor: "#30302F",
          }}
          onLoad={() => {
            Animated.timing(imageOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }).start();
          }}
          defaultSource={require("../../assets/icon.png")}
          onError={() => {
            if (__DEV__)
              console.warn("Image failed to load:", thumbUri || fullUri);
            // show placeholder (defaultSource) by leaving opacity 0
          }}
          progressiveRenderingEnabled={true}
        />
      </TouchableOpacity>
    </>
  );
};

export default React.memo(Wallpaper);
