#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C address 0x27, 16 column and 2 rows
int state;
void setup()
{

  Serial.begin(115200);
  while (!Serial) {
  }
  lcd.init(); // initialize the lcd
  lcd.backlight();

  lcd.setCursor(0, 0);         // move cursor to   (0, 0)
  lcd.print("Arduino");        // print message at (0, 0)

}

void loop()
{
  if (Serial.available()) {
    state = Serial.read();
  }


  lcd.setCursor(2, 1);         // move cursor to   (2, 1)
  lcd.print(state); // print message at (2, 1)
  Serial.print(state);
}
