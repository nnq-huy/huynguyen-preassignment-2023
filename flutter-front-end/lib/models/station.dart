//model for journey data from backend

class Station {
  num id;
  String name;
  String address;
  num x;
  num y;

  Station(this.id, this.name, this.address, this.x, this.y);

  Station.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        address = json['address'],
        x = json['x'],
        y = json['y'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'address': address,
        'x': x,
        'y': y,
      };
}

class DepartureCount {
  final String station;
  final String count;
  DepartureCount(this.station, this.count);
  DepartureCount.fromJson(Map<String, dynamic> json)
      : station = json['departure_station'],
        count = json['count'];
}

class ReturnCount {
  final String station;
  final String count;
  ReturnCount(this.station, this.count);
  ReturnCount.fromJson(Map<String, dynamic> json)
      : station = json['return_station'],
        count = json['count'];
}

class StationInfo {
  num id;
  String name;
  String address;
  num x;
  num y;
  num departureCount;
  num returnCount;
  double avgStartingDistance;
  double avgEndingDistance;
  List<DepartureCount> mostPopularDeparture;
  List<ReturnCount> mostPopularReturn;

  StationInfo(
      this.id,
      this.name,
      this.address,
      this.x,
      this.y,
      this.departureCount,
      this.returnCount,
      this.avgStartingDistance,
      this.avgEndingDistance,
      this.mostPopularDeparture,
      this.mostPopularReturn);

  factory StationInfo.fromJson(dynamic json) {
    var retObjJson = json['most_popular_return'] as List;
    var depObjJson = json['most_popular_departure'] as List;
    List<DepartureCount> mostPopularDeparture =
        depObjJson.map((e) => DepartureCount.fromJson(e)).toList();
    List<ReturnCount> mostPopularReturn =
        retObjJson.map((e) => ReturnCount.fromJson(e)).toList();

    return StationInfo(
        json['id'],
        json['name'],
        json['address'],
        json['x'],
        json['y'],
        num.parse(json['departure_count']),
        num.parse(json['return_count']),
        json['avg_starting_dist'],
        json['avg_ending_dist'],
        mostPopularDeparture,
        mostPopularReturn);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'address': address,
        'x': x,
        'y': y,
        'departure_count': departureCount,
        'return_count': returnCount,
        'avg_starting_dist': avgStartingDistance,
        'avg_ending_dist': avgEndingDistance,
        'most_popular_departure': mostPopularDeparture,
        'most_popular_return': mostPopularReturn
      };
}
