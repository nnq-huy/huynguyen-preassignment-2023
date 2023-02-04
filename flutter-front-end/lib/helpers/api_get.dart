import 'dart:convert';
import 'package:citybike/constants/backend.dart';
import 'package:citybike/models/journey.dart';
import 'package:http/http.dart' as http;
import '../models/station.dart';

Future<List<Station>> fetchStations() async {
  final response = await http.get(Uri.parse('$APIURL/stations'));
  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    Iterable stationsList = json.decode(response.body);
    return List<Station>.from(
        stationsList.map((model) => Station.fromJson(model)));
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load stations data');
  }
}

Future<StationInfo> fetchStation(String stationId) async {
  final response = await http.get(Uri.parse('$APIURL/station/id=$stationId'));
  if (response.statusCode == 200) {
    return StationInfo.fromJson(json.decode(response.body));
  } else {
    throw Exception('Failed to load stations data');
  }
}

Future<List<Journey>> fetchJourneys() async {
  final response = await http.get(Uri.parse('$APIURL/journeys'));
  if (response.statusCode == 200) {
    Iterable journeysList = json.decode(response.body);
    return List<Journey>.from(
        journeysList.map((model) => Journey.fromJson(model)));
  } else {
    throw Exception('Failed to load journeys data');
  }
}

Future<String?> uploadFile(String type, String filePath) async {
  var request =
      http.MultipartRequest('POST', Uri.parse('$APIURL/upload/$type'));
  request.files.add(await http.MultipartFile.fromPath(
    'file',
    filePath,
  ));
  var response = await request.send();
  return response.reasonPhrase;
}

Future<String?> parseCsv(String type) async {
  var response = await http.post(Uri.parse('$APIURL/csv/$type'));
  return response.reasonPhrase;
}

Future<String?> newStation(Station station) async {
  var response = await http.post(
    Uri.parse('$APIURL/stations/new'),
    body: jsonEncode(station),
    headers: {"Content-Type": "application/json"},
  );
  return response.statusCode.toString();
}
