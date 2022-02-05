/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

#include <LiquidCrystal_I2C.h>
#include <Adafruit_MAX31865.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266TrueRandom.h>
#include <SoftwareSerial.h>
SoftwareSerial s(D6,D5);
#define SERVER_IP "192.168.0.102:3000"
#define STASSID "BASE4TECH"
#define STAPSK  "470525pA"
#define RREF      430.0
// 100.0 for PT100, 1000.0 for PT1000
#define RNOMINAL  100.0

int recursive(int);
int lcdColumns = 16;
int lcdRows = 2;
void my_lcd(int);

LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

// Use software SPI:         CS, DI, DO, CLK
//NodeMCU pins connected to: D0, D1, D2, D3
//NodeMCU pins connected to: D0, D5, D6, D3

//Adafruit_MAX31865 max1 = Adafruit_MAX31865(16, 5, 4, 0);
Adafruit_MAX31865 max1 = Adafruit_MAX31865(16, 14, 12, 0);

//Adafruit_MAX31865 max1 = Adafruit_MAX31865(14, 12, 13, 15);
byte uuidNumber[16];
int data;
int finalData = 0;

String uuidStr2;

int value=1;

char jsonOutput[1024];


void setup() {
  s.begin(9600);
  Serial.begin(9600);
  
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println("Adafruit MAX31865 PT100 Sensor Test!");
  max1.begin(MAX31865_3WIRE);  // set to 2WIRE or 4WIRE as necessary

   ESP8266TrueRandom.uuid(uuidNumber);
  String uuidStr = ESP8266TrueRandom.uuidToString(uuidNumber);
  uuidStr2 = uuidStr;
  Serial.println("The UUID number is " + uuidStr2);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(2, 0);
  lcd.print("Temperature");

  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

}

void loop() {

   int rtdValue = RTD();

   my_lcd(rtdValue);


   if ((WiFi.status() == WL_CONNECTED)) {

    Serial.print("RTDRDTDRTDTTD\n"+String(rtdValue));

    

    WiFiClient client;
    HTTPClient http;

    const size_t CAPACITY = JSON_OBJECT_SIZE(12);
    StaticJsonDocument<CAPACITY> doc;

    JsonObject object = doc.to<JsonObject>();


    String f = uuidStr2;
    
    object["woodId"]= f ;
    object["temp"]= rtdValue;

    serializeJson(doc,jsonOutput);

    Serial.print("[HTTP] begin...\n");
    // configure traged server and url
    http.begin(client, "http://" SERVER_IP "/temp"); //HTTP
    http.addHeader("Content-Type", "application/json");

    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
      z:
    int httpCode = http.POST(String(jsonOutput));
           delay(1500);

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println("\nreceived payload:"+String(httpCode));
        Serial.println(payload);
        Serial.println(">>");
      }
    } else {
      
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      goto z;
    }

    http.end();
  }



recursive(value);
}

int recursive(int value){
  if(value<=10){
    delay(60000);
       value++;
       Serial.println(value);

      recursive(value);
    }
    else{
      value=1;
      return 0;
      }
  
  }



float RTD(){
  uint16_t rtd = max1.readRTD();

  float ratio = rtd;
  ratio /= 32768;
  
  float rtdvalue = max1.temperature(100, RREF);
  Serial.println(rtdvalue);

  return rtdvalue;
}



void my_lcd(int data){
   lcd.setCursor(2, 0);
   lcd.print("Temperature");
   lcd.setCursor(6, 1);
   lcd.print(data);
   lcd.setCursor(9, 1);
   lcd.print((char)223);
   lcd.setCursor(10, 1);
   lcd.print('C');
   
}
