//entry point for the app with appbar and bottom navigation bar
import 'package:citybike/components/custom_texts.dart';
import 'package:citybike/screens/home_screen.dart';
import 'package:citybike/screens/journeys_screen.dart';
import 'package:citybike/screens/stations_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  static const String _title = 'Citybike app';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: _title,
      debugShowCheckedModeBanner: false,
      home: const MyStatefulWidget(),
      theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple)),
    );
  }
}

class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({super.key});

  @override
  State<MyStatefulWidget> createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  int _selectedIndex = 0;
  String _selectedTitle = "Home";
  static const List<Widget> _widgetOptions = <Widget>[
    HomeScreen(),
    StationScreen(),
    JourneysTable(),
  ];
  final screenTitle = ["Home", "Stations", "Journeys"];
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
      _selectedTitle = screenTitle[index];
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: CustomTextWhite(
            _selectedTitle,
            fontSize: 20,
          ),
        ),
        body: Center(
          child: _widgetOptions.elementAt(_selectedIndex),
        ),
        bottomNavigationBar: BottomNavigationBar(
          backgroundColor: Colors.deepPurple,
          unselectedLabelStyle: GoogleFonts.montserrat(
            fontSize: 12,
          ),
          selectedLabelStyle:
              GoogleFonts.montserrat(fontSize: 12, fontWeight: FontWeight.bold),
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.charging_station),
              label: 'Stations',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.bike_scooter),
              label: 'Journeys',
            ),
          ],
          currentIndex: _selectedIndex,
          selectedItemColor: Colors.white,
          onTap: _onItemTapped,
        ),
      ),
    );
  }
}
