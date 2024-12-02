"use client";
import {
  QuietTransmit,
  QuietTransmitInstance,
} from "@/components/QuietTransmit";
import RainEffect from "@/components/RainEffect";
import { useState } from "react";

export default function Home() {
  const [quietInstance, setQuietInstance] =
    useState<QuietTransmitInstance | null>(null);

  return (
    <>
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
      <div className="flex flex-col gap-72 items-center justify-center min-h-screen p-8">
        <div>
          <RainEffect />
        </div>
        <button
          className="relative w-32 h-12 bg-white text-black rounded-md"
          onClick={async () => {
            console.log("Sending: Hello, World!");
            await quietInstance?.sendText("Hello, World!");
            console.log("Sent: Hello, World!");
          }}
        >
          Send
        </button>
      </div>
    </>
  );
}
