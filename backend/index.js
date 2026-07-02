import { AssemblyAI } from "assemblyai";
const client = new AssemblyAI({
  apiKey:"40d6bbb673864988acb2d93a87f1d609", // ENV ONLY
});

const transcript = await client.transcripts.transcribe({
  audio: "recording-1769113283563.webm",
  speech_models: ["universal"],
});

console.log("Transcript:", transcript.text);