//Station screen, displays stations list
import { View, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StationList from "../components/StationList";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StationDetail from "../components/StationDetail";
const StationScreen = () => {
  const { top } = useSafeAreaInsets();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Stations">
        <Stack.Screen name="Stations" component={StationList} />
        <Stack.Screen name="Details" component={StationDetail} />
      </Stack.Navigator>
  );
};

export default StationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
