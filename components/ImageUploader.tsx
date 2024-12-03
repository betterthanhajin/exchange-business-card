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
  const [imgUrl, setImgUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const responseImage = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await responseImage.json();
      console.log("Uploaded URL:", url);
      setImgUrl(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("파일 업로드에 실패했습니다.");
      throw error;
    }
  };

  const handleFiles = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setIsUploading(true);
    try {
      setImgSrc(URL.createObjectURL(file));
      await uploadFile(file);
    } catch (error) {
      console.error("File handling error:", error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFiles(file);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
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
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
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
          disabled={isUploading}
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
              {isUploading
                ? "업로드 중..."
                : "명함을 드래그하거나 클릭하여 업로드"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              지원 형식: JPG, PNG, GIF
            </p>
          </div>
        )}
      </div>
      <button
        className={`relative w-32 h-12 bg-white text-black rounded-md mt-4 ${
          !imgUrl || isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={async () => {
          try {
            console.log("Sending URL:", imgUrl);
            alert("전송중");
            await quietInstance?.sendText(imgUrl);
            console.log("전송완료:", imgUrl);
            alert("전송완료: " + imgUrl);
          } catch (error) {
            console.error("전송 실패:", error);
            alert("전송 실패");
          }
        }}
      >
        Send
      </button>
    </div>
  );
}
