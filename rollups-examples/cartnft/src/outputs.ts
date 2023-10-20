import { stringToHex, bytesToHex, Address } from "viem";
class Output {
  payload: string;
  constructor(_payload: string) {
    if (_payload.slice(0, 2) === "0x") {
      this.payload = _payload;
    } else {
      this.payload = stringToHex(_payload);
    }
  }
}

class Voucher extends Output {
  destination: Address;
  constructor(_destination: Address, _payload: Uint8Array) {
    let hexpayload = "0x" + bytesToHex(_payload);
    super(hexpayload);
    this.destination = _destination;
  }
}

class Notice extends Output {
  constructor(_payload: string) {
    super(_payload);
  }
}
class Report extends Output {
  constructor(_payload: string) {
    super(_payload);
  }
}

class Log extends Output {
  constructor(_payload: string) {
    super(_payload);
  }
}

class Error_out extends Output {
  constructor(_payload: string) {
    super(_payload);
  }
}

export { Voucher, Notice, Log, Report, Error_out, Output };
