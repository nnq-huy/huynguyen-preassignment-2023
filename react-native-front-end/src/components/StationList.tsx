//list of stations component
import { useState, useEffect } from "react";
import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Card } from "react-native-paper";
import backendUrl from "../utils/backend";
import axios from "axios";
import { Station } from "../utils/types";
import { Searchbar } from "react-native-paper";

//Local search function on list of stations loaded from backend
const searchFunction = (keyword: string, list: Array<Station>) => {
  function listFilter(value: Station) {
    return value.name.toLowerCase().includes(keyword.toLowerCase());
  }
  return list.filter(listFilter);
};

const useGetStation = (url: string) => {
  const [data, setData] = useState<Array<Station>>([]);
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

const StationList = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const Item = ({ data }: { data: Station }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate("Details", {
          id: data.id,
          name: data.name,
          address: data.address,
          x: data.x,
          y: data.y,
        })
      }
    >
      <Card.Title
        title={data.name}
        titleStyle={styles.title}
        subtitle={data.address}
        subtitleStyle={styles.subtitle}
        right={(props: any) => (
          <Avatar.Text
            {...props}
            size={48}
            style={styles.avatar}
            label={data.id.toString()}
          />
        )}
      />
    </Card>
  );

  const { data, loading, error } = useGetStation(backendUrl + "/stations");

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error.toString()}</Text>
      </View>
    );
  } else if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} color={"#EFA3C8"} size="large" />
      </View>
    );
  }
  return (
    <View>
      <FlatList
        data={searchFunction(searchQuery, data)}
        ListHeaderComponent={
          <Searchbar
            placeholder="Search"
            onChangeText={(text: string) => setSearchQuery(text)}
            value={searchQuery}
          />
        }
        renderItem={({ item }) => <Item data={item} />}
        keyExtractor={(item: Station) => item.id.toString()}
      />
    </View>
  );
};

export default StationList;

const styles = StyleSheet.create({
  address: {
    fontSize: 10,
  },
  avatar: { margin: 8 },
  card: { margin: 4, flex: 1, minWidth: 350 },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "100",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
