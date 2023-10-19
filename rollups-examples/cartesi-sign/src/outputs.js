const { stringToHex, bytestoHexString } = require("./utils");

class Output {
  constructor(_payload) {
    if (_payload.slice(0, 2) === "0x") {
      this.payload = _payload;
    } else {
      this.payload = stringToHex(_payload);
    }
  }
}

class Voucher extends Output {
  constructor(_destination, _payload) {
    this.destination = _destination;
    let hexpayload = "0x" + bytestoHexString(_payload);
    super(hexpayload);
  }
}

class Notice extends Output {
  constructor(_payload) {
    super(_payload);
  }
}

class Log extends Output {
  constructor(_payload) {
    super(_payload);
  }
}

class Error extends Output {
  constructor(_payload) {
    super(_payload);
  }
}

module.exports = { Voucher, Notice, Log, Error };
