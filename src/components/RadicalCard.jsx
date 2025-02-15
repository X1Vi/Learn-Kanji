import React, { useState } from "react";
import radicalsData from "../../radicals.json";

const RadicalCard = () => {
  const [index, setIndex] = useState(0);

  const nextRadical = () => {
    setIndex((prevIndex) => (prevIndex + 1) % radicalsData.length);
  };

  if (radicalsData.length === 0) {
    return <p style={{ color: "white", textAlign: "center", fontSize: "1.5rem", marginTop: "20px" }}>Loading...</p>;
  }

  const { radical, link, description } = radicalsData[index];

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      backgroundColor: "#0a0f25", 
      color: "#fff", 
      padding: "20px"
    }}>
      <div style={{ 
        backgroundColor: "#162447", 
        padding: "30px", 
        borderRadius: "15px", 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", 
        width: "400px", 
        textAlign: "center", 
        lineHeight: "1.6"
      }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "15px", color: "#ffd700", whiteSpace: "nowrap" }}>{radical}</h1>
        <p style={{ 
          fontSize: "1.4rem", 
          marginBottom: "20px", 
          color: "#f8f8f2", 
          textAlign: "justify",
          lineHeight: "1.8"
        }}>{description.split(/(?=[A-Z])/).join(" ")}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ 
          color: "#4fa3ff", 
          textDecoration: "none", 
          fontSize: "1.2rem", 
          fontWeight: "bold", 
          display: "block", 
          marginBottom: "15px" 
        }}>
          Learn More
        </a>
        <button 
          onClick={nextRadical} 
          style={{ 
            width: "100%", 
            padding: "12px", 
            backgroundColor: "#1f4068", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer", 
            fontSize: "1.2rem", 
            fontWeight: "bold", 
            transition: "background 0.3s" 
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#4fa3ff"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#1f4068"}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RadicalCard;