//Home screen, contains links to app's main functions: data import, data entry
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Divider,
  List,
  Provider,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import serverUrl from "../utils/backend";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { Station } from "../utils/types";

const HomeScreen = () => {
  const [uploadStationsTitle, setUploadStationsTitle] = useState(
    "Upload new stations list(csv)"
  );
  const [uploadJourneysTitle, setUploadJourneysTitle] = useState(
    "Upload new journeys list(csv)"
  );
  const [pushStationsStatus, setPushStationsStatus] = useState(true);
  const [pushJourneysStatus, setPushJourneyStationsStatus] = useState(true);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [stationId, setStationId] = useState("");
  const [stationName, setStationName] = useState("");
  const [stationAddress, setStationAddress] = useState("");
  const [stationLatitude, setStationLatitude] = useState("");
  const [stationLongitude, setStationLongitude] = useState("");

  const  resetStationInput= ()=> {
    setStationId("");
    setStationName("");
    setStationAddress("");
    setStationLatitude("");
    setStationLongitude("");
  }
  const handleUploadCsv = (csvType: String) => {
    let formData = new FormData();
    let url = serverUrl + "/upload/" + csvType;
    DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    }).then(async (result: DocumentPicker.DocumentResult) => {
      if (result.type === "success") {
        //
        let { name, size, uri } = result;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        formData.append("file", fileToUpload);
        try {
          const responseOfFileUpload = await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (responseOfFileUpload.status === 200) {
            let fileName = responseOfFileUpload.data.fileName;
            if (csvType === "stations") {
              setUploadStationsTitle(fileName + " uploaded");
              setPushStationsStatus(false);
            } else {
              setUploadJourneysTitle(fileName + " uploaded");
              setPushJourneyStationsStatus(false);
            }
            Alert.alert(fileName + " was uploaded succesfully");
          } else {
            Alert.alert("Upload Failed 1");
          }
        } catch (err) {
          Alert.alert(url, "error: " + err);
        }
      } else if (result.type === "cancel") {
        Alert.alert("Upload cancelled");
      }
    });
  };
  const pushCsvToDb = async (csvType: string) => {
    let url = serverUrl + "/csv/" + csvType;
    try {
      const responseOfDbQuery = await axios.post(url);
      if (responseOfDbQuery.status === 200) {
        Alert.alert(url, "Import operations executed succesfully");
      }
    } catch (err) {
      Alert.alert(url, "error: " + err);
    }
  };
  const putNewStation = async () => {
    let newStation: Station = {
      id: parseInt(stationId),
      name: stationName,
      address: stationAddress,
      x: parseFloat(stationLongitude),
      y: parseFloat(stationLatitude),
    };
    const url = serverUrl + "/stations/new";
    try {
      const responseOfDbQuery = await axios.post(url, newStation);
      if (responseOfDbQuery.status === 201) {
        hideDialog();
        Alert.alert(url, responseOfDbQuery.data);
        resetStationInput();
      }
    } catch (err) {
      hideDialog();
      Alert.alert(url, "error: " + err);
    }
  };
  const { top } = useSafeAreaInsets();
  return (
    <Provider>
      <View>
        <Appbar mode="center-aligned" safeAreaInsets={{ top }}>
          <Appbar.Content title="Home" />
        </Appbar>
        <View style={styles.container}>
          <List.Section>
            <List.Subheader>Add data from csv</List.Subheader>
            <List.Item
              title={uploadStationsTitle}
              left={() => <List.Icon icon="file-delimited" />}
              onPress={() => {
                handleUploadCsv("stations");
              }}
              right={() => (
                <Button
                  color="#8EA7E9"
                  disabled={pushStationsStatus}
                  onPress={() => {
                    pushCsvToDb("stations");
                  }}
                >
                  Push to DB
                </Button>
              )}
            />
            <Divider bold={true} />
            <List.Item
              title={uploadJourneysTitle}
              left={() => <List.Icon icon="file-delimited" />}
              onPress={() => {
                handleUploadCsv("journeys");
              }}
              right={() => (
                <Button
                  color="#8EA7E9"
                  disabled={pushJourneysStatus}
                  onPress={() => {
                    pushCsvToDb("journeys");
                  }}
                >
                  Push to DB
                </Button>
              )}
            />
          </List.Section>
          <List.Section>
            <List.Subheader>Add data manually</List.Subheader>
            <List.Item
              title={"Enter a new station"}
              left={() => <List.Icon icon="map-marker" />}
              onPress={showDialog}
            />
            <Divider bold={true} />
            <List.Item
              title="Enter a new journey "
              left={() => <List.Icon icon="bike" />}
              onPress={() => {}}
            />
          </List.Section>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>New Station</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Enter new station details:</Text>
                <TextInput
                  label="Station id"
                  value={stationId}
                  onChangeText={(text) => setStationId(text)}
                />
                <TextInput
                  label="Station name"
                  value={stationName}
                  onChangeText={(text) => setStationName(text)}
                />
                <TextInput
                  label="Station address"
                  value={stationAddress}
                  onChangeText={(text) => setStationAddress(text)}
                />
                <TextInput
                  label="Latitude"
                  value={stationLatitude}
                  onChangeText={(text) => setStationLatitude(text)}
                />
                <TextInput
                  label="Longitude"
                  value={stationLongitude}
                  onChangeText={(text) => setStationLongitude(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button color="#8EA7E9"  onPress={hideDialog} >Cancel</Button>
                <Button color="#8EA7E9"  onPress={putNewStation} >Ok</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </View>
    </Provider>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    backgroundColor: "#E5E0FF",
    margin: 10,
  },
  fixToText: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
