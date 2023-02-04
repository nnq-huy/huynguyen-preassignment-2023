//custome text with google lato font and easier way of changing size,color,weight
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomTextWhite extends StatelessWidget {
  final String data;
  final Color? textColor;
  final double? fontSize;
  final FontWeight? fontWeight;
  final String? fontFamily;

  const CustomTextWhite(
    this.data, {
    this.textColor,
    this.fontSize,
    this.fontWeight,
    this.fontFamily,
  });

  @override
  Widget build(BuildContext context) {
    return Text(data,
        style: GoogleFonts.montserrat(
          color: textColor ?? Colors.white,
          fontSize: fontSize ?? 12,
          fontWeight: fontWeight ?? FontWeight.normal,
        ));
  }
}

class CustomTextBlack extends StatelessWidget {
  final String data;
  final Color? textColor;
  final double? fontSize;
  final FontWeight? fontWeight;
  final String? fontFamily;

  const CustomTextBlack(
    this.data, {
    this.textColor,
    this.fontSize,
    this.fontWeight,
    this.fontFamily,
  });

  @override
  Widget build(BuildContext context) {
    return Text(data,
        style: GoogleFonts.montserrat(
          color: textColor ?? Colors.black,
          fontSize: fontSize ?? 12,
          fontWeight: fontWeight ?? FontWeight.normal,
        ));
  }
}
