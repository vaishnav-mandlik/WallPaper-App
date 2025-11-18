import {
  View,
  StyleSheet,
  FlatList,
  ToastAndroid,
  Text,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState, useCallback, useMemo } from "react";
import { urlFor } from "../../sanity";
import {
  fetchCategories,
  fetchWallpaperImages,
  getCategoryId,
} from "../../sanity";
import CategoryListUi from "./CategoryListUi";
import Wallpaper from "./Wallpaper";
import WallpaperSkeleton from "../Skeleton/WallpaperSkeleton";

const Category = () => {
  const [CategoryList, setCategoryList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    CategoryList[0]?.name || "Nature"
  );
  const [data, setData] = useState(null);

  const getData = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategoryList(data);
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Something went wrong, please try again",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }, []);

  const fetchWallpaper = useCallback(async () => {
    try {
      const id = await getCategoryId(activeCategory);
      const data = await fetchWallpaperImages(id?._id);
      setData(data);
      // Prefetch first visible images to improve perceived load time
      try {
        const toPrefetch = (data || []).slice(0, 12);
        toPrefetch.forEach((item) => {
          const imgSource = item?.image;
          if (imgSource) {
            const thumb = urlFor(imgSource)
              .width(400)
              .quality(60)
              .auto("format")
              .url();
            Image.prefetch(thumb).catch(() => {});
          }
        });
      } catch (e) {
        // ignore prefetch failures
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Something went wrong, please try again",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }, [activeCategory]);

  useLayoutEffect(() => {
    getData();
    fetchWallpaper();
  }, [activeCategory, getData, fetchWallpaper]);

  const handleCategoryPress = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);

  const skeletonData = useMemo(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    []
  );

  const renderCategory = useCallback(
    ({ item }) => (
      <CategoryListUi
        item={item}
        isActive={item.name === activeCategory}
        onPress={handleCategoryPress}
      />
    ),
    [activeCategory, handleCategoryPress]
  );

  const renderWallpaper = useCallback(
    ({ item }) => <Wallpaper item={item} />,
    []
  );

  const renderSkeleton = useCallback(({ item }) => <WallpaperSkeleton />, []);

  return (
    <View style={styles.cardContainer}>
      <View>
        <FlatList
          data={CategoryList}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) =>
            `${item._id ?? item.name ?? "category"}-${index}`
          }
          renderItem={renderCategory}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
        />
      </View>

      {!data && (
        <View>
          <FlatList
            data={skeletonData}
            numColumns={3}
            renderItem={renderSkeleton}
            keyExtractor={(item) => `skeleton-${item}`}
            maxToRenderPerBatch={12}
            updateCellsBatchingPeriod={50}
          />
        </View>
      )}

      <View style={styles.wallpaperWrapper}>
        {data && data.length > 0 && (
          <FlatList
            data={data}
            numColumns={3}
            renderItem={renderWallpaper}
            keyExtractor={(item, index) =>
              `${item._id ?? item.title ?? "wallpaper"}-${index}`
            }
            initialNumToRender={9}
            maxToRenderPerBatch={12}
            updateCellsBatchingPeriod={50}
            windowSize={7}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => {
              const rowHeight = 170 + 12; // item height + vertical margins
              const rowIndex = Math.floor(index / 3);
              return { length: rowHeight, offset: rowIndex * rowHeight, index };
            }}
          />
        )}

        {data && data.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Wallpaper not found</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: "#E8EBEC",
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  cardContainer: {
    flex: 1,
  },
  wallpaperWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default React.memo(Category);
