import Script from "next/script";
import { useEffect, useState } from "react";

declare let window: typeof Window & {
  Quiet: any;
};

export interface QuietTransmitInstance {
  sendText: (text: string) => unknown;
}

export interface QuietTransmitProps {
  profile:
    | "audible"
    | "audible-7k-channel-0"
    | "audible-7k-channel-1"
    | "cable-64k"
    | "hello-world"
    | "ultrasonic"
    | "ultrasonic-3600"
    | "ultrasonic-whisper"
    | "wideband-dsss"
    | "audible-fsk"
    | "ultrasonic-fsk"
    | "ultrasonic-experimental"
    | "audible-fsk-robust"
    | "ultrasonic-fsk-robust"
    | "audible-fsk-fast"
    | "ultrasonic-fsk-fast";
  onReadyToReceive?: () => unknown;
  onReceive?: (text: string) => unknown;
  onReceiveFail?: (failCount: number) => unknown;
  onReceiverCreateFail?: (reason: string) => unknown;
  onReady?: (options: QuietTransmitInstance) => unknown;
}

export const QuietTransmit = ({
  profile,
  onReady,
  onReadyToReceive,
  onReceive,
  onReceiveFail,
  onReceiverCreateFail,
}: QuietTransmitProps) => {
  useEffect(() => {
    if (!window.Quiet) return;

    // * Initialize Quiet.js
    window.Quiet.init({
      profilesPrefix: "/quietjs/",
      memoryInitializerPrefix: "/quietjs/",
      libfecPrefix: "/quietjs/",
    });

    // * Load the emscripten module
    const script = document.createElement("script");
    script.src = "/quietjs/quiet-emscripten.js";
    script.type = "text/javascript";
    script.async = true;
    document.head.appendChild(script);

    // * Receive the message
    const _onReceive = (recvPayload: ArrayBuffer) => {
      const newText = window.Quiet.ab2str(recvPayload);
      onReceive?.(newText);
    };

    const _onReceiverCreateFail = (reason: string) => {
      onReceiverCreateFail?.(reason);
    };

    const _onReceiveFail = (failCount: number) => {
      onReceiveFail?.(failCount);
    };

    const onQuietReady = () => {
      const handleClick = () => {
        window.Quiet.receiver({
          profile,
          onReceive: _onReceive,
          onCreateFail: _onReceiverCreateFail,
          onReceiveFail: _onReceiveFail,
        });
        onReadyToReceive?.();
        document.body.removeEventListener("click", handleClick);
      };

      document.body.addEventListener("click", handleClick, { once: true });

      const sendText = async (text: string) => {
        const payload = window.Quiet.str2ab(text);
        return new Promise<void>((resolve, reject) => {
          const senderInstance = window.Quiet.transmitter({
            profile,
            onFinish: () => {
              resolve();
            },
          });

          senderInstance.transmit(payload);
        });
      };
      onReady?.({ sendText });
    };

    const onQuietFail = (reason: string) => {
      console.error("Quiet failed to initialize:", reason);
    };

    window.Quiet.addReadyCallback(onQuietReady, onQuietFail);

    // * Clean up
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src="/quietjs/quiet.js"
        type="text/javascript"
      />
    </>
  );
};