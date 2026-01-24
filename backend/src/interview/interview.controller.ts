import {
    Controller, Post, UploadedFile, UseInterceptors, Param, Body
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { InterviewService } from "./interview.service";
import { PDFParse } from "pdf-parse";
import { diskStorage } from "multer";
import { extname } from "path";
@Controller("interview")
export class InterviewController {
    constructor(private readonly service: InterviewService) { }

    @Post("context/resume")
    @UseInterceptors(
        FileInterceptor("resume", {
            storage: diskStorage({
                destination: "./uploads/resumes",
                filename: (_, file, cb) => {
                    console.log(file);
                    const unique =
                        Date.now() + "-" + Math.round(Math.random() * 1e9);
                    cb(null, `${unique}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async uploadResume(
        @UploadedFile() file: Express.Multer.File,
        @Body("role") role: string
    ) {
        const publicUrl = `http://localhost:8000/uploads/resumes/${file.filename}`;
        const parser = new PDFParse({url:publicUrl});
        const result =await parser.getText();
        console.log(result);
        return this.service.processResume(result.text, role);
    }

    @Post("answer/:sessionId")
    @UseInterceptors(FileInterceptor("audio"))
    async submitAnswer(@Param("sessionId") sessionId: string) {
        // 🔥 Hackathon shortcut: skip ASR, fake transcript
        const transcript = "User answered confidently about teamwork and problem solving.";
        return this.service.submitAnswer(sessionId, transcript);
    }

    @Post("session/complete/:sessionId")
    async complete(@Param("sessionId") sessionId: string) {
        return this.service.completeSession(sessionId);
    }
}
