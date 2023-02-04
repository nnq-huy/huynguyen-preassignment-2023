import 'package:citybike/components/carousel_item.dart';
import 'package:citybike/models/station.dart';
import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class CarouselView extends StatelessWidget {
  const CarouselView(this.station, {super.key});
  final StationInfo station;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(0, 10, 0, 0),
      child: CarouselSlider(items: [
        CarouselItem(
            title: 'Station stats:',
            item1: 'Departure count',
            item1Value: station.departureCount.toString(),
            item2: 'Return count',
            item2Value: station.returnCount.toString(),
            item3: 'Average starting distance',
            item3Value:
                '${(station.avgStartingDistance / 1000).toStringAsFixed(2)}km',
            item4: 'Average ending distance',
            item4Value:
                '${(station.avgEndingDistance / 1000).toStringAsFixed(2)}km',
            item5: ' ',
            item5Value: ' '),
        CarouselItem(
            title: 'Top 5 Departures ',
            item1: station.mostPopularDeparture[0].station,
            item1Value: '${station.mostPopularDeparture[0].count} trips',
            item2: station.mostPopularDeparture[1].station,
            item2Value: '${station.mostPopularDeparture[1].count} trips',
            item3: station.mostPopularDeparture[2].station,
            item3Value: '${station.mostPopularDeparture[2].count} trips',
            item4: station.mostPopularDeparture[3].station,
            item4Value: '${station.mostPopularDeparture[3].count} trips',
            item5: station.mostPopularDeparture[4].station,
            item5Value: '${station.mostPopularDeparture[4].count} trips'),
        CarouselItem(
            title: 'Top 5 Destinations ',
            item1: station.mostPopularReturn[0].station,
            item1Value: '${station.mostPopularReturn[0].count} trips',
            item2: station.mostPopularReturn[1].station,
            item2Value: '${station.mostPopularReturn[1].count} trips',
            item3: station.mostPopularReturn[2].station,
            item3Value: '${station.mostPopularReturn[2].count} trips',
            item4: station.mostPopularReturn[3].station,
            item4Value: '${station.mostPopularReturn[3].count} trips',
            item5: station.mostPopularReturn[4].station,
            item5Value: '${station.mostPopularReturn[4].count} trips'),
      ], options: CarouselOptions(autoPlay: false, enlargeCenterPage: true)),
    );
  }
}
