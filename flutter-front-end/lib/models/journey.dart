//model for journey data from backend
class Journey {
  int id;
  String departureStation;
  String returnStation;
  double distance;
  double duration;

  Journey(this.id, this.departureStation, this.returnStation, this.distance,
      this.duration);

  Journey.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        departureStation = json['departure_station'],
        returnStation = json['return_station'],
        distance = double.parse(json['distance'].toString()),
        duration = double.parse(json['duration'].toString());

  Map<String, dynamic> toJson() => {
        'id': id,
        'departure_station': departureStation,
        'return_station': returnStation,
        'distance': distance,
        'duration': duration,
      };
}
