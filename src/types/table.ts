// src/types/table.ts - TYPE DEFINITIONS ONLY
export interface Player {
  id: string;
  username: string;
  avatar_url?: string;
  chips: number;
  position: number;
  isDealer?: boolean;
  isBigBlind?: boolean;
  isSmallBlind?: boolean;
  cards?: string[];
  hasActed?: boolean;
  action?: 'fold' | 'call' | 'raise' | 'check' | 'all-in';
  isActive: boolean;
  lastSeen: Date;
}

export interface Spectator {
  id: string;
  username: string;
  avatar_url?: string;
  joinedAt: Date;
}

export interface GameTable {
  id: string;
  templateId: string;
  name: string;
  gameType: 'no-limit-holdem' | 'limit-holdem' | 'tournament';
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  buyInMin: number;
  buyInMax: number;
  status: 'waiting' | 'active' | 'finished';
  players: Player[];
  spectators: Spectator[];
  currentPot: number;
  communityCards: string[];
  gamePhase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  currentPlayer?: string;
  dealerPosition: number;
  createdAt: Date;
  lastActivity: Date;
}

export interface TableTemplate {
  id: string;
  name: string;
  description: string;
  gameType: 'no-limit-holdem' | 'limit-holdem' | 'tournament';
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  buyInMin: number;
  buyInMax: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'high-stakes';
  aiPersonalities: string[];
  tableImage: string;
}