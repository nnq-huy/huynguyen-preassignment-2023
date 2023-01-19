//Station screen, displays stations list
import { Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StationList from "../components/StationList";

const StationScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Appbar mode="center-aligned" safeAreaInsets={{ top }}>
        <Appbar.Content title="Stations" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar>
      <StationList/>
    </View>
  );
};

export default StationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
