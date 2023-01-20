//Station screen, displays stations list
import StationList from "../components/StationList";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StationDetail from "../components/StationDetail";
const StationScreen = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Stations">
        <Stack.Screen name="Stations" component={StationList} />
        <Stack.Screen name="Details" component={StationDetail} />
      </Stack.Navigator>
  );
};

export default StationScreen;
