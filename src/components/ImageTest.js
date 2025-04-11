import React from "react";
import seasideResortImage from "../assets/images/destinations/seaside-resort.svg";
import mountainResortImage from "../assets/images/destinations/mountain-resort.svg";
import cityDestinationImage from "../assets/images/destinations/city-destination.svg";

const ImageTest = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Image Test</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Seaside Resort Image</h2>
        <img
          src={seasideResortImage}
          alt="Seaside Resort"
          style={{ width: "300px", border: "1px solid #ccc" }}
        />
        <p>Path: {seasideResortImage}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Mountain Resort Image</h2>
        <img
          src={mountainResortImage}
          alt="Mountain Resort"
          style={{ width: "300px", border: "1px solid #ccc" }}
        />
        <p>Path: {mountainResortImage}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>City Destination Image</h2>
        <img
          src={cityDestinationImage}
          alt="City Destination"
          style={{ width: "300px", border: "1px solid #ccc" }}
        />
        <p>Path: {cityDestinationImage}</p>
      </div>
    </div>
  );
};

export default ImageTest;
