import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const BottomSheetContent = ({ image, closeBottomSheet, setWallpic }) => {
  return (
    <View className="flex-col gap-3 justify-center items-center p-4 border">
      <View>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            setWallpic(image, TYPE.HOME);
            closeBottomSheet();
          }}
        >
          <AntDesign name="home" size={35} color="#707070" />
          <Text className="text-[#707070] ml-2 text-lg font-semibold">
            Home Screen
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            setWallpic(image, TYPE.LOCK);
            closeBottomSheet();
          }}
        >
          <AntDesign name="lock" size={35} color="#707070" />
          <Text className="text-[#707070] ml-2 text-lg font-semibold">
            Lock Screen
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => {
          setWallpic(image, TYPE.BOTH);
          closeBottomSheet();
        }}
      >
        <AntDesign name="mobile1" size={35} color="#707070" />
        <Text className="text-[#707070] ml-2 text-lg font-semibold">
          Both Screen
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomSheetContent;
