//screen to access data entry/importing functions
import 'package:citybike/components/custom_texts.dart';
import 'package:citybike/components/new_station_form.dart';
import 'package:citybike/helpers/api_get.dart';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  var isFileUploaded = false;
  String _selectedUploadType = 'stations';
  var uploadTypes = ['stations', 'journeys'];
  String _fileName = 'no file';
  List<PlatformFile>? _paths;

  @override
  void initState() {
    super.initState();
  }

  void _pickFiles(String fileType) async {
    _resetState();
    try {
      _paths = (await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowMultiple: false,
        allowedExtensions: ['csv'],
      ))!
          .files;
    } on PlatformException catch (e) {
      _logException('Unsupported operation$e');
    } catch (e) {
      _logException(e.toString());
    }
    if (!mounted) return;

    _fileName = _paths?.first.name ?? 'no file';
    String filePath = _paths?.first.path ?? '';

    try {
      await uploadFile(fileType, filePath);
      setState(() {
        isFileUploaded = true;
      });
    } catch (e) {
      _logException(e.toString());
    }
  }

  void _logException(String message) {
    Fluttertoast.showToast(msg: message);
  }

  void _resetState() {
    if (!mounted) {
      return;
    }
    setState(() {
      _paths = null;
      _fileName = 'no file';
      isFileUploaded = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: SingleChildScrollView(
        child: Column(
          children: [
            const TabBar(
                indicatorSize: TabBarIndicatorSize.label,
                indicatorWeight: 5,
                indicatorColor: Colors.deepPurple,
                tabs: [
                  Tab(
                      child: CustomTextBlack(
                    'csv upload',
                    fontWeight: FontWeight.bold,
                  )),
                  Tab(
                      child: CustomTextBlack('single entry',
                          fontWeight: FontWeight.bold))
                ]),
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.7,
              child: TabBarView(children: [
                Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Card(
                    elevation: 10,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Padding(
                          padding: EdgeInsets.fromLTRB(12, 12, 12, 0),
                          child: CustomTextBlack(
                              'select type of csv file to upload'),
                        ),
                        DropdownButton(
                          value: _selectedUploadType,
                          icon: const Icon(Icons.keyboard_arrow_down),
                          items: uploadTypes.map((String item) {
                            return DropdownMenuItem(
                              value: item,
                              child: CustomTextBlack(item),
                            );
                          }).toList(),
                          onChanged: (String? newValue) {
                            setState(() {
                              _selectedUploadType = newValue!;
                            });
                          },
                        ),
                        TextButton.icon(
                            onPressed: () => _pickFiles(_selectedUploadType),
                            icon: const Icon(Icons.file_upload),
                            label: const CustomTextBlack(
                              'select file',
                              textColor: Colors.deepPurple,
                            )),
                        CustomTextBlack(' $_fileName uploaded'),
                        ElevatedButton(
                          onPressed: !isFileUploaded
                              ? null
                              : () {
                                  parseCsv(_selectedUploadType);
                                },
                          child: const CustomTextWhite(
                            'import to db',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const Padding(
                    padding: EdgeInsets.all(20),
                    child: Card(child: NewStationForm()))
              ]),
            )
          ],
        ),
      ),
    );
  }
}
