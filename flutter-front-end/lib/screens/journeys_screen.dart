//show all journeys fetched from backend in a paginated datatable with controls
import 'package:citybike/components/custom_texts.dart';
import 'package:citybike/helpers/api_get.dart';
import 'package:citybike/models/journey.dart';
import 'package:data_table_2/data_table_2.dart';
import 'package:flutter/material.dart';

class JourneysTable extends StatefulWidget {
  const JourneysTable({super.key});

  @override
  State<JourneysTable> createState() => _JourneysTableState();
}

class _JourneysTableState extends State<JourneysTable> {
  late Future<List<Journey>> futureJourneys;
  @override
  void initState() {
    super.initState();
    futureJourneys = fetchJourneys();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureBuilder<List<Journey>>(
          future: futureJourneys,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return Padding(
                padding: const EdgeInsets.all(8),
                child: Scrollbar(
                  child: PaginatedDataTable2(
                    rowsPerPage: 100,
                    headingRowHeight: 40,
                    source: JourneyData(snapshot.data!),
                    showFirstLastButtons: true,
                    scrollController: ScrollController(initialScrollOffset: 0),
                    columnSpacing: 5,
                    horizontalMargin: 8,
                    minWidth: MediaQuery.of(context).size.width - 30,
                    columns: const [
                      DataColumn2(
                        label: CustomTextBlack(
                          'Departure',
                          fontWeight: FontWeight.w600,
                        ),
                        size: ColumnSize.M,
                      ),
                      DataColumn2(
                        size: ColumnSize.M,
                        label: CustomTextBlack(
                          'Return',
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      DataColumn2(
                        size: ColumnSize.S,
                        label: CustomTextBlack(
                          'Dist(km)',
                          fontWeight: FontWeight.w600,
                        ),
                        numeric: true,
                      ),
                      DataColumn2(
                        size: ColumnSize.S,
                        label: CustomTextBlack(
                          'Dur(m)',
                          fontWeight: FontWeight.w600,
                        ),
                        numeric: true,
                      ),
                    ],
                  ),
                ),
              );
            } else if (snapshot.hasError) {
              return CustomTextBlack('${snapshot.error}');
            }
            return const CircularProgressIndicator();
          }),
    );
  }
}

class JourneyData extends DataTableSource {
  final List<Journey> data;

  JourneyData(this.data);
  @override
  DataRow? getRow(int index) {
    return DataRow(cells: [
      DataCell(CustomTextBlack(data[index].departureStation)),
      DataCell(CustomTextBlack(data[index].returnStation)),
      DataCell(
          CustomTextBlack((data[index].distance / 1000).toStringAsFixed(2))),
      DataCell(CustomTextBlack((data[index].duration / 60).toStringAsFixed(0))),
    ]);
  }

  @override
  bool get isRowCountApproximate => false;

  @override
  int get rowCount => data.length;

  @override
  int get selectedRowCount => 0;
}
