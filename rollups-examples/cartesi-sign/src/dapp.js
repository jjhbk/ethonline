// Copyright 2022 Cartesi Pte. Ltd.
//
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

const { ethers } = require("ethers");
const fs = require("fs");
const { createWorker } = require("tesseract.js");
//const PNG = require("pngjs").PNG;
//const pixelmatch = require("pixelmatch");
const Init_db = () => {
  const Database = require("sqlite3");
  const db = new Database("marketplace.db", { verbose: console.log });
  var info = db.exec(
    "CREATE TABLE Assets([id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,[address] NVARCHAR(35),[signature] VARCHAR)"
  );
  console.log(info);

  const insert_stmt = db.prepare("INSERT INTO Assets VALUES (?, ?,?)");
  info = insert_stmt.run(1, "0x1233");
  console.log("insert_info is ", info);
  const get_stmt = db.prepare("SELECT * FROM Assets WHERE id = ?");
  const signature = get_stmt.get(1);
  console.log("signature is", signature);
};
Init_db();
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);
const Tesseract = require("tesseract.js");
/*const compare_images = (data1, data2) => {
  base64ImageDecoder(data1, "", "image1")
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.error(err));
  base64ImageDecoder(data2, "", "image2")
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.error(err));
  const img1 = PNG.sync.read(fs.readFileSync("image1.png"));

  const img2 = PNG.sync.read(fs.readFileSync("image2.png"));

  const { width, height } = img1;
  const diff = new PNG({ width, height });
  pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  });
  console.log("the difference is", diff);
  fs.writeFileSync("diff.png", PNG.sync.write(diff));

  return diff;
};*/

const base64ImageDecoder = (
  base64String,
  outputPath,
  imageName = null,
  imageType = null
) => {
  return new Promise((resolve, reject) => {
    let base64Data = [];
    let convertedImageInfo;
    let base64ImageString;
    if (
      base64String.length <= 0 ||
      (base64String.length > 0 &&
        !base64String.toLowerCase().startsWith("data"))
    ) {
      reject(new Error("Invalid Base64 string"));
    }

    base64Data = base64String.split("/");
    if (base64Data.length > 0) {
      if (!imageType) {
        imageType = base64Data[1].split(";")[0];
      }

      if (!imageName) {
        let currentDate = new Date();
        imageName = `image_${currentDate.getMonth()}_${currentDate.getDay()}_${currentDate.getSeconds()}.${imageType}`;
      }

      imageName = !imageName.split["."]
        ? `${imageName}.${imageType}`
        : imageName;

      base64ImageString = base64String.split(";base64,").pop();
    }

    if (base64ImageString) {
      let path = `${imageName}`;
      fs.writeFileSync(
        path,
        base64ImageString,
        { encoding: "base64" },
        function (err) {
          if (err) {
            reject(err);
          }
          convertedImageInfo = {
            name: imageName,
            type: imageType,
            path: outputPath,
            fullPath: path,
          };
          resolve(JSON.stringify(convertedImageInfo));
        }
      );
    }
  });
};
async function handle_advance(data) {
  //console.log("Received advance request data " + JSON.stringify(data));
  const payload = data["payload"];
  var result = "no result yet";
  try {
    const payloadStr = ethers.utils.toUtf8String(payload);
    base64ImageDecoder(payloadStr, "", "automated")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.error(err));
    var result = "this is a reference";
    const worker = await createWorker();
    await (async () => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      console.log("Recognizing...");
      const {
        data: { text },
      } = await worker.recognize(payloadStr);
      console.log("Recognized text:", text);
      result = text;
      await worker.terminate();
    })();
    /* await Tesseract.recognize(payloadStr, "eng", {})
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        result = res.data.text;
      });*/

    console.log("the result is ", result);
    console.log("comparing signatures");
    //await compare_images(payloadStr, payloadStr);
  } catch (e) {
    console.log("error is : ", e);
    //console.log(`Adding notice with binary value "${payload}"`);
  }
  coder = ethers.utils.defaultAbiCoder;
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: coder.encode(["string"], [result]) }),
  });
  const json = await advance_req.json();
  console.log(
    "Received notice status " + advance_req.status + " with body " + result
  );
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const payload = data["payload"];
  try {
    const payloadStr = ethers.utils.toUtf8String(payload);
    console.log(`Adding report "${payloadStr}"`);
  } catch (e) {
    console.log(`Adding report with binary value "${payload}"`);
  }
  const inspect_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  console.log("Received report status " + inspect_req.status);
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    console.log("Sending finish");

    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
