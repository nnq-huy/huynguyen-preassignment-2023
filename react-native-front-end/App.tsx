import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import {
  BottomNavigation,
  Provider as PaperProvider,
} from "react-native-paper";

import { HomeScreen, JourneyScreen, StationScreen } from "./src/screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

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
        <PaperProvider>
          <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
          />
          <StatusBar style="auto" />
        </PaperProvider>
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
