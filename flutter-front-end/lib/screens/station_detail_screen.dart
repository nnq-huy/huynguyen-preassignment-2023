//show detailed station info on a carousel and station's location on google maps
import 'package:citybike/components/custom_texts.dart';
import 'package:citybike/components/googlemaps_view.dart';
import 'package:citybike/components/station_card.dart';
import 'package:citybike/helpers/api_get.dart';
import 'package:citybike/models/station.dart';
import 'package:flutter/material.dart';

class StationDetail extends StatefulWidget {
  const StationDetail({Key? key, required this.stationId}) : super(key: key);
  final String stationId;
  @override
  State<StationDetail> createState() => _StationDetailState();
}

class _StationDetailState extends State<StationDetail> {
  late Future<StationInfo> futureStation;

  @override
  void initState() {
    super.initState();
    futureStation = fetchStation(widget.stationId);
  }

  @override
  Widget build(BuildContext context) {
    final id = widget.stationId;
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: CustomTextWhite(
            'Station $id details',
            fontSize: 20,
          ),
        ),
        body: Center(
          child: FutureBuilder(
              future: futureStation,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  final station = snapshot.data!;
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      StationCard(station: station),
                      GMapView(station.y.toDouble(), station.x.toDouble(),
                          station.name)
                    ],
                  );
                } else if (snapshot.hasError) {
                  return CustomTextBlack('${snapshot.error}');
                }
                return const CircularProgressIndicator();
              }),
        ),
      ),
    );
  }
}
