import 'package:citybike/components/custom_texts.dart';
import 'package:citybike/helpers/api_get.dart';
import 'package:citybike/models/station.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:fluttertoast/fluttertoast.dart';

class NewStationForm extends StatefulWidget {
  const NewStationForm({super.key});

  @override
  State<NewStationForm> createState() => _NewStationFormState();
}

class _NewStationFormState extends State<NewStationForm> {
  final _formKey = GlobalKey<FormBuilderState>();
  var _formType = 'Station';
  var station = Station(0, '', '', 0, 0);
  var typeOptions = ['Station', 'Journey'];

  void submitStation() async {
    final res = await newStation(station);
    if (res == '201') {
      Fluttertoast.showToast(msg: 'Station created!');
    } else {
      Fluttertoast.showToast(msg: 'Station is not created!');
    }
  }

  void submitJourney() async {
    final res = await newStation(station);
    if (res == '201') {
      Fluttertoast.showToast(msg: 'Station created!');
    } else {
      Fluttertoast.showToast(msg: 'Station is not created!');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Column(
          children: [
            CustomTextBlack(
              'New $_formType',
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
            const CustomTextBlack('choose the type of a new entry :'),
            FormBuilder(
                key: _formKey,
                onChanged: () {
                  _formKey.currentState?.save();
                },
                child: Column(
                  children: [
                    FormBuilderDropdown(
                        initialValue: _formType,
                        name: 'type',
                        onChanged: (e) {
                          setState(() {
                            _formType = e!;
                          });
                        },
                        items: typeOptions
                            .map((e) => DropdownMenuItem(
                                value: e, child: CustomTextBlack(e)))
                            .toList()),
                    _formType == 'Station'
                        ? Column(
                            children: [
                              FormBuilderTextField(
                                autovalidateMode: AutovalidateMode.always,
                                onChanged: (value) {
                                  setState(() {
                                    station.id = int.parse(value!);
                                    _formKey.currentState?.fields['id']?.save();
                                  });
                                },
                                scrollPadding: EdgeInsets.only(
                                    bottom: MediaQuery.of(context)
                                            .viewInsets
                                            .bottom +
                                        400),
                                name: 'id',
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                    labelText: 'new station Id',
                                    labelStyle:
                                        GoogleFonts.montserrat(fontSize: 12)),
                                validator: FormBuilderValidators.compose([
                                  FormBuilderValidators.required(),
                                  FormBuilderValidators.numeric(),
                                ]),
                              ),
                              FormBuilderTextField(
                                autovalidateMode: AutovalidateMode.always,
                                onChanged: (value) {
                                  setState(() {
                                    station.name = value!;

                                    _formKey.currentState?.fields['name']
                                        ?.save();
                                  });
                                },
                                name: 'name',
                                keyboardType: TextInputType.text,
                                decoration: InputDecoration(
                                    labelText: 'new station name',
                                    labelStyle:
                                        GoogleFonts.montserrat(fontSize: 12)),
                                validator: FormBuilderValidators.compose([
                                  FormBuilderValidators.required(),
                                ]),
                              ),
                              FormBuilderTextField(
                                autovalidateMode: AutovalidateMode.always,
                                onChanged: (value) {
                                  setState(() {
                                    station.address = value!;
                                    _formKey.currentState?.fields['address']
                                        ?.save();
                                  });
                                },
                                name: 'address',
                                keyboardType: TextInputType.text,
                                decoration: InputDecoration(
                                    labelText: 'new station address',
                                    labelStyle:
                                        GoogleFonts.montserrat(fontSize: 12)),
                                validator: FormBuilderValidators.compose([
                                  FormBuilderValidators.required(),
                                ]),
                              ),
                              FormBuilderTextField(
                                autovalidateMode: AutovalidateMode.always,
                                onChanged: (value) {
                                  setState(() {
                                    station.y = double.parse(value!);
                                    _formKey.currentState?.fields['y']?.save();
                                  });
                                },
                                name: 'y',
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                    labelText: 'new station latitude',
                                    labelStyle:
                                        GoogleFonts.montserrat(fontSize: 12)),
                                validator: FormBuilderValidators.compose([
                                  FormBuilderValidators.required(),
                                  FormBuilderValidators.numeric(),
                                  FormBuilderValidators.max(69),
                                  FormBuilderValidators.min(59),
                                ]),
                              ),
                              FormBuilderTextField(
                                autovalidateMode: AutovalidateMode.always,
                                onChanged: (value) {
                                  setState(() {
                                    station.x = double.parse(value!);

                                    _formKey.currentState?.fields['x']?.save();
                                    _formKey.currentState?.saveAndValidate();
                                  });
                                },
                                name: 'x',
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                    labelText: 'new station longitude',
                                    labelStyle:
                                        GoogleFonts.montserrat(fontSize: 12)),
                                validator: FormBuilderValidators.compose([
                                  FormBuilderValidators.required(),
                                  FormBuilderValidators.numeric(),
                                  FormBuilderValidators.max(31),
                                  FormBuilderValidators.min(21),
                                ]),
                              ),
                            ],
                          )
                        : Container(),
                    Row(
                      children: [
                        Expanded(
                            child: ElevatedButton.icon(
                                onPressed: () {
                                  _formKey.currentState?.reset();
                                },
                                icon: const Icon(Icons.refresh),
                                label: const CustomTextWhite('reset'))),
                        const SizedBox(width: 20),
                        Expanded(
                            child: ElevatedButton.icon(
                                onPressed:
                                    (_formKey.currentState?.isValid) ?? false
                                        ? () {
                                            _formType == 'Station'
                                                ? submitStation()
                                                : submitJourney();
                                            //_formKey.currentState?.reset();
                                          }
                                        : null,
                                icon: const Icon(Icons.send),
                                label: const CustomTextWhite('submit'))),
                      ],
                    ),
                  ],
                )),
          ],
        ),
      ),
    );
  }
}
