import 'package:citybike/components/custom_texts.dart';
import 'package:citybike/components/carousel.dart';
import 'package:citybike/models/station.dart';
import 'package:flutter/material.dart';

class StationCard extends StatelessWidget {
  const StationCard({super.key, required this.station});

  final StationInfo station;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.43,
      width: MediaQuery.of(context).size.width,
      child: Column(
        children: [
          CustomTextWhite(
            station.name,
            textColor: Colors.deepPurple,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
          CustomTextWhite(
            station.address,
            textColor: Colors.black54,
          ),
          CarouselView(station)
        ],
      ),
    );
  }
}
