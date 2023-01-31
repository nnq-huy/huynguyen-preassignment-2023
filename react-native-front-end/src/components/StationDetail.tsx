import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, ScrollView } from "react-native";
import { ActivityIndicator, Card, DataTable, Text } from "react-native-paper";
import BACKEND_URL from "../utils/backend";
import { Station, StationInfo } from "../utils/types";

const useGetStationInfo = (url: string) => {
  const [data, setData] = useState<StationInfo>(emptyStation);
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
    BACKEND_URL + "/station/id=" + id
  );
  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error.toString()}</Text>
      </View>
    );
  } else if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} color={"#6750a4"} size="large" />
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <ScrollView>
        <Card>
          <Card.Title
            title={name}
            titleStyle={styles.title}
            subtitle={address}
          ></Card.Title>
          <Card.Content>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell style={styles.textCell}>
                  Journeys starting from this station
                </DataTable.Cell>
                <DataTable.Cell style={styles.numberCell} numeric>
                  {data.departure_count}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell style={styles.textCell}>
                  Journeys ending at this station
                </DataTable.Cell>
                <DataTable.Cell style={styles.numberCell} numeric>
                  {data.return_count}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell style={styles.textCell}>
                  Avg distance of journeys from this station
                </DataTable.Cell>
                <DataTable.Cell style={styles.numberCell} numeric>
                  {(data.avg_starting_dist / 1000).toFixed(2)}km
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell style={styles.textCell}>
                  Avg distance of journeys to this station
                </DataTable.Cell>
                <DataTable.Cell style={styles.numberCell} numeric>
                  {(data.avg_ending_dist / 1000).toFixed(2)}km
                </DataTable.Cell>
              </DataTable.Row>
              <Text variant="titleMedium">
                Most popular destinations from this station:{" "}
                {data.most_popular_return.length > 0
                  ? data.most_popular_return[0].return_station
                  : ""}
                ,{" "}
                {data.most_popular_return.length > 1
                  ? data.most_popular_return[1].return_station
                  : ""}
                ,{" "}
                {data.most_popular_return.length > 2
                  ? data.most_popular_return[2].return_station
                  : ""}
                ,{" "}
                {data.most_popular_return.length > 3
                  ? data.most_popular_return[3].return_station
                  :""}
                ,{" "}
                {data.most_popular_return.length > 4
                  ? data.most_popular_return[4].return_station
                  :""}
              </Text>
              <Text variant="titleMedium">
                Most popular departures to this station:{" "}
                {data.most_popular_departure.length > 0
                  ? data.most_popular_departure[0].departure_station
                  : ""}
                ,{" "}
                {data.most_popular_departure.length > 1
                  ? data.most_popular_departure[1].departure_station
                  : ""}
                ,{" "}
                {data.most_popular_departure.length > 2
                  ? data.most_popular_departure[2].departure_station
                  : ""}
                ,{" "}
                {data.most_popular_departure.length > 3
                  ? data.most_popular_departure[3].departure_station
                  : ""}
                ,{" "}
                {data.most_popular_departure.length > 4
                  ? data.most_popular_departure[4].departure_station
                  : ""}
              </Text>
            </DataTable>
          </Card.Content>
        </Card>
      </ScrollView>
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
    </View>
  );
};

export default StationDetail;
const styles = StyleSheet.create({
  address: {
    fontSize: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dataTable: {
    margin: 5,
  },
  map: {
    width: "100%",
    height: "50%",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "100",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  numberCell: {
    flex: 1,
  },
  textCell: {
    flex: 5,
  },
  screen: {
    height: "100%",
  },
});
