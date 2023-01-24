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
import { Station, Journey } from "../utils/types";
import { MaskedTextInput } from "react-native-mask-text";

const HomeScreen = () => {
  const [uploadStationsTitle, setUploadStationsTitle] = useState(
    "Upload new stations list(csv)"
  );
  const [uploadJourneysTitle, setUploadJourneysTitle] = useState(
    "Upload new journeys list(csv)"
  );
  const [pushStationsStatus, setPushStationsStatus] = useState(true);
  const [pushJourneysStatus, setPushJourneyStationsStatus] = useState(true);
  const [newStationDialogVisible, setStationVisible] = useState(false);
  const [newStation, setNewStation] = useState({
    id: "",
    name: "",
    address: "",
    x: "",
    y: "",
  });
  const [newJourneyDialogVisible, setJourneyVisible] = useState(false);
  const [newJourney, setNewJourney] = useState({
    departure_time: "",
    return_time: "",
    departure_station_id: "",
    departure_station: "",
    return_station_id: "",
    return_station: "",
    duration: "",
    distance: "",
  });

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
    let uploadStation: Station = {
      id: parseInt(newStation.id),
      name: newStation.name,
      address: newStation.address,
      x: parseFloat(newStation.x),
      y: parseFloat(newStation.y),
    };
    const url = serverUrl + "/stations/new";
    try {
      const responseOfDbQuery = await axios.post(url, uploadStation);
      if (responseOfDbQuery.status === 201) {
        setStationVisible(false);
        Alert.alert(url, responseOfDbQuery.data);
      }
    } catch (err) {
      setStationVisible(false);
      Alert.alert(url, "error: " + err);
    }
  };
  const putNewJourney = async () => {
    let uploadJourney: Journey = {
      departure_time: newJourney.departure_time,
      return_time: newJourney.return_time,
      departure_station_id: parseInt(newJourney.departure_station_id),
      departure_station: newJourney.departure_station,
      return_station_id: parseInt(newJourney.departure_station_id),
      return_station: newJourney.return_station,
      duration:
        (Date.parse(newJourney.return_time) -
          Date.parse(newJourney.departure_time)) /
        1000,
      distance: parseFloat(newJourney.distance),
    };
    const url = serverUrl + "/journeys/new";
    try {
      const responseOfDbQuery = await axios.post(url, uploadJourney);
      if (responseOfDbQuery.status === 201) {
        setJourneyVisible(false);
        Alert.alert(url, responseOfDbQuery.data);
      }
    } catch (err) {
      setJourneyVisible(false);
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
              onPress={() => {
                setStationVisible(true);
              }}
            />
            <Divider bold={true} />
            <List.Item
              title="Enter a new journey "
              left={() => <List.Icon icon="bike" />}
              onPress={() => {
                setJourneyVisible(true);
              }}
            />
          </List.Section>
          <Portal>
            <Dialog
              visible={newStationDialogVisible}
              onDismiss={() => {
                setStationVisible(false);
              }}
            >
              <Dialog.Title>New Station</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Enter new station details:</Text>
                <TextInput
                  label="Station id"
                  onChangeText={(text) =>
                    setNewStation({ ...newStation, id: text })
                  }
                />
                <TextInput
                  label="Station name"
                  onChangeText={(text) =>
                    setNewStation({ ...newStation, name: text })
                  }
                />
                <TextInput
                  label="Station address"
                  onChangeText={(text) =>
                    setNewStation({ ...newStation, address: text })
                  }
                />
                <TextInput
                  label="Latitude"
                  onChangeText={(text) =>
                    setNewStation({ ...newStation, y: text })
                  }
                />
                <TextInput
                  label="Longitude"
                  onChangeText={(text) =>
                    setNewStation({ ...newStation, x: text })
                  }
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  color="#8EA7E9"
                  onPress={() => {
                    setStationVisible(false);
                  }}
                >
                  Cancel
                </Button>
                <Button color="#8EA7E9" onPress={putNewStation}>
                  Ok
                </Button>
              </Dialog.Actions>
            </Dialog>
            <Dialog
              visible={newJourneyDialogVisible}
              onDismiss={() => {
                setJourneyVisible(false);
              }}
            >
              <Dialog.Title>New Journey</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Enter new journey details:</Text>
                <MaskedTextInput
                  placeholder="Departure time"
                  onChangeText={(text) =>
                    setNewJourney({ ...newJourney, departure_time: text })
                  }
                  mask="9999-99-99T99:99:99"
                  style={styles.maskedInput}
                  keyboardType="numeric"
                />
                <MaskedTextInput
                  placeholder="Return time"
                  onChangeText={(text) =>
                    setNewJourney({ ...newJourney, return_time: text })
                  }
                  mask="9999-99-99T99:99:99"
                  style={styles.maskedInput}
                  keyboardType="numeric"
                />
                <TextInput
                  label="Departure Station Id"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setNewJourney({ ...newJourney, departure_station_id: text })
                  }
                />
                <TextInput
                  label="Departure Station"
                  onChangeText={(text) =>
                    setNewJourney({ ...newJourney, departure_station: text })
                  }
                />
                <TextInput
                  label="Return Station Id"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setNewJourney({ ...newJourney, return_station_id: text })
                  }
                />
                <TextInput
                  label="Return Station"
                  onChangeText={(text) =>
                    setNewJourney({ ...newJourney, return_station: text })
                  }
                />
                <Text style={styles.text}>
                  Duration:{" "}
                  {(Date.parse(newJourney.return_time) -
                    Date.parse(newJourney.departure_time)) /
                    1000}{" "}
                  seconds
                </Text>
                <TextInput
                  label="Distance(m)"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setNewJourney({ ...newJourney, distance: text })
                  }
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  color="#8EA7E9"
                  onPress={() => {
                    setJourneyVisible(false);
                  }}
                >
                  Cancel
                </Button>
                <Button color="#8EA7E9" onPress={putNewJourney}>
                  Ok
                </Button>
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
  maskedInput: {
    height: 25,
    margin: 10,
  },
  text: {
    height: 30,
    margin: 10,
  },
});
