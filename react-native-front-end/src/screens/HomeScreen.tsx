//Home screen, contains links to app's main functions: data import, data entry
import { Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="displayMedium">Home</Text>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
