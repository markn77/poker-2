import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';

// Mock data for active tables - replace with real data later
const mockTables = [
  {
    id: 1,
    name: "High Stakes Hold'em",
    players: 6,
    maxPlayers: 9,
    blinds: "5/10",
    buyIn: 1000,
    gameType: "No Limit Hold'em",
    status: "active"
  },
  {
    id: 2,
    name: "Beginner Friendly",
    players: 4,
    maxPlayers: 6,
    blinds: "1/2",
    buyIn: 200,
    gameType: "No Limit Hold'em",
    status: "active"
  },
  {
    id: 3,
    name: "Tournament Final",
    players: 8,
    maxPlayers: 8,
    blinds: "25/50",
    buyIn: 500,
    gameType: "Tournament",
    status: "active"
  },
  {
    id: 4,
    name: "Quick Play",
    players: 2,
    maxPlayers: 4,
    blinds: "0.5/1",
    buyIn: 100,
    gameType: "No Limit Hold'em",
    status: "active"
  },
  {
    id: 5,
    name: "Pro League",
    players: 9,
    maxPlayers: 9,
    blinds: "10/20",
    buyIn: 2000,
    gameType: "No Limit Hold'em",
    status: "full"
  }
];

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleJoinTable = (tableId: number) => {
    console.log(`Joining table ${tableId}`);
    // TODO: Implement join table logic
  };

  const goToProfile = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-poker-green">
      {/* Header */}
      <header className="p-6 border-b border-gray-700">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-poker-gold">
            PokerAI Pro
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 bg-poker-gold rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-semibold text-lg">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:block font-medium">{user?.username}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                <div className="py-2">
                  <button
                    onClick={goToProfile}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-400">
            Choose a table to join and start playing poker with AI analysis
          </p>
        </div>

        {/* Active Tables Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Active Tables</h2>
            <Button className="bg-green-600 hover:bg-green-700">
              Create New Table
            </Button>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTables.map((table) => (
              <div
                key={table.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-poker-gold transition-colors"
              >
                {/* Table Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {table.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{table.gameType}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    table.status === 'active' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {table.status === 'active' ? 'Active' : 'Full'}
                  </span>
                </div>

                {/* Table Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Players:</span>
                    <span className="text-white">{table.players}/{table.maxPlayers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Blinds:</span>
                    <span className="text-white">${table.blinds}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Buy-in:</span>
                    <span className="text-poker-gold font-medium">${table.buyIn}</span>
                  </div>
                </div>

                {/* Players Indicator */}
                <div className="flex mb-4">
                  {Array.from({ length: table.maxPlayers }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full mr-1 flex items-center justify-center ${
                        index < table.players
                          ? 'bg-green-600'
                          : 'bg-gray-600'
                      }`}
                    >
                      {index < table.players && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Join Button */}
                <Button
                  onClick={() => handleJoinTable(table.id)}
                  disabled={table.status === 'full'}
                  className={`w-full ${
                    table.status === 'full' 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  {table.status === 'full' ? 'Table Full' : 'Join Table'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Games Played</h3>
            <p className="text-3xl font-bold text-poker-gold">0</p>
            <p className="text-gray-400 text-sm">Start playing to see stats</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Win Rate</h3>
            <p className="text-3xl font-bold text-green-400">--%</p>
            <p className="text-gray-400 text-sm">Join a game to start tracking</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">AI Insights</h3>
            <p className="text-3xl font-bold text-blue-400">0</p>
            <p className="text-gray-400 text-sm">Play to get AI recommendations</p>
          </div>
        </div>
      </main>
    </div>
  );
};