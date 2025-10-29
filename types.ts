
export type CoachingStyle = 'D' | 'S' | 'P' | 'M';

export interface Score {
  style: CoachingStyle;
  name: string;
  score: number;
}

export interface CoachingQuestionSet {
  id: CoachingStyle;
  part: number;
  title: string;
  characteristics: string[];
}

export interface CoachingStyleInfo {
  name: string;
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  coachingApproach: {
    title: string;
    items: {
      topic: string;
      asCoachee: string;
      asCoach: string;
    }[];
  };
}
