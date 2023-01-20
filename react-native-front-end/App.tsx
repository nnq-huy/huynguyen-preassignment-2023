import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";

import { HomeScreen, JourneyScreen, StationScreen } from "./src/screens";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "station", title: "Stations", focusedIcon: "sign-real-estate" },
    { key: "journey", title: "Journeys", focusedIcon: "bicycle" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    station: StationScreen,
    journey: JourneyScreen,
  });
  return (
    <NavigationContainer>
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
      <StatusBar style="auto" />
    </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
