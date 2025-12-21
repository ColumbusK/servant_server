import { FastifyRequest, FastifyReply } from 'fastify';
import QuestionModel from "../models/question.model";
import mongoose from 'mongoose';


export async function findQuestion(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    console.log("id", id, request.user);
    const question = await QuestionModel.findById(id);

    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    reply.status(200).send(question);
  } catch (err) {
    const error = err as Error;
    reply.status(500).send({ error: error.message });
  }
}

export async function createQuestion(request: FastifyRequest<{ Body: { province: string, city: string } }>, reply: FastifyReply) {
  try {
    const { province, city } = request.body;
    const newQuestion = new QuestionModel({ province, city });
    await newQuestion.save();
    reply.status(201).send(newQuestion);
  } catch (err) {
    const error = err as Error;
    reply.status(500).send({ error: error.message });
  }
}


export async function findQuestionsByProvince(request: FastifyRequest<{ Params: { province: string } }>, reply: FastifyReply) {
  try {
    const { province } = request.params;
    console.log('查询的省份/单位:', decodeURIComponent(province));
    // 1. 获取当前年份并计算起始年份
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2; // 包含今年在内的最近三年（如 2025, 2024, 2023）

    // 2. 执行查询
    const questions = await QuestionModel.find({
      province,
      year: { $gte: startYear } // 筛选大于等于起始年份的数据
    }).sort({ year: -1 }); // 可选：按年份降序排列，最新的在前

    if (!questions || questions.length === 0) {
      return reply.status(404).send({ error: 'No questions found for the last 3 years' });
    }

    reply.status(200).send(questions);
  } catch (err) {
    const error = err as Error;
    reply.status(500).send({ error: error.message });
  }
}
