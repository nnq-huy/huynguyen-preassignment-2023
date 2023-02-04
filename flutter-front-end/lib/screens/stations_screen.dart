//list all stations with search function
import 'package:citybike/components/custom_texts.dart';
import 'package:citybike/models/station.dart';
import 'package:citybike/screens/station_detail_screen.dart';
import 'package:flutter/material.dart';
import '../helpers/api_get.dart';
import 'package:searchbar_animation/searchbar_animation.dart';

class StationScreen extends StatefulWidget {
  const StationScreen({Key? key}) : super(key: key);

  @override
  State<StationScreen> createState() => _StationScreenState();
}

class _StationScreenState extends State<StationScreen> {
  late Future<List<Station>> futureStations;
  TextEditingController searchTextController = TextEditingController();
  String searchString = "";

  @override
  void initState() {
    super.initState();
    futureStations = fetchStations();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureBuilder<List<Station>>(
          future: futureStations,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return Stack(children: [
                Scrollbar(
                  thickness: 5,
                  trackVisibility: true,
                  child: ListView.builder(
                      itemCount: snapshot.data!.length,
                      itemBuilder: (context, index) {
                        final station = snapshot.data![index];
                        return (station.name)
                                .toLowerCase()
                                .contains(searchString.toLowerCase())
                            ? InkWell(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => StationDetail(
                                          stationId: station.id.toString()),
                                    ),
                                  );
                                },
                                child: Card(
                                  elevation: 8,
                                  child: ListTile(
                                      leading: CircleAvatar(
                                        backgroundColor: const Color.fromARGB(
                                            255, 97, 78, 150),
                                        child: CustomTextWhite(
                                          station.id.toString(),
                                          fontSize: 18,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      title: CustomTextBlack(
                                        station.name,
                                        fontSize: 16,
                                        textColor: Colors.black87,
                                        fontWeight: FontWeight.w800,
                                      ),
                                      subtitle: CustomTextBlack(
                                        station.address,
                                        textColor: Colors.grey,
                                      )),
                                ),
                              )
                            : Container();
                      }),
                ),
                Align(
                  alignment: Alignment.bottomRight,
                  heightFactor: 9.5,
                  widthFactor: 7,
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    //Search bar for station list
                    child: SearchBarAnimation(
                      enableKeyboardFocus: true,
                      onCollapseComplete: () {
                        searchTextController.clear();
                        setState(() {
                          searchString = "";
                        });
                      },
                      hintText: 'Station name...',
                      isSearchBoxOnRightSide: true,
                      secondaryButtonWidget: const Icon(
                        Icons.close,
                        size: 24,
                        color: Colors.black,
                      ),
                      trailingWidget: const Icon(
                        Icons.search,
                        size: 24,
                        color: Colors.black,
                      ),
                      textEditingController: searchTextController,
                      isOriginalAnimation: false,
                      buttonBorderColour: Colors.black45,
                      buttonWidget: const Icon(Icons.search),
                      onFieldSubmitted: (String value) {
                        setState(() {
                          searchString = value.toLowerCase();
                        });
                      },
                      onChanged: (String value) {
                        setState(() {
                          searchString = value.toLowerCase();
                        });
                      },
                    ),
                  ),
                ),
              ]);
            } else if (snapshot.hasError) {
              return Text('${snapshot.error}');
            }
            return const CircularProgressIndicator();
          }),
    );
  }
}
