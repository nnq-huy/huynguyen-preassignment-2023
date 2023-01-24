//list of stations component
import { useState, useEffect } from "react";
import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Card } from "react-native-paper";
import backendUrl from "../utils/backend";
import axios from "axios";
import { Station } from "../utils/types";

const useGetStation = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        ///const json = await response.json();
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



const StationList = ({navigation}) => {
  const Item = ({ data }: { data: Station }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('Details', {id:data.id, name: data.name, address:data.address, x:data.x, y:data.y})}>
      <Card.Title
        title={data.name}
        titleStyle={styles.title}
        subtitle={data.address}
        subtitleStyle={styles.subtitle}
        right={(props: any) => (
          <Avatar.Text
            {...props}
            size={32}
            style={styles.avatar}
            label={data.id.toString()}
          />
        )}
      />
    </Card>
  );

  const { data, loading, error } = useGetStation(backendUrl + "/stations");
  if (error) {
    return <View style={styles.container}><Text>{error.toString()}</Text></View>;
  } else if (loading) {
    return <View style={styles.container}><ActivityIndicator animating={true} color={"#EFA3C8"} size="large" /></View>;
  }
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item data={item} />}
        keyExtractor={(item: Station) => item.id.toString()}
        /* getItemLayout={(data, index) => (
            {length: 10, offset: 10* index, index}
          )} */
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
    flex:1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent:"center"
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
