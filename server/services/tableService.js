// server/services/tableService.js
console.log('🔧 DEBUG: Loading tableService.js');
class TableService {
  static activeTables = new Map();
  
  // Table templates
  static TABLE_TEMPLATES = [
    {
      id: 'beginner-friendly',
      name: "Beginner's Paradise",
      description: "Perfect for new players learning the ropes",
      gameType: 'no-limit-holdem',
      maxPlayers: 6,
      smallBlind: 5,
      bigBlind: 10,
      buyInMin: 200,
      buyInMax: 1000,
      skillLevel: 'beginner',
      aiPersonalities: ['conservative', 'teaching'],
      tableImage: '/poker_table_green.png'
    },
    {
      id: 'casual-cash',
      name: "Casual Cash Game",
      description: "Relaxed atmosphere for friendly competition",
      gameType: 'no-limit-holdem',
      maxPlayers: 8,
      smallBlind: 10,
      bigBlind: 20,
      buyInMin: 500,
      buyInMax: 2000,
      skillLevel: 'intermediate',
      aiPersonalities: ['balanced', 'social'],
      tableImage: '/poker_table_blue.png'
    },
    {
      id: 'high-stakes',
      name: "High Stakes Championship",
      description: "For experienced players seeking big wins",
      gameType: 'no-limit-holdem',
      maxPlayers: 9,
      smallBlind: 50,
      bigBlind: 100,
      buyInMin: 5000,
      buyInMax: 25000,
      skillLevel: 'high-stakes',
      aiPersonalities: ['aggressive', 'analytical'],
      tableImage: '/poker_table_gold.png'
    },
    {
      id: 'tournament-style',
      name: "Tournament Training",
      description: "Practice tournament strategy",
      gameType: 'tournament',
      maxPlayers: 8,
      smallBlind: 25,
      bigBlind: 50,
      buyInMin: 1000,
      buyInMax: 1000,
      skillLevel: 'intermediate',
      aiPersonalities: ['tournament', 'adaptive'],
      tableImage: '/poker_table_red.png'
    },
    {
      id: 'quick-play',
      name: "Quick Play",
      description: "Fast-paced games for busy schedules",
      gameType: 'no-limit-holdem',
      maxPlayers: 6,
      smallBlind: 25,
      bigBlind: 50,
      buyInMin: 1000,
      buyInMax: 5000,
      skillLevel: 'intermediate',
      aiPersonalities: ['fast', 'aggressive'],
      tableImage: '/poker_table_purple.png'
    },
    {
      id: 'vip-exclusive',
      name: "VIP Exclusive Room",
      description: "Premium experience for serious players",
      gameType: 'no-limit-holdem',
      maxPlayers: 9,
      smallBlind: 100,
      bigBlind: 200,
      buyInMin: 10000,
      buyInMax: 50000,
      skillLevel: 'advanced',
      aiPersonalities: ['professional', 'unpredictable'],
      tableImage: '/poker_table_black.png'
    }
  ];

  // Initialize predefined tables
  static initializeTables() {
    console.log('Initializing poker tables...');
    this.TABLE_TEMPLATES.forEach(template => {
      const table = this.createTableFromTemplate(template);
      this.activeTables.set(table.id, table);
      console.log(`Created table: ${template.name}`);
    });
    
    // Set up cleanup interval
    setInterval(() => {
      this.cleanupInactiveTables();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Create new table from template
  static createTableFromTemplate(template) {
    const tableId = `${template.id}-${Date.now()}`;
    
    return {
      id: tableId,
      templateId: template.id,
      name: template.name,
      gameType: template.gameType,
      maxPlayers: template.maxPlayers,
      smallBlind: template.smallBlind,
      bigBlind: template.bigBlind,
      buyInMin: template.buyInMin,
      buyInMax: template.buyInMax,
      status: 'waiting',
      players: [],
      spectators: [],
      currentPot: 0,
      communityCards: [],
      gamePhase: 'preflop',
      dealerPosition: 0,
      createdAt: new Date(),
      lastActivity: new Date()
    };
  }

  // Get all active tables
  static getActiveTables() {
    return Array.from(this.activeTables.values());
  }

  // Get table by ID
  static getTable(tableId) {
    return this.activeTables.get(tableId);
  }

  // Join as spectator
  static joinAsSpectator(tableId, user) {
    const table = this.activeTables.get(tableId);
    if (!table) return false;
    
    // Check if already spectating or playing
    if (table.spectators.find(s => s.id === user.id) || 
        table.players.find(p => p.id === user.id)) {
      return true;
    }
    
    table.spectators.push({
      id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      joinedAt: new Date()
    });
    
    table.lastActivity = new Date();
    console.log(`User ${user.username} joined table ${table.name} as spectator`);
    return true;
  }

  // Join as player
  static joinAsPlayer(tableId, user, buyInAmount) {
    const table = this.activeTables.get(tableId);
    if (!table) {
      return { success: false, error: 'Table not found' };
    }
    
    // Check if table is full
    if (table.players.length >= table.maxPlayers) {
      return { success: false, error: 'Table is full' };
    }
    
    // Validate buy-in
    if (buyInAmount < table.buyInMin || buyInAmount > table.buyInMax) {
      return { 
        success: false, 
        error: `Buy-in must be between $${table.buyInMin} and $${table.buyInMax}` 
      };
    }
    
    // Check if already playing
    if (table.players.find(p => p.id === user.id)) {
      return { success: false, error: 'Already playing at this table' };
    }
    
    // Find available position
    const occupiedPositions = new Set(table.players.map(p => p.position));
    let position = 0;
    for (let i = 0; i < table.maxPlayers; i++) {
      if (!occupiedPositions.has(i)) {
        position = i;
        break;
      }
    }
    
    // Add player
    const player = {
      id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      chips: buyInAmount,
      position,
      isActive: true,
      hasActed: false,
      lastSeen: new Date()
    };
    
    table.players.push(player);
    
    // Remove from spectators if they were spectating
    table.spectators = table.spectators.filter(s => s.id !== user.id);
    
    // Start game if minimum players reached
    if (table.players.length >= 2 && table.status === 'waiting') {
      table.status = 'active';
      this.startNewHand(table);
    }
    
    table.lastActivity = new Date();
    console.log(`User ${user.username} joined table ${table.name} as player with $${buyInAmount}`);
    
    return { success: true, position };
  }

  // Leave table
  static leaveTable(tableId, userId) {
    const table = this.activeTables.get(tableId);
    if (!table) return false;
    
    // Remove from players
    const playerIndex = table.players.findIndex(p => p.id === userId);
    if (playerIndex !== -1) {
      const player = table.players[playerIndex];
      console.log(`Player ${player.username} left table ${table.name}`);
      table.players.splice(playerIndex, 1);
      
      // If too few players, pause the game
      if (table.players.length < 2 && table.status === 'active') {
        table.status = 'waiting';
      }
    }
    
    // Remove from spectators
    table.spectators = table.spectators.filter(s => s.id !== userId);
    
    table.lastActivity = new Date();
    return true;
  }

  // Create duplicate table when one fills up
  static createDuplicateTable(templateId) {
    const template = this.TABLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return null;
    
    const newTable = this.createTableFromTemplate(template);
    this.activeTables.set(newTable.id, newTable);
    
    console.log(`Created duplicate table: ${template.name} (${newTable.id})`);
    return newTable;
  }

  // Get table templates
  static getTableTemplates() {
    return this.TABLE_TEMPLATES;
  }

  // Clean up inactive tables
  static cleanupInactiveTables() {
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes
    let cleanedUp = 0;
    
    // Convert to array to avoid iteration issues
    const entries = Array.from(this.activeTables.entries());
    
    for (const [tableId, table] of entries) {
      if (table.players.length === 0 && table.lastActivity < cutoffTime) {
        this.activeTables.delete(tableId);
        cleanedUp++;
      }
    }
    
    if (cleanedUp > 0) {
      console.log(`Cleaned up ${cleanedUp} inactive tables`);
    }
    
    // Ensure we always have at least one table of each template
    this.TABLE_TEMPLATES.forEach(template => {
      const hasActiveTable = Array.from(this.activeTables.values())
        .some(table => table.templateId === template.id);
      
      if (!hasActiveTable) {
        const newTable = this.createTableFromTemplate(template);
        this.activeTables.set(newTable.id, newTable);
        console.log(`Recreated missing table: ${template.name}`);
      }
    });
  }

  // Start new hand
  static startNewHand(table) {
    // Reset hand state
    table.currentPot = 0;
    table.communityCards = [];
    table.gamePhase = 'preflop';
    
    // Reset player states
    table.players.forEach(player => {
      player.hasActed = false;
      player.action = undefined;
      player.cards = [];
    });
    
    // Set blinds and dealer
    this.setBlindsAndDealer(table);
    
    console.log(`Started new hand at table ${table.name}`);
  }

  // Set blinds and dealer positions
  static setBlindsAndDealer(table) {
    if (table.players.length < 2) return;
    
    // Move dealer position
    table.dealerPosition = (table.dealerPosition + 1) % table.players.length;
    
    // Clear previous positions
    table.players.forEach(player => {
      player.isDealer = false;
      player.isBigBlind = false;
      player.isSmallBlind = false;
    });
    
    // Set new positions
    table.players[table.dealerPosition].isDealer = true;
    
    if (table.players.length === 2) {
      // Heads up: dealer is small blind
      table.players[table.dealerPosition].isSmallBlind = true;
      table.players[(table.dealerPosition + 1) % 2].isBigBlind = true;
    } else {
      // Multi-way: dealer, small blind, big blind
      const sbPosition = (table.dealerPosition + 1) % table.players.length;
      const bbPosition = (table.dealerPosition + 2) % table.players.length;
      
      table.players[sbPosition].isSmallBlind = true;
      table.players[bbPosition].isBigBlind = true;
    }
  }
}

// Initialize tables when service loads
console.log('🔧 DEBUG: About to initialize tables');
TableService.initializeTables();
console.log('🔧 DEBUG: Tables initialized');

module.exports = TableService;