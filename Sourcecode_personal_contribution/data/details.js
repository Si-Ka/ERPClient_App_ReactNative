import BasicStuff from './basicStuff';

const extractor   = BasicStuff.extractor;
const valBuilder  = BasicStuff.valBuilder;

class Details {
  constructor(vorgID, lfdNr, vArt, vArtKl, datum, mANr, mAKlar, bem, bel, pflicht, pflKlar, status, statKl, stAeDt ) {
    this.vorgID   = vorgID;
    this.lfdNr    = lfdNr;
    this.vArt     = vArt;
    this.vArtKl   = vArtKl;
    this.datum    = datum;
    this.mANr     = mANr;
    this.mAKlar   = mAKlar;
    this.bem      = bem;
    this.beleg    = bel;
    this.pflicht  = pflicht;
    this.pflKlar  = pflKlar;
    this.status   = status;
    this.statKl   = statKl;
    this.stAeDt   = stAeDt;
    this.refresh  = false;
  };

  static newblanckoDetail = (user, vorgID ) => {
    console.log('erstellen detail');
    return new Details(
      vorgID, 
      0, 
      '', 
      '', 
      'Heute', 
      user.mANr, 
      user.mAKlar, 
      '', 
      '', 
      '', 
      '', 
      '0', 
      '', 
      false 
    );
  };

  static deleteDetail = (ident, vorgID, lfdNr) => {
    console.log('delete detail');
    return true;
  };

  static sendDetails = (ident, oby) => {
    console.log('senden detail');
    return true;
  };

// Function die Details aus dem Netzwerk hohlt ################################################################################

  static getDetails = (sesID, vorgID, settings, detList, i) =>{
    console.log('--------------------');
    console.log('beantrage Details'); 
    let sr = 
      `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:IntegraMAEC">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:GetKundenAktivitaetenDetails soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <Token xsi:type="urn:AuthToken" xmlns:urn="urn:Integra">
               <SessionID xsi:type="xsd:string">${sesID}</SessionID>
            </Token>
            <VorgangNr xsi:type="xsd:int">${vorgID}</VorgangNr>
         </urn:GetKundenAktivitaetenDetails>
      </soapenv:Body>
   </soapenv:Envelope>`;
  
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout = 45000;
    xmlhttp.open('POST', settings.urlGetDet , true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
    xmlhttp.onreadystatechange = (() =>{
      console.log('--------------------');
      console.log('readystate:', xmlhttp.readyState);

      if (xmlhttp.readyState == 4) {
        console.log('---+++++---------------------------+++++---');
        console.log('on Load');
        if (!xmlhttp) {
          console.log('XML error');
          settings.loadDet = true;
        } else if ( xmlhttp.status !== 200) {
          console.log('Status nicht 200');
          console.log('Status;',xmlhttp.status);
          settings.loadProc = true;
        } else if (xmlhttp._response.indexOf('SOAP-ENC:arrayType="NS2:KndAktivitaetenDetails[0]">') !== -1) { 
          console.log('--------------------');
          console.log('Keine Details')
          settings.loadDet = true;
        } else if (xmlhttp._response.indexOf('<item xsi:type="NS2:KndAktivitaetenDetails">') !== -1) {          
          let buffList  = [];
          let rawData   = extractor(']"><item xsi:type="NS2:KndAktivitaetenDetails">', '</item></return>', xmlhttp._response);
          console.log('--------------------');
          buffList = rawData.split('</item><item xsi:type="NS2:KndAktivitaetenDetails">');
          console.log(buffList.length);
          settings.loadDet = true;

          for (let i = 0; i < buffList.length; i++) { 
            detList.push(new Details(
              valBuilder('VorgangNr', 'int', buffList[i]),
              valBuilder('LfdNr', 'int', buffList[i]),
              valBuilder('VorgangArtCrm', 'short', buffList[i]),
              valBuilder('VorgArtCrmKlartext', 'string', buffList[i]),
              valBuilder('Datum', 'dateTime', buffList[i]),
              valBuilder('NrMa', 'string', buffList[i]),
              valBuilder('NrMaKlartext', 'string', buffList[i]),
              valBuilder('Bemerkung', 'string', buffList[i]),
              valBuilder('Belegdid', 'string', buffList[i]),
              valBuilder('Pflicht', 'string', buffList[i]),
              valBuilder('Status', 'string', buffList[i]),
              valBuilder('StatusAendDat', 'dateTime', buffList[i]),
            ));
            console.log('--------------------');
            console.log(detList[i]);            
          }; 
        } else if (i < 5) {
          console.log('Nummer Anfrage:', i);        
          i++;
          this.getDetails(sesID, vorgID, settings, detList, i);
        } else {
          console.log('--------------------');
          console.log('Details: unbekannter Fehler');
          console.log('--------------------');
          console.log(xmlhttp);
          settings.loadDet = true;
        };
      }
    });
  };
};

export default Details;