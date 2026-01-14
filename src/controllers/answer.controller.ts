// controllers/answer.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { Types } from "mongoose";
import { AnswerModel } from "../models/answer.model";
import { UserAnswerModel } from "../models/user_answer.model";

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

export async function saveUserAnswer(
  request: FastifyRequest<{ Body: { question_id: string; answer_content: string; duration_seconds?: number } }>,
  reply: FastifyReply
) {
  try {
    // 获取 JWT 解析出的用户 ID (此处需确认你 JWT 负载里的 key 是 id 还是 _id)
    const userId = (request as any).user.userId;
    const current_user_id = userId;

    const { question_id, answer_content, duration_seconds } = request.body;

    if (!answer_content || answer_content.trim().length < 2) {
      return reply.status(400).send({ ok: false, error: "作答内容不能为空" });
    }

    // 创建记录
    const new_answer = await UserAnswerModel.create({
      user_id: new Types.ObjectId(current_user_id),
      question_id: new Types.ObjectId(question_id),
      answer_content: answer_content,
      word_count: answer_content.length,
      duration_seconds: duration_seconds || 0
    });

    reply.status(201).send({
      ok: true,
      message: "作答保存成功",
      data: { answer_id: new_answer._id }
    });
  } catch (err) {
    request.log.error(err);
    reply.status(500).send({ ok: false, error: "服务器保存失败" });
  }
}


// 获取用户对某道题的最近一次作答（用于回显）
export async function getLatestUserAnswer(
  request: FastifyRequest<{ Querystring: { question_id: string } }>, // 改为 Querystring
  reply: FastifyReply
) {
  try {
    const userId = (request as any).user.userId;
    const { question_id } = request.query; // 从 request.query 中取值

    console.log("获取答案参数:", { question_id, userId });

    if (!question_id) {
      return reply.status(400).send({ ok: false, error: "question_id is required" });
    }

    const lastAnswer = await UserAnswerModel.findOne({
      user_id: userId,
      question_id: question_id
    }).sort({ createdAt: -1 });

    reply.send({ ok: true, data: lastAnswer });
  } catch (err) {
    reply.status(500).send({ ok: false, error: (err as Error).message });
  }
}
