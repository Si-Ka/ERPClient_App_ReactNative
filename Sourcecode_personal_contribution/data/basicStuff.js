
class ListSeg {
  constructor(iD, o) {
    this.id = iD;
    this.cont = o;
  };
};

class BasicStuff {

  constructor() {
    this.userName     = 'WEBSERV';
    this.userPass     = 'OSWebOs19';
    this.mandant      = 1;
    this.betrSt       = 1;
    this.urlGetSessID = 'http://192.168.221.53:11000/soap/IntegraSessionManager';
    this.urlGetUserID = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlGetDomVal = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlGetCust   = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlGetVorg   = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlGetDet    = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlSetVorg   = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlSetDet    = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlDelVorg   = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.urlDelDet    = 'http://192.168.221.53:11000/soap/IntegraMAEC';
    this.loadCust     = false;
    this.getProc      = false;
    this.loadProc     = false;
    this.getDet       = false;
    this.loadDet      = false;
  };

  static newLiSeg = (iD, o) => {return new ListSeg(iD, o)};

  static extractor = (start, end, source) => {
    return source.slice((source.indexOf(start) + start.length), source.indexOf(end));
  };

  static parseBool = val => {
    if (val === 'true') return true;
    else if (val === 'false') return false;
  };

  static valBuilder = (valName, type, source) => {    

    if (source.indexOf(`<${valName} xsi:nil="true"/>`) !== -1 || 
        source.indexOf(`<${valName} xsi:type="xsd:${type}"/>`) !== -1
       ) return '';
    else {
      let a = `<${valName} xsi:type="xsd:${type}">`;
      let b = `</${valName}>`;
      let c = this.extractor(a, b, source);      

      if (type === 'dateTime') return c; 
      else if (type === 'int' || type === 'double' || type === 'short') return parseInt(c);
      else if (type === 'boolean') return this.parseBool(c);
      else return c;  
    };      
  };
};

export default BasicStuff