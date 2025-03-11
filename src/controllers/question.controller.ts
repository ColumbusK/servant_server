import { FastifyRequest, FastifyReply } from 'fastify';
import QuestionModel from "../models/question.model";
import mongoose from 'mongoose';



export async function findQuestion(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    console.log("id", id);
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
