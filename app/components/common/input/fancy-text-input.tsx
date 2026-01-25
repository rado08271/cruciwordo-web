import React, { useEffect, useRef, useState } from "react";

type Props = {
  placeholder?: string;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

const FancyTextInput = ({ placeholder, className, value, onValueChange }: Props) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (document) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getGradientStyle = () => {
    let percentage = 50;
    if (typeof window !== "undefined") {
      percentage = Math.floor((mousePosition.x * 100) / window.innerWidth);
    }
    return {
      borderImage: `linear-gradient(to left, #0000 0%, #0000 ${
        percentage - 15 <= 0 ? 1 : percentage - 15
      }%, #00a6f4 ${percentage}%, #0000 ${
        percentage + 15 >= 100 ? 99 : percentage + 15
      }%, #0000 100%) 1`,
    };
  };

  return (
    <div className={"relative"}>
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          borderTop: "2px solid",
          borderBottom: "2px solid",
          borderImageSlice: 1,
          ...getGradientStyle(),
        }}
      />
      <input
        type={"text"}
        className={`w-full bg-transparent py-2 px-3 focus:outline-hidden placeholder:text-slate-400 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={event => {
          if (onValueChange) {
            const value = event.target.value;
            onValueChange(value);
          }
        }}
      />
    </div>
  );
};

export default FancyTextInput;
