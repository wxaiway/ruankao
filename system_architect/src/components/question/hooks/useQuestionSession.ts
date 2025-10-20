/**
 * 题目会话状态管理钩子
 * 管理题目答题的完整生命周期
 */

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { Question } from '@/lib/questions';
import { QuestionSession, QuestionMode, QuestionStats } from '../types';

// 会话动作类型
type SessionAction =
  | { type: 'INIT_SESSION'; questions: Question[]; mode: QuestionMode }
  | { type: 'SET_CURRENT'; index: number }
  | { type: 'SELECT_ANSWER'; questionId: string; answer: string }
  | { type: 'SUBMIT_ANSWER'; questionId: string; answer: string; isCorrect: boolean }
  | { type: 'TOGGLE_EXPLANATION'; questionId: string }
  | { type: 'UPDATE_TIME'; questionId: string; timeSpent: number }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET_SESSION' };

// 计算统计信息
function calculateStats(session: QuestionSession): QuestionStats {
  const answered = Object.keys(session.answers).length;
  const correct = session.questions.filter(q => 
    session.answers[q.id] === q.correctAnswer
  ).length;
  
  const totalTimeSpent = Object.values(session.timeSpent).reduce((sum, time) => sum + time, 0);
  
  return {
    total: session.questions.length,
    answered,
    correct,
    timeSpent: totalTimeSpent,
    accuracy: answered > 0 ? (correct / answered) * 100 : 0
  };
}

// 会话状态reducer
function sessionReducer(state: QuestionSession, action: SessionAction): QuestionSession {
  switch (action.type) {
    case 'INIT_SESSION':
      return {
        questions: action.questions,
        currentIndex: 0,
        mode: action.mode,
        answers: {},
        submitted: {},
        explanationVisible: {},
        timeSpent: {},
        startTime: Date.now(),
        isCompleted: false,
        stats: {
          total: action.questions.length,
          answered: 0,
          correct: 0,
          timeSpent: 0,
          accuracy: 0
        }
      };

    case 'SET_CURRENT':
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.index, state.questions.length - 1))
      };

    case 'SELECT_ANSWER':
      const newAnswers = {
        ...state.answers,
        [action.questionId]: action.answer
      };
      
      return {
        ...state,
        answers: newAnswers,
        stats: calculateStats({ ...state, answers: newAnswers })
      };

    case 'SUBMIT_ANSWER':
      const answersAfterSubmit = {
        ...state.answers,
        [action.questionId]: action.answer
      };
      const submittedAfterSubmit = {
        ...state.submitted,
        [action.questionId]: true
      };
      
      return {
        ...state,
        answers: answersAfterSubmit,
        submitted: submittedAfterSubmit,
        stats: calculateStats({ ...state, answers: answersAfterSubmit })
      };

    case 'TOGGLE_EXPLANATION':
      return {
        ...state,
        explanationVisible: {
          ...state.explanationVisible,
          [action.questionId]: !state.explanationVisible[action.questionId]
        }
      };

    case 'UPDATE_TIME':
      const newTimeSpent = {
        ...state.timeSpent,
        [action.questionId]: action.timeSpent
      };
      
      return {
        ...state,
        timeSpent: newTimeSpent,
        stats: { ...state.stats, timeSpent: Object.values(newTimeSpent).reduce((sum, time) => sum + time, 0) }
      };

    case 'COMPLETE_SESSION':
      return {
        ...state,
        isCompleted: true
      };

    case 'RESET_SESSION':
      return {
        ...state,
        currentIndex: 0,
        answers: {},
        submitted: {},
        explanationVisible: {},
        timeSpent: {},
        startTime: Date.now(),
        isCompleted: false,
        stats: {
          total: state.questions.length,
          answered: 0,
          correct: 0,
          timeSpent: 0,
          accuracy: 0
        }
      };

    default:
      return state;
  }
}

export function useQuestionSession(
  initialQuestions: Question[] = [],
  initialMode: QuestionMode = 'practice'
) {
  // 状态管理
  const [session, dispatch] = useReducer(sessionReducer, {
    questions: [],
    currentIndex: 0,
    mode: initialMode,
    answers: {},
    submitted: {},
    explanationVisible: {},
    timeSpent: {},
    startTime: Date.now(),
    isCompleted: false,
    stats: { total: 0, answered: 0, correct: 0, timeSpent: 0, accuracy: 0 }
  });

  // 计时器管理
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  // 初始化会话
  const initSession = useCallback((questions: Question[], mode: QuestionMode = 'practice') => {
    dispatch({ type: 'INIT_SESSION', questions, mode });
    startTimeRef.current = Date.now();
  }, []);

  // 导航控制
  const goToQuestion = useCallback((index: number) => {
    // 更新当前题目时间
    if (session.questions.length > 0 && session.currentIndex < session.questions.length) {
      const currentQuestion = session.questions[session.currentIndex];
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      dispatch({ type: 'UPDATE_TIME', questionId: currentQuestion.id, timeSpent });
    }
    
    dispatch({ type: 'SET_CURRENT', index });
    startTimeRef.current = Date.now();
  }, [session.currentIndex, session.questions]);

  const goNext = useCallback(() => {
    if (session.currentIndex < session.questions.length - 1) {
      goToQuestion(session.currentIndex + 1);
    }
  }, [session.currentIndex, session.questions.length, goToQuestion]);

  const goPrevious = useCallback(() => {
    if (session.currentIndex > 0) {
      goToQuestion(session.currentIndex - 1);
    }
  }, [session.currentIndex, goToQuestion]);

  // 答题控制
  const selectAnswer = useCallback((answer: string) => {
    if (session.questions.length > 0) {
      const currentQuestion = session.questions[session.currentIndex];
      dispatch({ type: 'SELECT_ANSWER', questionId: currentQuestion.id, answer });
    }
  }, [session.questions, session.currentIndex]);

  const submitAnswer = useCallback((answer: string) => {
    if (session.questions.length > 0) {
      const currentQuestion = session.questions[session.currentIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;
      dispatch({ type: 'SUBMIT_ANSWER', questionId: currentQuestion.id, answer, isCorrect });
    }
  }, [session.questions, session.currentIndex]);

  const toggleExplanation = useCallback(() => {
    if (session.questions.length > 0) {
      const currentQuestion = session.questions[session.currentIndex];
      dispatch({ type: 'TOGGLE_EXPLANATION', questionId: currentQuestion.id });
    }
  }, [session.questions, session.currentIndex]);

  // 会话控制
  const completeSession = useCallback(() => {
    dispatch({ type: 'COMPLETE_SESSION' });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
    startTimeRef.current = Date.now();
  }, []);

  // 计时器效果
  useEffect(() => {
    if (session.questions.length > 0 && !session.isCompleted) {
      timerRef.current = setInterval(() => {
        const currentQuestion = session.questions[session.currentIndex];
        if (currentQuestion) {
          const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
          dispatch({ type: 'UPDATE_TIME', questionId: currentQuestion.id, timeSpent });
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [session.questions, session.currentIndex, session.isCompleted]);

  // 初始化效果
  useEffect(() => {
    if (initialQuestions.length > 0) {
      initSession(initialQuestions, initialMode);
    }
  }, [initialQuestions, initialMode, initSession]);

  // 获取当前题目
  const currentQuestion = session.questions[session.currentIndex];
  const currentAnswer = currentQuestion ? session.answers[currentQuestion.id] : undefined;
  const isExplanationVisible = currentQuestion ? session.explanationVisible[currentQuestion.id] : false;

  // 导航状态
  const canGoPrevious = session.currentIndex > 0;
  const canGoNext = session.currentIndex < session.questions.length - 1;
  const isAnswered = currentQuestion ? currentQuestion.id in session.answers : false;
  const isSubmitted = currentQuestion ? currentQuestion.id in session.submitted : false;
  const isCorrect = currentQuestion && isAnswered ? 
    session.answers[currentQuestion.id] === currentQuestion.correctAnswer : false;

  return {
    // 状态
    session,
    currentQuestion,
    currentAnswer,
    isExplanationVisible,
    canGoPrevious,
    canGoNext,
    isAnswered,
    isSubmitted,
    isCorrect,

    // 动作
    initSession,
    goToQuestion,
    goNext,
    goPrevious,
    selectAnswer,
    submitAnswer,
    toggleExplanation,
    completeSession,
    resetSession
  };
}