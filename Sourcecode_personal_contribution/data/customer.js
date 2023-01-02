import {Alert} from 'react-native';
import BasicStuff from './basicStuff';

const extractor   = BasicStuff.extractor;
const valBuilder  = BasicStuff.valBuilder;

class Customer {
  constructor(kundeNr, name1, name2, name3, serName, lkz, plz, ort, strasse ) {
    this.kundeNr  = kundeNr ;
    this.name1    = name1;
    this.name2    = name2;
    this.name3    = name3;
    this.serName  = serName;
    this.lkz      = lkz;
    this.plz      = plz;
    this.ort      = ort;
    this.strasse  = strasse;
  };

  static customerHandler = (user, serVal, settings, custList, i) => {

    if (user.authStat === true && user.logStat === true) {
      console.log('--------------------');
      console.log('beantrage Kunden'); 
      let sr = 
      `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:IntegraMAEC">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:FindKunde soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                <Token xsi:type="urn:AuthToken" xmlns:urn="urn:Integra">
                  <SessionID xsi:type="xsd:string">${user.sesID}</SessionID>
                </Token>
                <SearchValue xsi:type="xsd:string">${serVal}</SearchValue>
            </urn:FindKunde>
          </soapenv:Body>
      </soapenv:Envelope>`;
  
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.timeout = 45000;
      xmlhttp.open('POST', settings.urlGetCust , true);
      xmlhttp.setRequestHeader('Content-Type', 'text/xml');
      xmlhttp.send(sr);
      xmlhttp.onreadystatechange = (() =>{
        console.log('--------------------');
        console.log('readystate:', xmlhttp.readyState);
        if (xmlhttp.readyState == 4) {
          console.log('---+++++---------------------------+++++---');
          console.log('on Load');
          console.log(xmlhttp.status);
          if (!xmlhttp) {
            console.log('XML error');
            Alert.alert(
              'unbekannter Fehler', 
              'Irgendwas stimmt nicht', 
              [{text: 'Okay', style: 'destructive'}]
            );
            settings.loadProc = true;
          } else if ( xmlhttp.status !== 200) {
            console.log('Status nicht 200');
            console.log('Status;',xmlhttp.status);
            settings.loadProc = true;
          } else if (extractor('<Success xsi:type="xsd:boolean">', '</Success>', xmlhttp._response) === 'true') {
            settings.loadCust = true;
            let buffList  = [];
            let rawData   = extractor(']"><item xsi:type="NS2:KundeData">', '</item></KundeData>', xmlhttp._response);
            console.log('--------------------');
            buffList = rawData.split('</item><item xsi:type="NS2:KundeData">');
            console.log(buffList.length);

            for (let i = 0; i < buffList.length; i++) {
              custList.push(new Customer(
                valBuilder('KundeNr', 'string', buffList[i]),
                valBuilder('Name1', 'string', buffList[i]),
                valBuilder('Name2', 'string', buffList[i]),
                valBuilder('Name3', 'string', buffList[i]),
                valBuilder('Suchname', 'string', buffList[i]),
                valBuilder('Lkz', 'string', buffList[i]),
                valBuilder('Plz', 'string', buffList[i]),
                valBuilder('Ort', 'string', buffList[i]),
                valBuilder('Strasse', 'string', buffList[i]),          
              ));
              console.log('--------------------');
              console.log(custList[i]);
            };           
          } else if (i < 5) {
            console.log('Nummer Anfrage:', i);        
            i++;
            this.customerHandler(user, serVal, settings, custList, i);
          } else {
            console.log('--------------------');
            console.log('Customer: unbekannter Fehler');
            console.log('--------------------');
            console.log(xmlhttp);
          };          
        }
      });      
    };
  };
};


export default Customer;
