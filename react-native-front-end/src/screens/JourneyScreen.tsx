//Journey screen, displays journeys list
import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import serverUrl from "../utils/backend";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

type ItemsState = Array<{
  id: number;
  departure_station: string;
  return_station: string;
  distance: number;
  duration: number;
}>;

async function getJourneys() {
  const url = serverUrl + "/journeys";
  const response = await axios.get(url);
  const jsonResult = await response.data;
  const result: ItemsState = jsonResult.map(
    (w: {
      id: number;
      departure_station: string;
      return_station: string;
      distance: number;
      duration: number;
    }) => ({
      id: w.id,
      departure_station: w.departure_station,
      return_station: w.return_station,
      distance: w.distance,
      duration: w.duration,
    })
  );
  return result;
}
let a: ItemsState = [];
getJourneys().then((data) => {
  a = data;
});

const JourneyScreen = () => {
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [items] = useState<ItemsState>(a);
  const [numberOfItemsPerPageList] = useState([10, 20, 40]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const sortedByDeparture = items
    .slice()
    .sort((item1, item2) =>
      (
        sortAscending
          ? item1.departure_station > item2.departure_station
          : item2.departure_station > item1.departure_station
      )
        ? 1
        : -1
    );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <SafeAreaView>
    <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title
            sortDirection={sortAscending ? "ascending" : "descending"}
            onPress={() => setSortAscending(!sortAscending)}
            style={styles.first}
          >
            Departure Station
          </DataTable.Title>
          <DataTable.Title>Return Station</DataTable.Title>
          <DataTable.Title numeric>Distance (km)</DataTable.Title>
          <DataTable.Title numeric>Duration (m)</DataTable.Title>
        </DataTable.Header>

        {sortedByDeparture.slice(from, to).map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell style={styles.first}>
              {item.departure_station}
            </DataTable.Cell>
            <DataTable.Cell style={styles.first}>
              {item.return_station}
            </DataTable.Cell>
            <DataTable.Cell numeric>{(item.distance/1000).toFixed(2)}</DataTable.Cell>
            <DataTable.Cell numeric>{(item.duration/60).toFixed(0)}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Rows per page"}
        />
      </DataTable>
    </ScrollView>
    </SafeAreaView>
  );
};

export default JourneyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 32,
  },
  address: {
    fontSize: 10,
  },
  first: {
    flex: 1,
  },
  sec: {
    flex: 4,
  },
  pagination: {
    fontSize: 4,
  },
});
