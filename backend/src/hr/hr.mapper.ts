import { HrQuestion } from '../schema/hr-questions.schema';

export class HrMapper {
  static toQuestionView(q: HrQuestion) {
    return {
      id: q._id.toString(),
      question: q.question,
      preferred_answer: q.preferred_answer,
    };
  }
}
