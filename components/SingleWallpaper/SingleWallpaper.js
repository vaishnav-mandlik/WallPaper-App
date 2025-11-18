import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  Share,
  Modal,
  StatusBar,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WallpaperManager, { TYPE } from 'react-native-wallpaper-manage';
import BottomSheetContent from './BottomSheetContent';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const requestMediaPermission = async () => {
  if (Platform.OS !== 'android') return true;
  // Android 13+ uses READ_MEDIA_IMAGES, older uses WRITE_EXTERNAL_STORAGE
  const permissions = [
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  ];
  let granted = true;
  for (const perm of permissions) {
    const result = await PermissionsAndroid.request(perm, {
      title: 'Storage Permission',
      message: 'App needs access to your storage to save images',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    if (
      result !== PermissionsAndroid.RESULTS.GRANTED &&
      result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      granted = false;
    }
  }
  return granted;
};

// Get screen dimensions for optimization
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SingleWallpaper = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { image } = route.params;
  const [settingWallpaper, setSettingWallpaper] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasStoragePermission, setHasStoragePermission] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Memoize optimized image URI to prevent re-rendering
  const buildCenteredUrl = useCallback(baseUrl => {
    const sep = baseUrl.includes('?') ? '&' : '?';
    // Sanity supports w, h, fit, crop, auto, q params for transformation
    return `${baseUrl}${sep}w=${Math.round(SCREEN_WIDTH)}&h=${Math.round(
      SCREEN_HEIGHT,
    )}&fit=crop&crop=center&auto=format&q=85`;
  }, []);

  const optimizedImageUri = useMemo(
    () => buildCenteredUrl(image),
    [image, buildCenteredUrl],
  );

  useEffect(() => {
    // Prefetch image immediately when component mounts using FastImage
    FastImage.preload([
      {
        uri: optimizedImageUri,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      },
    ]);

    (async () => {
      const granted = await requestMediaPermission();
      setHasStoragePermission(granted);
    })();
  }, [optimizedImageUri]);

  const openBottomSheet = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setModalVisible(false);
  }, []);

  const downloadImage = useCallback(async () => {
    try {
      let granted = hasStoragePermission;
      if (Platform.OS === 'android' && !granted) {
        granted = await requestMediaPermission();
        setHasStoragePermission(granted);
      }
      if (!granted) {
        ToastAndroid.showWithGravity(
          'Please grant permission to download image',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }
      const uri = image;
      const filename = uri.split('/').pop() || `wallpaper_${Date.now()}.jpg`;
      const downloadPath = `${RNFS.CachesDirectoryPath}/${filename}`;
      ToastAndroid.showWithGravity(
        'Downloading...',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      await RNFS.downloadFile({
        fromUrl: uri,
        toFile: downloadPath,
      }).promise;
      // Save to gallery in WallPics folder
      await CameraRoll.save(downloadPath, {
        type: 'photo',
        album: 'WallPics',
      });
      ToastAndroid.showWithGravity(
        'Wallpaper downloaded successfully!',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } catch (error) {
      console.error('Download error:', error);
      ToastAndroid.showWithGravity(
        `Download failed: ${error.message || 'Unknown error'}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  }, [image, hasStoragePermission]);

  const shareWallpaper = useCallback(async () => {
    try {
      Share.share({
        message: image,
      });
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Something went wrong, please try again',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  }, [image]);

  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
    setImageError(false);
  }, []);

  const handleImageLoadEnd = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
    ToastAndroid.showWithGravity(
      'Failed to load wallpaper',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  }, []);

  const setWallpic = useCallback(
    async screen => {
      setSettingWallpaper(true);
      closeBottomSheet();

      ToastAndroid.showWithGravity(
        'Setting wallpaper, please wait...',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );

      try {
        // Download image first to local storage for faster wallpaper setting
        const finalRemoteUri = buildCenteredUrl(image);
        const filename = `wallpaper_${Date.now()}.jpg`;
        const localPath = `${RNFS.CachesDirectoryPath}/${filename}`;

        await RNFS.downloadFile({
          fromUrl: finalRemoteUri,
          toFile: localPath,
        }).promise;

        // Use file:// protocol for the wallpaper manager
        const fileUri = `file://${localPath}`;

        if (screen === 'both') {
          // Set both home and lock screen
          await WallpaperManager.setWallpaper(fileUri, TYPE.FLAG_SYSTEM);
          await WallpaperManager.setWallpaper(fileUri, TYPE.FLAG_LOCK);
        } else if (screen === 'home') {
          await WallpaperManager.setWallpaper(fileUri, TYPE.FLAG_SYSTEM);
        } else if (screen === 'lock') {
          await WallpaperManager.setWallpaper(fileUri, TYPE.FLAG_LOCK);
        }

        console.log('Wallpaper set for:', screen, 'from', finalRemoteUri);

        // Clean up the cached file
        await RNFS.unlink(localPath).catch(() => {});

        ToastAndroid.showWithGravity(
          'Wallpaper set successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } catch (error) {
        ToastAndroid.showWithGravity(
          error.message || 'Failed to set wallpaper',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        console.log('Wallpaper error:', error);
      }
      setSettingWallpaper(false);
    },
    [closeBottomSheet, buildCenteredUrl, image],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#25262A" />
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}
      >
        <Entypo name="chevron-left" size={35} color="#F1B022" />
        <Text style={styles.headerText}>Explore</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="large" color="#F1B022" />
            <Text style={styles.imageLoadingText}>Loading...</Text>
          </View>
        )}
        <FastImage
          source={{
            uri: optimizedImageUri,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
          onLoadStart={handleImageLoadStart}
          onLoadEnd={handleImageLoadEnd}
          onError={handleImageError}
        />
        {imageError && (
          <View style={styles.imageErrorContainer}>
            <MaterialIcons name="error-outline" size={50} color="#707070" />
            <Text style={styles.imageErrorText}>Failed to load image</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setImageError(false);
                setImageLoading(true);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={downloadImage}>
          <MaterialIcons name="file-download" size={45} color="#707070" />
        </TouchableOpacity>
        {settingWallpaper ? (
          <ActivityIndicator size="large" color="#707070" />
        ) : (
          <TouchableOpacity onPress={openBottomSheet}>
            <MaterialIcons name="now-wallpaper" size={38} color="#707070" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={shareWallpaper}>
          <MaterialIcons name="share" size={38} color="#707070" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={closeBottomSheet}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
            <BottomSheetContent
              image={image}
              setWallpic={setWallpic}
              closeBottomSheet={closeBottomSheet}
            />
          </View>
        </View>
      </Modal>

      {settingWallpaper && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#F1B022" />
              <Text style={styles.loadingText}>Setting wallpaper...</Text>
              <Text style={styles.loadingSubtext}>Please wait</Text>
            </View>
          </View>
        </Modal>
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
    padding: 12,
  },
  headerText: {
    color: '#F1B022',
    fontSize: 20,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 50,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c2023',
    borderRadius: 30,
    zIndex: 10,
  },
  imageLoadingText: {
    color: '#F1B022',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
  },
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c2023',
    borderRadius: 30,
    zIndex: 10,
  },
  imageErrorText: {
    color: '#707070',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#F1B022',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#25262A',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 40,
    marginHorizontal: '8%',
    backgroundColor: '#1c2023',
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#25262A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderTopWidth: 2,
    borderColor: '#707070',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalCloseText: {
    fontSize: 28,
    color: '#F1B022',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingBox: {
    backgroundColor: '#25262A',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F1B022',
    minWidth: 200,
  },
  loadingText: {
    color: '#F1B022',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  loadingSubtext: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 5,
  },
});

export default React.memo(SingleWallpaper);
