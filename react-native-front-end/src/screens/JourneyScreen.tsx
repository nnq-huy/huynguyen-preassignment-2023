//Journey screen, displays journeys list
import { Text } from "react-native-paper";
import { View , StyleSheet} from "react-native";

const JourneyScreen = () => {
    return (
        <View style={styles.container}>
          <Text variant="displayMedium">Journeys</Text>
        </View>
      );
};

export default JourneyScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  