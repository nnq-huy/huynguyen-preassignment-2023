//template for carousel item
import 'package:flutter/material.dart';
import 'custom_texts.dart';

class CarouselItem extends StatelessWidget {
  const CarouselItem(
      {super.key,
      required this.title,
      required this.item1,
      required this.item1Value,
      required this.item2,
      required this.item2Value,
      required this.item3,
      required this.item3Value,
      required this.item4,
      required this.item4Value,
      required this.item5,
      required this.item5Value});
  final String title,
      item1,
      item1Value,
      item2,
      item2Value,
      item3,
      item3Value,
      item4,
      item4Value,
      item5,
      item5Value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: MediaQuery.of(context).size.width * 0.7,
      child: Material(
        elevation: 10,
        borderRadius: BorderRadius.circular(20),
        color: Colors.deepPurple,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              CustomTextWhite(
                title,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
              const Divider(
                height: 10,
                color: Colors.white,
                thickness: 1,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [CustomTextWhite(item1), CustomTextWhite(item1Value)],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [CustomTextWhite(item2), CustomTextWhite(item2Value)],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [CustomTextWhite(item3), CustomTextWhite(item3Value)],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [CustomTextWhite(item4), CustomTextWhite(item4Value)],
              ),
              item5 != ' '
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        CustomTextWhite(item5),
                        CustomTextWhite(item5Value)
                      ],
                    )
                  : Container(),
            ],
          ),
        ),
      ),
    );
  }
}
