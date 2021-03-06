# PTVO-Zigbee-CC2530-PCF8583-counter
Battery impulse counter based on PTVO Zigbee firmware with CC2530 and PCF8583 acting as hardware counter

Components:
- [CC2530 Module](https://aliexpress.com/item/1005001992423340.html) (or [E18-TBL-01 Module](https://aliexpress.com/item/1005001473354195.html))
- [Photoresistor Module](https://aliexpress.com/item/32767875194.html)
- [PCF8583 Real Time Clock](https://aliexpress.com/item/32601793278.html)
- 1KΩ Resistor
- 100nF Capacitor
- 3V Battery (like CR2450, CR2032, etc or 2xAA/AAA)
- Prototype board and some wires

Example converter for energy meter with 6400 impulses per kWh. You can change that in lines:

```js
                    power = 1000 * (deltaCount / 6400) * (3600 / deltaTimeSec);
```
```js
                const energy = val / 6400;
```

![511hPwS1m2L _AC_SX569_](https://user-images.githubusercontent.com/20594810/115124794-7927f400-9fc4-11eb-982e-40af291f1ec3.jpg)

![cc2530_counter](https://user-images.githubusercontent.com/20594810/115124806-80e79880-9fc4-11eb-85b2-ef5c5289c8bb.png)

![Bez tytułu1](https://user-images.githubusercontent.com/20594810/115124815-8ba22d80-9fc4-11eb-8fde-ef58723664f1.png)

![Bez tytułu](https://user-images.githubusercontent.com/20594810/115124817-8e048780-9fc4-11eb-8ccd-f523b816f759.png)

![Zrzut ekranu 2021-04-17 212736](https://user-images.githubusercontent.com/20594810/115124828-a70d3880-9fc4-11eb-82f1-119445bb9f18.png)

![Zrzut ekranu 2021-04-17 212632](https://user-images.githubusercontent.com/20594810/115124832-ab395600-9fc4-11eb-9867-87b5670a3425.png)

![114076466-fce82f00-98a6-11eb-93a7-83f3eef7e40d](https://user-images.githubusercontent.com/20594810/115124836-aeccdd00-9fc4-11eb-8803-150cad9ebd1a.png)
