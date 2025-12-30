// controllers/answer.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { Types } from "mongoose";
import { AnswerModel } from "../models/answer.model";

export async function getAnswerByQuestionId(
  request: FastifyRequest<{ Params: { questionId: string } }>,
  reply: FastifyReply
) {
  try {
    const { questionId } = request.params;
    console.log("get Answer questionId", questionId);
    console.info("Fetching answer for question ID:", questionId);


    // 查询该题目的参考答案
    const answer = await AnswerModel.findOne({
      question_id: questionId
    });
    // 无论是否找到，都给 200，让前端逻辑能平滑运行
    return reply.status(200).send({
      ok: !!answer,
      data: answer // 找不到就是 null
    });
  } catch (err) {
    reply.status(500).send({ ok: false, error: (err as Error).message });
  }
}
