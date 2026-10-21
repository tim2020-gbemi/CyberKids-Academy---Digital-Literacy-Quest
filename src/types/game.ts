export type AgeGroup = 'junior' | 'explorer' | 'champion';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'safety' | 'passwords' | 'kindness' | 'privacy' | 'tech' | 'detective';
}

export interface UserProfile {
  name: string;
  avatar: string;
  ageGroup: AgeGroup;
  stars: number;
  completedMissions: string[];
  badges: string[]; // Badge IDs
  streakDays: number;
}

export interface ScamCard {
  id: string;
  title: string;
  sender: string;
  content: string;
  isScam: boolean;
  clue: string;
  explanation: string;
  ageTier: AgeGroup[];
  type: 'email' | 'chat' | 'popup' | 'game';
}

export interface FootprintScenario {
  id: string;
  title: string;
  situation: string;
  options: {
    text: string;
    isSafe: boolean;
    feedback: string;
  }[];
  explanation: string;
  ageTier: AgeGroup[];
}

export interface KindnessScenario {
  id: string;
  title: string;
  context: string;
  chatHistory: { sender: string; message: string; isMe?: boolean }[];
  question: string;
  choices: {
    text: string;
    isSuperKind: boolean;
    stars: number;
    responseFeedback: string;
  }[];
  lesson: string;
  ageTier: AgeGroup[];
}

export interface NewsCard {
  id: string;
  headline: string;
  source: string;
  date: string;
  summary: string;
  isReal: boolean;
  cluePoints: string[];
  explanation: string;
  ageTier: AgeGroup[];
}

export interface TechComponent {
  id: string;
  name: string;
  simpleName: string;
  iconName: string;
  category: 'hardware' | 'network' | 'security' | 'software';
  shortDuty: string;
  funFact: string;
}

export interface MissionMetadata {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  accentBg: string;
  minStars: number;
}
