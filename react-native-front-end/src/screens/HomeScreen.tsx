//Home screen, contains links to app's main functions: data import, data entry
import { View, StyleSheet } from "react-native";
import { Appbar, Divider, List } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View>
      <Appbar mode="center-aligned" safeAreaInsets={{ top }}>
        <Appbar.Content title="Home" />
      </Appbar>
      <View style={styles.container}>
        <List.Section>
          <List.Subheader>Add data from csv</List.Subheader>
          <List.Item
            title="Upload new stations list(csv)"
            left={() => <List.Icon icon="file-delimited" />}
            onPress={() => {}}
          />
          <Divider bold={true} />
          <List.Item
            title="Upload new journey list(csv)"
            left={() => <List.Icon icon="file-delimited" />}
            onPress={() => {}}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Add data manually</List.Subheader>
          <List.Item
            title="Enter a new station"
            left={() => <List.Icon icon="map-marker" />}
            onPress={() => {}}
          />
          <Divider bold={true} />
          <List.Item
            title="Enter a new journey "
            left={() => <List.Icon icon="bike" />}
            onPress={() => {}}
          />
        </List.Section>
      </View>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    backgroundColor: "#E5E0FF",
    margin: 10,
  },
});
