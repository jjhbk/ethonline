import React from "react";
import "./styles.css";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
export const Signature_pad: React.FC = () => {
  const [dataURL, setDataURL] = React.useState<string | null>(null);
  let padRef = React.useRef<SignatureCanvas>(null);

  const clear = () => {
    padRef.current?.clear();
  };

  const trim = () => {
    const url = padRef.current?.getCanvas().toDataURL("image/png");
    if (url) setDataURL(url);
    console.log(url);
  };

  return (
    <div>
      <SignaturePad ref={padRef} canvasProps={{ className: "sigCanvas" }} />
      <div className="sigPreview">
        <button onClick={trim}>Trim</button>
        <button onClick={clear}>Clear</button>
        {dataURL ? (
          <img
            className={"sigImage"}
            src={dataURL}
            alt="user generated signature"
          />
        ) : null}
      </div>
    </div>
  );
};
