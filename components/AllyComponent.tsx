"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

import { cn, configureAssistant, getSubjectColor, getSubjectIcon } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import soundwaves from "@/constants/soundwaves.json";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const AllyComponent = ({
  subject,
  topic,
  name,
  userName,
  userImage,
  voice,
  style,
  duration,
}: AllyComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(
    CallStatus.INACTIVE
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (isSpeaking) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isSpeaking]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (
        message.type === MessageTypeEnum.TRANSCRIPT &&
        message.transcriptType === TranscriptMessageTypeEnum.FINAL
      ) {
        setMessages((prev) => [
          { role: message.role, content: message.transcript },
          ...prev,
        ]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("Vapi error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.removeListener("call-start", onCallStart);
      vapi.removeListener("call-end", onCallEnd);
      vapi.removeListener("message", onMessage);
      vapi.removeListener("speech-start", onSpeechStart);
      vapi.removeListener("speech-end", onSpeechEnd);
      vapi.removeListener("error", onError);
    };
  }, []);

  const toggleMicrophone = () => {
    const mutedNow = vapi.isMuted();
    vapi.setMuted(!mutedNow);
    setIsMuted(!mutedNow);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    await vapi.start(configureAssistant(voice, style), {
      variableValues: { subject, topic, style },
      maxDurationSeconds: duration * 60,
    });
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? "opacity-100"
                  : "opacity-0",
                callStatus === CallStatus.CONNECTING &&
                  "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={getSubjectIcon(subject)}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{userName}</p>
          </div>

          <button
            className="btn-mic"
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>

          <button
            className={cn(
              "btn-primary w-full justify-center",
              callStatus === CallStatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
                ? "Connecting..."
                : "Start Session"}
          </button>
        </div>
      </section>

      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => (
            <p
              key={index}
              className={
                message.role === "assistant"
                  ? "max-sm:text-sm"
                  : "text-primary max-sm:text-sm"
              }
            >
              {message.role === "assistant"
                ? name.split(" ")[0].replace(/[.,]/g, "")
                : userName}
              : {message.content}
            </p>
          ))}
        </div>
        <div className="transcript-fade" />
      </section>
    </section>
  );
};

export default AllyComponent;
