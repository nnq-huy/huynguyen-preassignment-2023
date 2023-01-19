//Station screen, displays stations list
import { Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const StationScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="displayMedium">Stations</Text>
    </View>
  );
};

export default StationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
