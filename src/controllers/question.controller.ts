import { FastifyRequest, FastifyReply } from 'fastify';
import QuestionModel from "../models/question.model";
import FavoriteModel from '../models/favorite.model';
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

// 收藏或取消收藏 (切换模式)
export async function toggleFavorite(request: FastifyRequest<{ Body: { questionId: string } }>, reply: FastifyReply) {
  try {
    // 假设你已经有中间件把 userId 放入了 request.user
    const userId = (request as any).user.userId;
    const { questionId } = request.body;
    console.log("toggleFavorite questionId", questionId, "userId", userId);

    const existing = await FavoriteModel.findOne({ userId, questionId });

    if (existing) {
      await FavoriteModel.deleteOne({ _id: existing._id });
      return reply.send({ message: '已取消收藏', isFavorited: false });
    } else {
      await FavoriteModel.create({ userId, questionId });
      return reply.send({ message: '收藏成功', isFavorited: true });
    }
  } catch (err) {
    reply.status(500).send({ error: '操作失败' });
  }
}

// 获取当前用户的收藏列表
export async function getMyFavorites(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (request as any).user.userId;
    // 连表查询题目详细信息
    const favorites = await FavoriteModel.find({ userId }).populate('questionId');
    reply.send(favorites.map(fav => fav.questionId));
  } catch (err) {
    reply.status(500).send({ error: '获取失败' });
  }
}

// 检查某题目是否被当前用户收藏
export async function checkFavorite(request: FastifyRequest<{ Params: { questionId: string } }>, reply: FastifyReply) {
  try {
    const userId = (request as any).user.userId;
    const { questionId } = request.params;
    const existing = await FavoriteModel.findOne({ userId, questionId });
    const isFavorited = !!existing;
    reply.send({ isFavorited });
  } catch (err) {
    reply.status(500).send({ error: '检查失败' });
  }
}
