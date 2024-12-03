"use client";

import React, { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import {
  QuietTransmit,
  QuietTransmitInstance,
} from "@/components/QuietTransmit";

export default function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [quietInstance, setQuietInstance] =
    useState<QuietTransmitInstance | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFiles = useCallback((file: File | undefined) => {
    const fileEle = file;
    if (!fileEle) return;
    console.log("업로드된 파일", fileEle);
    fileEle.arrayBuffer().then((buffer) => {
      console.log("업로드된 파일 버퍼", buffer);
    });

    setImgSrc(URL.createObjectURL(file as Blob));
    console.log("업로드된 파일url", imgSrc);

    if (!fileEle.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // const ImageFile = e.target?.result as string;
      // const base64Data = ImageFile.split(",")[1];
      // console.log("업로드된 이미지 ", base64Data);
      // const result = ImageToEle({
      //   ImageUrl: base64Data as string,
      //   apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
      // });
      // console.log("결과값", result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        console.log("업로드된 파일url", fileUrl);
        setImgSrc(fileUrl);
        handleFiles(file);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImgSrc(URL.createObjectURL(file as Blob));
        handleFiles(file);
      }
    },
    [handleFiles]
  );

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      <QuietTransmit
        profile="ultrasonic"
        onReady={(instance) => {
          console.log("QuietTransmit Ready");
          setQuietInstance(instance);
        }}
        onReadyToReceive={() => {
          console.log("Ready to receive");
        }}
        onReceive={(text) => {
          console.log(`Received: ${text}`);
        }}
        onReceiveFail={(failCount) => {
          console.log(`Failed to receive ${failCount} times`);
        }}
        onReceiverCreateFail={(reason) => {
          console.log(`Failed to create receiver: ${reason}`);
        }}
      />
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          hover:border-blue-500 transition-colors`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept="image/*"
        />
        {imgSrc ? (
          <div className="relative w-full aspect-video max-h-96 mb-4">
            <Image
              id="image-preview"
              alt="image-preview"
              className="object-contain rounded-lg"
              src={imgSrc}
              style={{ position: "relative" }}
              width={400}
              height={400}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
            <p className="text-base sm:text-lg md:text-xl font-medium text-gray-600">
              명함을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              지원 형식: JPG, PNG, GIF
            </p>
          </div>
        )}
      </div>
      <button
        className="relative w-32 h-12 bg-white text-black rounded-md mt-4"
        onClick={async () => {
          console.log("Sending: Hello, World!", imgSrc);
          await quietInstance?.sendText(imgSrc);
          console.log("Sent: Hello, World!", imgSrc);
        }}
      >
        Send
      </button>
    </div>
  );
}
