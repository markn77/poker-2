import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';

// Mock data for active tables - replace with real data later
const mockTables = [
  {
    id: 1,
    name: "High Stakes Championship",
    players: 6,
    maxPlayers: 9,
    blinds: "50/100",
    buyIn: 10000,
    gameType: "No Limit Hold'em",
    status: "active",
    tableImage: "/poker_hand.png",
    playerAvatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face"
    ]
  },
  {
    id: 2,
    name: "Beginner's Paradise",
    players: 4,
    maxPlayers: 6,
    blinds: "5/10",
    buyIn: 500,
    gameType: "No Limit Hold'em",
    status: "active",
    tableImage: "/poker_hand.png",
    playerAvatars: [
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face"
    ]
  },
  {
    id: 3,
    name: "Tournament Final Table",
    players: 8,
    maxPlayers: 8,
    blinds: "200/400",
    buyIn: 2500,
    gameType: "Tournament",
    status: "active",
    tableImage: "/poker_hand.png",
    playerAvatars: [
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face"
    ]
  },
  {
    id: 4,
    name: "Quick Cash Game",
    players: 3,
    maxPlayers: 6,
    blinds: "10/20",
    buyIn: 1000,
    gameType: "No Limit Hold'em",
    status: "active",
    tableImage: "/poker_hand.png",
    playerAvatars: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=60&h=60&fit=crop&crop=face"
    ]
  },
  {
    id: 5,
    name: "VIP Exclusive Room",
    players: 9,
    maxPlayers: 9,
    blinds: "100/200",
    buyIn: 25000,
    gameType: "No Limit Hold'em",
    status: "full",
    tableImage: "/poker_hand.png",
    playerAvatars: [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502767089025-6572583495b5?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1541647376583-8934aaf3448a?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=60&h=60&fit=crop&crop=face"
    ]
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b-2 border-poker-gold shadow-lg">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-poker-gold to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">♠️</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-poker-gold to-yellow-400 bg-clip-text text-transparent">
              PokerAI Pro
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 hover:border-poker-gold transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-poker-gold to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-semibold text-lg">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:block font-medium text-white">{user?.username}</span>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                <div className="py-2">
                  <button
                    onClick={goToProfile}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </span>
                  </button>
                  <hr className="my-1 border-gray-700" />
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </span>
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">
            Welcome back, <span className="text-poker-gold">{user?.username}</span>!
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose from our active poker tables and start playing with AI-powered analysis to improve your game
          </p>
        </div>

        {/* Active Tables Section */}
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-poker-gold to-transparent"></div>
            <h2 className="text-3xl font-bold text-white mx-6">Active Tables</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-poker-gold to-transparent"></div>
          </div>

          {/* Tables List */}
          <div className="space-y-6">
            {mockTables.map((table) => (
              <div
                key={table.id}
                className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-poker-gold transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Table Image */}
                  <div className="lg:w-1/3 relative">
                    <img 
                      src={table.tableImage} 
                      alt={`${table.name} poker table`}
                      className="w-full h-48 lg:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        table.status === 'active' 
                          ? 'bg-green-600 text-green-100' 
                          : 'bg-red-600 text-red-100'
                      }`}>
                        {table.status === 'active' ? 'Active' : 'Full'}
                      </span>
                    </div>
                  </div>

                  {/* Table Info */}
                  <div className="lg:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      {/* Table Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {table.name}
                          </h3>
                          <p className="text-poker-gold text-lg font-semibold">{table.gameType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-poker-gold">${table.buyIn.toLocaleString()}</p>
                          <p className="text-gray-400">Buy-in</p>
                        </div>
                      </div>

                      {/* Game Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-white">{table.players}</p>
                          <p className="text-gray-400 text-sm">Players</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-white">{table.maxPlayers}</p>
                          <p className="text-gray-400 text-sm">Max Seats</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-poker-gold">${table.blinds}</p>
                          <p className="text-gray-400 text-sm">Blinds</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-green-400">{Math.round((table.players / table.maxPlayers) * 100)}%</p>
                          <p className="text-gray-400 text-sm">Full</p>
                        </div>
                      </div>

                      {/* Player Avatars */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <p className="text-gray-400 mr-3">Players at table:</p>
                          <div className="flex -space-x-2">
                            {table.playerAvatars.map((avatar, index) => (
                              <img
                                key={index}
                                src={avatar}
                                alt={`Player ${index + 1}`}
                                className="w-10 h-10 rounded-full border-2 border-gray-700 hover:border-poker-gold transition-colors"
                              />
                            ))}
                            {table.players < table.maxPlayers && (
                              <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                                <span className="text-gray-600 text-lg">+</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Join Button */}
                        <Button
                          onClick={() => handleJoinTable(table.id)}
                          disabled={table.status === 'full'}
                          className={`px-8 py-3 text-lg font-semibold ${
                            table.status === 'full' 
                              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                          } transition-all duration-200`}
                        >
                          {table.status === 'full' ? 'Table Full' : 'Join Table'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-poker-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Games Played</h3>
            <p className="text-3xl font-bold text-poker-gold">0</p>
            <p className="text-gray-400 text-sm mt-2">Start playing to see stats</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Win Rate</h3>
            <p className="text-3xl font-bold text-green-400">--%</p>
            <p className="text-gray-400 text-sm mt-2">Join a game to start tracking</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Insights</h3>
            <p className="text-3xl font-bold text-blue-400">0</p>
            <p className="text-gray-400 text-sm mt-2">Play to get AI recommendations</p>
          </div>
        </div>
      </main>
    </div>
  );
};