import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    time: {
      type: String
    },
    province: {
      type: String
    },
    city: {
      type: String
    },
    source: {
      type: String
    },
    question: {
      type: String
    },
    position: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
  exam_type: {
    type: String
  },
  });


const QuestionModel = mongoose.model('Question', questionSchema, 'questions');

export default QuestionModel;
