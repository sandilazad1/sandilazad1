#include<SoftwareSerial.h>
SoftwareSerial abc(13,15);
int data = 50;
void setup()
{
  abc.begin(115200);
}

void loop()
{
  abc.write(data);
  delay(1000);
 


  
}
