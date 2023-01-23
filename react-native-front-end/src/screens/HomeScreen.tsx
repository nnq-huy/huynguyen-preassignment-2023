//Home screen, contains links to app's main functions: data import, data entry
import React, { useState } from "react";
import { View, StyleSheet, Alert, Button } from "react-native";
import { Appbar, Divider, List } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import serverUrl from "../utils/backend";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";

const HomeScreen = () => {
  const [uploadStationsTitle, setUploadStationsTitle] = useState(
    "Upload new stations list(csv)"
  );
  const [uploadJourneysTitle, setUploadJourneysTitle] = useState(
    "Upload new journeys list(csv)"
  );
  const [pushStationsStatus, setPushStationsStatus] = useState(true);
  const [pushJourneysStatus, setPushJourneyStationsStatus] = useState(true);

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
            title={uploadStationsTitle}
            left={() => <List.Icon icon="file-delimited" />}
            onPress={() => {
              handleUploadCsv("stations");
            }}
            right={() => (
              <Button
                color="#8EA7E9"
                title="Push to DB"
                disabled={pushStationsStatus}
                onPress={() => {
                  pushCsvToDb("stations");
                }}
              />
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
                title="Push to DB"
                disabled={pushJourneysStatus}
                onPress={() => {
                  pushCsvToDb("journeys");
                }}
              />
            )}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Add data manually</List.Subheader>
          <List.Item
            title={"Enter a new station"}
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
