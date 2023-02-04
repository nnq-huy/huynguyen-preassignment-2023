import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class GMapView extends StatelessWidget {
  const GMapView(this.lat, this.long, this.name, {super.key});
  final double lat;
  final double long;
  final String name;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.45,
      child: GoogleMap(
          markers: <Marker>{
            Marker(
                alpha: 1,
                markerId: MarkerId((lat - long).toString()),
                icon: BitmapDescriptor.defaultMarkerWithHue(
                    BitmapDescriptor.hueViolet),
                position: LatLng(lat, long),
                infoWindow: InfoWindow(title: name)),
          },
          initialCameraPosition:
              CameraPosition(zoom: 15, target: LatLng(lat, long))),
    );
  }
}
