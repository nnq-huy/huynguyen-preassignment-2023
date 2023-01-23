import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Card } from "react-native-paper";
import backendUrl from "../utils/backend";
import { Station , StationInfo} from "../utils/types";

const useGetStationInfo = (url: string) => {
  const [data, setData] = useState<Station>(emptyStation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
const emptyStation: StationInfo = {
  id: 0,
  name: "a",
  address: "a",
  x: 0.0,
  y: 0.0,
  departure_count: 0,
  return_count: 0,
  avg_starting_dist: 0,
  avg_ending_dist: 0,
  most_popular_return: [],
  most_popular_departure: [],
};

const StationDetail = ({ route, navigation }) => {
  const { id, name, address, x, y } = route.params;
  const { data, loading, error } = useGetStationInfo(
    backendUrl + "/station/id=" + id
  );
  if (error) {
    return <Text>{error.toString()}</Text>;
  } else if (loading) {
    return <ActivityIndicator animating={true} color={"EFA3C8"} size="large" />;
  }
  return (
    <View>
      <Card>
        <Card.Title
          title={name}
          titleStyle={styles.title}
          subtitle={address}
        ></Card.Title>
        <Card.Content>
          <Text>
            Journeys starting from this station: {data.departure_count}
          </Text>
          <Text>Journeys ending at this station: {data.return_count}</Text>
          <Text>
            Average distance of journeys starting from this station:{" "}
            {data.avg_starting_dist}
          </Text>
          <Text>
            Average distance of journeys ending at this station:{" "}
            {data.avg_ending_dist}
          </Text>
        </Card.Content>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: y,
            longitude: x,
            latitudeDelta: 0.0092,
            longitudeDelta: 0.0042,
          }}
        >
          <Marker coordinate={{ latitude: y, longitude: x }} />
        </MapView>
      </Card>
    </View>
  );
};

export default StationDetail;
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "100",
  },
  address: {
    fontSize: 10,
  },
  map: {
    paddingTop: 10,
    width: "100%",
    height: "50%",
  },
});
