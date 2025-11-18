import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useCallback, useMemo } from "react";
import Wallpaper from "./Wallpaper";

const SearchWallpaper = (data) => {
  const renderWallpaper = useCallback(
    ({ item }) => <Wallpaper item={item} />,
    []
  );

  return (
    <View style={styles.container}>
      {data.data && data.data.length > 0 && (
        <FlatList
          data={data.data}
          numColumns={3}
          renderItem={renderWallpaper}
          keyExtractor={(item, index) =>
            `${item._id ?? item.title ?? "search-wallpaper"}-${index}`
          }
          initialNumToRender={9}
          maxToRenderPerBatch={12}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews={true}
          getItemLayout={(d, index) => {
            const rowHeight = 170 + 12; // item height + vertical margins
            const rowIndex = Math.floor(index / 3);
            return { length: rowHeight, offset: rowIndex * rowHeight, index };
          }}
        />
      )}
      {data.data && data.data.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Wallpaper not found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default React.memo(SearchWallpaper);
