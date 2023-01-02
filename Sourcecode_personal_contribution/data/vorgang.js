import BasicStuff from './basicStuff';
import { apisAreAvailable } from 'expo';

const extractor   = BasicStuff.extractor;
const valBuilder  = BasicStuff.valBuilder;

class Vorgang {
  constructor(vorgID, kndID, mANr, mAKlar, bez, erKont, entBis, budget, prior, priKl, quote, status, statKl, bem, vTyp, vTypKl, stAeDt, anzDet ) {
    this.vorgID   = vorgID;
    this.kndID    = kndID
    this.mANr     = mANr
    this.mAKlar   = mAKlar;    
    this.bez      = bez;
    this.erKont   = erKont;
    this.entBis   = entBis,
    this.budget   = budget
    this.prior    = prior;
    this.priKl    = priKl;
    this.quote    = quote;
    this.status   = status;
    this.statKl   = statKl;
    this.bem      = bem;
    this.vTyp     = vTyp;
    this.vTypKl   = vTypKl;
    this.stAeDt   = stAeDt;
    this.anzDet   = anzDet;
    this.refresh  = false;
  };

  static getProcess = (sesID, kundeNr, settings, procList, i) => {
    console.log('--------------------');
    console.log('beantrage Vorgänge'); 
    let sr = 
      `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:IntegraMAEC">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:GetKundenAktivitaetenKopf soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <Token xsi:type="urn:AuthToken" xmlns:urn="urn:Integra">
              <SessionID xsi:type="xsd:string">${sesID}</SessionID>
            </Token>
            <NrKd xsi:type="xsd:string">${kundeNr}</NrKd>
          </urn:GetKundenAktivitaetenKopf>
        </soapenv:Body>
      </soapenv:Envelope>`;
  
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout = 45000;
    xmlhttp.open('POST', settings.urlGetVorg , true);
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
          setTimeout(() => {settings.loadProc = true}, 200);
        } else if ( xmlhttp.status !== 200) {
          console.log('Status nicht 200');
          console.log('Status;',xmlhttp.status);
          setTimeout(() => {settings.loadProc = true}, 200);
        } else if (xmlhttp._response.indexOf('SOAP-ENC:arrayType="NS2:KndAktivitaeten[0]"/>') !== -1) { //'<return xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="NS2:KndAktivitaeten[0]"/>'
          console.log('--------------------');
          console.log('Keine Vorgänge')
          setTimeout(() => {settings.loadProc = true}, 200);
        } else if (xmlhttp._response.indexOf('<item xsi:type="NS2:KndAktivitaeten">') !== -1) {  
          console.log(xmlhttp);        
          let buffList  = [];
          let rawData   = extractor(']"><item xsi:type="NS2:KndAktivitaeten">', '</item></return>', xmlhttp._response);
          console.log('--------------------');
          buffList = rawData.split('</item><item xsi:type="NS2:KndAktivitaeten">');
          console.log(buffList.length);
          settings.loadProc = true;

          for (let i = 0; i < buffList.length; i++) {
            procList.push(new Vorgang(            
              valBuilder('VorgangNr', 'int', buffList[i]),
              valBuilder('NrKD', 'string', buffList[i]),
              valBuilder('NrMA', 'string', buffList[i]),
              valBuilder('NrMaKlartext', 'string', buffList[i]),
              valBuilder('Bez', 'string', buffList[i]),
              valBuilder('Erstkontakt', 'dateTime', buffList[i]),
              valBuilder('EntscheidungBis', 'dateTime', buffList[i]),
              valBuilder('Budget', 'int', buffList[i]),
              valBuilder('ABCKlasse', 'string', buffList[i]),
              valBuilder('ABCKLasseKlartext', 'string', buffList[i]),
              valBuilder('Quote', 'double', buffList[i]),
              valBuilder('Status', 'string', buffList[i]),
              valBuilder('StatusKlartext', 'string', buffList[i]),
              valBuilder('Bemerkung', 'string', buffList[i]),
              valBuilder('VorgangstypCrm', 'short', buffList[i]),
              valBuilder('VorgTypKlartext', 'string', buffList[i]),
              valBuilder('StatusAendDat', 'dateTime', buffList[i]),
              valBuilder('AnzDetails', 'int', buffList[i]),
            ));
            console.log('--------------------');
            console.log(procList[i]);            
          };                  
        } else if (i < 5) {
          console.log('Nummer Anfrage:', i);        
          i++;
          this.getProcess(sesID, kundeNr, settings, procList, i);
        } else {
          console.log('--------------------');
          console.log('Vorgänge: unbekannter Fehler');
          console.log('--------------------');
          console.log(xmlhttp);
          settings.loadProc = true;
        };
      };
    });
  };

  static setProcess = (user, settings, procList, index, obj, i) => {
    console.log('Vorgang aendern');
    let vorgID  = '';

    if (index !== true) vorgID = `<VorgangNr xsi:type="xsd:int">${obj.vorgID}</VorgangNr>`;
    else vorgID = '';

    let sr = 
      `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:IntegraMAEC">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:SetKundenAktivitaetenKopf soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <Token xsi:type="urn:AuthToken" xmlns:urn="urn:Integra">
              <SessionID xsi:type="xsd:string">${user.sesID}</SessionID>
              <UserId xsi:type="xsd:string">${user.userID}</UserId>
            </Token>
            <Aktivitaet xsi:type="urn:KndAktivitaeten" xmlns:urn="urn:Integra">
              ${vorgID}
              <NrKD xsi:type="xsd:string">${obj.kndID}</NrKD>
              <NrMA xsi:type="xsd:string">${obj.mANr}</NrMA>
              <Bez xsi:type="xsd:string">${obj.bez}</Bez>
              <ABCKlasse xsi:type="xsd:string">${obj.prior}</ABCKlasse>
              <Status xsi:type="xsd:string">${obj.status}</Status>
              <Bemerkung xsi:type="xsd:string">${obj.bem}</Bemerkung>
              <VorgangstypCrm xsi:type="xsd:short">${obj.vTyp}</VorgangstypCrm>
            </Aktivitaet>
          </urn:SetKundenAktivitaetenKopf>
        </soapenv:Body>
      </soapenv:Envelope>`;

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout = 45000;
    xmlhttp.open('POST', settings.urlSetVorg , true);
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
          settings.loadProc = true;
        } else if ( xmlhttp.status !== 200) {
          console.log('Status nicht 200');
          console.log('Status;',xmlhttp.status);
          settings.loadProc = true;        
        } else if (xmlhttp._response.indexOf('<Success xsi:type="xsd:boolean">true</Success>') !== -1) {  
          if (index === true) {
            let rawData   = extractor('<Aktivitaet xsi:type="NS2:KndAktivitaeten">', '</Aktivitaet>', xmlhttp._response);
            procList.push(new Vorgang(            
              valBuilder('VorgangNr', 'int', rawData),
              valBuilder('NrKD', 'string', rawData),
              valBuilder('NrMA', 'string', rawData),
              valBuilder('NrMaKlartext', 'string', rawData),
              valBuilder('Bez', 'string', rawData),
              valBuilder('Erstkontakt', 'dateTime', rawData),
              valBuilder('EntscheidungBis', 'dateTime', rawData),
              valBuilder('Budget', 'int', rawData),
              valBuilder('ABCKlasse', 'string', rawData),
              valBuilder('ABCKLasseKlartext', 'string', rawData),
              valBuilder('Quote', 'double', rawData),
              valBuilder('Status', 'string', rawData),
              valBuilder('StatusKlartext', 'string', rawData),
              valBuilder('Bemerkung', 'string', rawData),
              valBuilder('VorgangstypCrm', 'short', rawData),
              valBuilder('VorgTypKlartext', 'string', rawData),
              valBuilder('StatusAendDat', 'dateTime', rawData),
              valBuilder('AnzDetails', 'int', rawData),
            ));
          };           
          //console.log(xmlhttp._response);
          settings.loadProc = true;              
        } else if (i < 5) {
          console.log('Nummer Anfrage:', i);        
          i++;
          this.setProcess(user, settings, procList, index, obj, i)
        } else {
          console.log('--------------------');
          console.log('Vorgänge: unbekannter Fehler');
          console.log('--------------------');
          console.log(xmlhttp);
          settings.loadProc = true;
        };
      };
    });      

    let ret = 
      `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
        <SOAP-ENV:Body SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:NS1="urn:IntegraMAEC" xmlns:NS2="urn:Integra">
          <NS1:SetKundenAktivitaetenKopfResponse>
              <return xsi:type="NS2:KndAktivitaetenResult">
                <Success xsi:type="xsd:boolean">true</Success>
                <LogMessage xsi:type="xsd:string"/>
                <Aktivitaet xsi:type="NS2:KndAktivitaeten">
                    <VorgangNr xsi:type="xsd:int">17167</VorgangNr>
                    <NrKD xsi:type="xsd:string">12630</NrKD>
                    <NrMA xsi:type="xsd:string"/>
                    <NrMaKlartext xsi:type="xsd:string"/>
                    <Bez xsi:type="xsd:string"/>
                    <Erstkontakt xsi:type="xsd:dateTime">2019-11-26T15:44:25.597+01:00</Erstkontakt>
                    <EntscheidungBis xsi:nil="true"/>
                    <Budget xsi:type="xsd:int">0</Budget>
                    <ABCKlasse xsi:type="xsd:string">2</ABCKlasse>
                    <ABCKLasseKlartext xsi:type="xsd:string">mittel</ABCKLasseKlartext>
                    <Quote xsi:type="xsd:double">0</Quote>
                    <Status xsi:type="xsd:string">0</Status>
                    <StatusKlartext xsi:type="xsd:string">eröffnet</StatusKlartext>
                    <Bemerkung xsi:type="xsd:string"/>
                    <VorgangstypCrm xsi:type="xsd:short">10</VorgangstypCrm>
                    <VorgTypKlartext xsi:type="xsd:string">Lead nicht qualifiziert</VorgTypKlartext>
                    <StatusAendDat xsi:type="xsd:dateTime">2019-11-26T00:00:00.000+01:00</StatusAendDat>
                    <AnzDetails xsi:type="xsd:int">0</AnzDetails>
                </Aktivitaet>
              </return>
          </NS1:SetKundenAktivitaetenKopfResponse>
        </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;
  };

  static deleteProcess = () => {
    let ret = 
    `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
      <SOAP-ENV:Body SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:NS1="urn:IntegraMAEC">
        <NS1:DelKundenAktivitaetKopfResponse>
            <return xsi:type="xsd:boolean">true</return>
        </NS1:DelKundenAktivitaetKopfResponse>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;
  };

  static newBlankoProcess = (user, kndID) => {
    console.log('editieren process');
    return new Vorgang(
      '', 
      kndID, 
      user.mANr, 
      user.mAKlar, 
      '', 
      '', 
      '', 
      '', 
      '4', 
      'unbekannt',
      '', 
      '0', 
      'eröffnet', 
      '', 
      '', 
      '', 
      '',
      '',
    );
  };
};



export default Vorgang;