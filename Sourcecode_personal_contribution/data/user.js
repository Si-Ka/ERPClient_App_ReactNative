import {AsyncStorage} from 'react-native';

import {Alert} from 'react-native';
import BasicStuff from './basicStuff';

const extractor = BasicStuff.extractor;

class Filter {
  constructor(eroef, inBear, erled, angeb, versch, gewonn, verlor ) {
    this.eroef  = eroef;
    this.inBear = inBear;
    this.erled  = erled;
    this.angeb  = angeb;
    this.versch = versch;
    this.gewonn = gewonn;
    this.verlor = verlor;
  };
};

class User {
  constructor() {
    this.authStat = false;
    this.logStat  = false;
    this.sesID    = '';
    this.benutz   = '';
    this.pass     = '';
    this.userID   = '';
    this.mANr     = '';
    this.mAKlar   = '';
    this.filter   = new Filter  (false, false, true, false, false, true, true);      
  };

  saveDataToStorage = () => {
    console.log('storage');
    AsyncStorage.setItem(
      'userData', 
      JSON.stringify({
        benutz  : this.benutz,
        pass    : this.pass,
        filter  : this.filter
      })
    );     
  };

  getSesID = (enteredName, enteredPass, navi, settings, i) => {  
    
    let sr = 
    '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:IntegraSessionManager">' +
      '<soapenv:Header/>' +
      '<soapenv:Body>' +
        '<urn:RequestLogin soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
          '<User xsi:type="xsd:string">' + enteredName + '</User>' +
          '<Password xsi:type="xsd:string">' + enteredPass + '</Password>' +
          '<Mandant xsi:type="xsd:int">' + settings.mandant + '</Mandant>' +
          '<BetrSt xsi:type="xsd:int">' + settings.betrSt + '</BetrSt>' +
        '</urn:RequestLogin>' +
      '</soapenv:Body>' +
    '</soapenv:Envelope>';

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout = 45000;
    xmlhttp.open('POST', settings.urlGetSessID , true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
    xmlhttp.onreadystatechange = (() =>{
      console.log('--------------------');
      console.log('readystate:', xmlhttp.readyState);
      if (xmlhttp.readyState == 4 && i < 5 ) {
        if (!xmlhttp) {
          i++;
          console.log('XML error');
          this.getSesID(enteredName, enteredPass, navi, settings, i); 
        } else if (extractor('<DebugInfo xsi:type="xsd:string">', `,UID=${enteredName}</DebugInfo>`, xmlhttp._response) === 'ProcessID=0') {
          console.log('Anmeldedaten Falsch');
          Alert.alert('Daten Falsch', 'PW oder Username falsch', [{text: 'Okay', style: 'destructive'}]);
        } else if (xmlhttp._response.indexOf('<SessionID xsi:type="xsd:string">') !== -1) {
          console.log(extractor('<DebugInfo xsi:type="xsd:string">', `,UID=${enteredName}</DebugInfo>`, xmlhttp._response));
          this.sesID = extractor('<SessionID xsi:type=\"xsd:string\">', '</SessionID>', xmlhttp._response);
          console.log('Auth erfolgreich');
          this.authStat = true;
          this.benutz   = enteredName;
          this.pass     = enteredPass;
          this.getUserID(navi, settings, 0);
        } else if (i < 5) {
          i++;
          console.log('Nummer Anfrage:', i);
          this.getSesID(enteredName, enteredPass, navi, settings, i);            
        } else {
          console.log('--------------------');
          console.log('Auth: unbekannter Fehler');
          console.log('--------------------');
          console.log(xmlhttp);          
        }; 
      };
    });          
  };

  getUserID = (navi, settings, i) => {
    if (this.authStat === true) {      
      let sr = 
        `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:IntegraMAEC">
          <soapenv:Header/>
          <soapenv:Body>
            <urn:LoginMitarbeiter soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                <Token xsi:type="urn:AuthToken" xmlns:urn="urn:Integra">
                  <SessionID xsi:type="xsd:string">${this.sesID}</SessionID>
                </Token>
                <BenutzerId xsi:type="xsd:string">${this.benutz}</BenutzerId>
                <Password xsi:type="xsd:string">${this.pass}</Password>
            </urn:LoginMitarbeiter>
          </soapenv:Body>
        </soapenv:Envelope>`;      

      let xmlhttp = new XMLHttpRequest();
      xmlhttp.timeout = 45000;
      xmlhttp.open('POST', settings.urlGetUserID , true);
      xmlhttp.setRequestHeader('Content-Type', 'text/xml');
      xmlhttp.send(sr);
      xmlhttp.onreadystatechange = (() =>{
        console.log('--------------------');
        console.log('readystate:', xmlhttp.readyState);
        if (xmlhttp.readyState == 4 && i < 5 ) {
          if (!xmlhttp) {
            i++;
            console.log('XML error');
            this.getUserID(navi, settings, i);
          } else if (extractor('<Success xsi:type="xsd:boolean">', '</Success>', xmlhttp._response) === 'false') {
            console.log('Anmeldedaten Falsch');
            Alert.alert('Daten Falsch', 'PW oder Username falsch', [{text: 'Okay', style: 'destructive'}]);
          } else if (extractor('<Success xsi:type="xsd:boolean">', '</Success>', xmlhttp._response) === 'true') {
            console.log('Login Erfolgreich');
            console.log(this.sesID);
            this.userID = extractor('<UserId xsi:type="xsd:string">', '</UserId>', xmlhttp._response);
            this.mANr   = extractor('<MaNr xsi:type="xsd:string">', '</MaNr>', xmlhttp._response);
            this.mAKlar = extractor('<MaName xsi:type="xsd:string">', '</MaName>', xmlhttp._response);
            this.logStat  = true;
            this.saveDataToStorage();           
            navi([1, true, ]);
          } else if (i < 5) {
            i++;
            console.log('Nummer Anfrage:', i);
            this.getUserID(navi, settings, i);            
          } else {
            console.log('--------------------');
            console.log('Login: unbekannter Fehler');
            console.log('--------------------');
            console.log(xmlhttp);          
          };
        };  
      });
    }; 
  };
};

export default User;
