"use client";
import React from "react";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub } from "react-icons/fa";

const BusinessCard = () => {
  return (
    <div className="card-container">
      <div className="card">
        <div className="card-front">
          {/* <div className="logo">JD</div> */}
          <h1>Hajin Lee</h1>
          <p>Frontend Developer</p>
        </div>
        <div className="card-back">
          <ul>
            <li>
              <FaEnvelope /> hajin.lee@email.com
            </li>
            <li>
              <FaPhone /> (123) 456-7890
            </li>
            <li>
              <FaLinkedin /> linkedin.com/in/hajin
            </li>
            <li>
              <FaGithub /> github.com/betterthanhajin
            </li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        .card-container {
          perspective: 1000px;
          width: 300px;
          height: 180px;
          margin: 50px auto;
        }
        .card {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .card-container:hover .card {
          transform: rotateY(180deg);
        }
        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .card-front {
          background: linear-gradient(
            45deg,
            #ff9a9e 0%,
            #fad0c4 99%,
            #fad0c4 100%
          );
          color: white;
        }
        .card-back {
          background: white;
          color: #333;
          transform: rotateY(180deg);
        }
        .logo {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        h1 {
          margin: 0;
          font-size: 1.5em;
        }
        p {
          margin: 5px 0;
          font-size: 1em;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 10px 0;
          display: flex;
          align-items: center;
        }
        li svg {
          margin-right: 10px;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .card-front > *,
        .card-back > * {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BusinessCard;
