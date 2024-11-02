"use client";
import React, { useState, useEffect, useRef } from "react";
import ImageUploader from "./ImageUploader";

interface MousePosition {
  x: number;
  y: number;
}

const RainEffect: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const raindrops = Array(20).fill(null);
  const requestRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [raindropStyles, setRaindropStyles] = useState<
    { left: string; animationDuration: string; animationDelay: string }[]
  >([]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const styles = raindrops.map(() => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${2 + Math.random() * 2}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setRaindropStyles(styles);
  }, []);

  const animate = (time: number) => {
    if (timeRef.current !== undefined) {
      // const delta = (time - timeRef.current) / 1000;
      const turbulence = document.getElementById("turbulence");
      const displacement = document.getElementById("displacement");

      if (turbulence && displacement) {
        const frequency = 0.01 + Math.sin(time * 0.001) * 0.007;
        turbulence.setAttribute(
          "baseFrequency",
          `${frequency} ${frequency * 2}`
        );
        displacement.setAttribute(
          "scale",
          (10 + Math.sin(time * 0.001) * 5).toString()
        );
      }
    }
    timeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="rain-container">
      {raindrops.map((_, index) => (
        <div
          key={index}
          className="raindrop"
          style={{
            ...raindropStyles[index],
            transform: `translate(${
              windowWidth ? (mousePosition.x / windowWidth - 0.5) * 10 : 0
            }px, 0px)`,
          }}
        ></div>
      ))}
      <svg width="700" height="700">
        <defs>
          <filter id="water">
            <feTurbulence
              id="turbulence"
              type="fractalNoise"
              baseFrequency="0.01 0.05"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              id="displacement"
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="content" style={{ width: 700, height: 700 }}>
        <ImageUploader />
      </div>
      <style jsx>{`
        .rain-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #9dbfdf, #f196ac);
          overflow: hidden;
        }
        .raindrop {
          position: absolute;
          width: 1px;
          height: 20px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.7)
          );
          animation: fall linear infinite;
          transition: transform 0.1s ease-out;
        }
        @keyframes fall {
          0% {
            transform: translateY(-100px);
          }
          100% {
            transform: translateY(calc(100vh + 100px));
          }
        }
        .content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          filter: url(#water);
          transition: filter 0.3s ease;
        }
        .content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .content p {
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default RainEffect;
