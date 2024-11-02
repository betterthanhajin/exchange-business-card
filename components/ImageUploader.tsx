"use client";

import React, { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { ImageToEle } from "@/app/api/claude-connect/image-to-element";

export default function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false); // dragging 상태

  // 드래그 이벤트 핸들러
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

  // 파일 처리 함수
  const handleFiles = useCallback((file: File | undefined) => {
    const fileEle = file;
    if (!fileEle) return;

    // 파일 타입 체크
    if (!fileEle.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const ImageFile = e.target?.result as string;

      //base64 데이터만 추출
      const base64Data = ImageFile.split(",")[1];
      console.log("업로드된 이미지 ", base64Data);
      const result = ImageToEle({
        ImageUrl: base64Data as string,
        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
      });
      console.log("결과값", result);
    };
    reader.readAsDataURL(file);
  }, []);

  // 드롭 이벤트 핸들러
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      handleFiles(file);
    },
    [handleFiles]
  );

  // 파일 입력 이벤트 핸들러
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFiles(file);
    },
    [handleFiles]
  );

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
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

        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="w-12 h-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-600">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-500">지원 형식: JPG, PNG, GIF</p>
        </div>
      </div>
    </div>
  );
}
