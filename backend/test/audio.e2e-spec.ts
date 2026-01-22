import { AssemblyAI } from "assemblyai";

describe("AudioService (integration)", () => {
  jest.setTimeout(60_000);

  it("transcribes audio file", async () => {
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!, // ENV ONLY
    });

    const transcript = await client.transcripts.transcribe({
      audio: "recording.webm",
      speech_models: ["universal"],
    });

    console.log("Transcript:", transcript.text);
    expect(transcript.text).toBeDefined();
  });

  afterAll(() => {
    // Prevent Jest open-handle hang
    process.exit(0);
  });
});


//   let service: CodingService;
//   let mongo: MongoMemoryServer;

//   beforeAll(async () => {
//     mongo = await MongoMemoryServer.create();

//     const module = await Test.createTestingModule({
//       imports: [
//         MongooseModule.forRoot(mongo.getUri()),
//         MongooseModule.forFeature([
//           { name: CodingSubmission.name, schema: CodingSubmissionSchema },
//         ]),
//       ],
//       providers: [CodingService, CodingRepository],
//     }).compile();

//     service = module.get(CodingService);
//   });

//   afterAll(async () => {
//     await mongo.stop();
//   });

//   it('should insert submission into database', async () => {
//     const userId = new Types.ObjectId().toString();

//     const dto = {
//       questionId: new Types.ObjectId().toString(),
//       solutionText: 'solution',
//       explanation: 'explanation',
//     };

//     const result = await service.submitSolution(userId, dto);

//     expect(result._id).toBeDefined();
//     expect(result.verdict).toBe(SubmissionVerdict.NEEDS_IMPROVEMENT);
//   });
// });