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


export async function findQuestionsByProvince(
  request: FastifyRequest<{ Params: { province: string } }>,
  reply: FastifyReply
) {

  try {
    const { province } = request.params;
    const decodedProvince = decodeURIComponent(province);
    // 将返回结果断言为 number[]
    const availableYears = await QuestionModel.distinct('year', { province: decodedProvince }) as number[];


    // 1. 获取该省份拥有的所有年份并去重排序
    // distinct 会返回一个数组，例如 [2018, 2021, 2022, 2024]
    if (!availableYears || availableYears.length === 0) {
      return reply.status(404).send({ error: '该省份下暂无面试题目数据' });
    }

    // 2. 对年份进行倒序排列，取前 3 个
    // 例如排序后得到 [2024, 2022, 2021]
    const latestThreeYears = availableYears
      .sort((a, b) => b - a)
      .slice(0, 3);

    // 3. 使用 $in 查询这三个特定年份的所有题目
    const questions = await QuestionModel.find({
      province: decodedProvince,
      year: { $in: latestThreeYears }
    }).sort({ year: -1, created_at: -1 }); // 年份降序，同一年份最新的在前

    reply.status(200).send({
      province: decodedProvince,
      years_included: latestThreeYears, // 告知前端具体返回了哪三年的数据
      total: questions.length,
      questions
    });

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
