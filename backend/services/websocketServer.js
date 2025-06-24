const WebSocket = require('ws');
const realTimeService = require('./realTimeService');

class WebSocketServer {
  constructor() {
    this.wss = null;
    this.server = null;
  }

  // Initialize WebSocket server
  initialize(server) {
    try {
      console.log('🔄 Initializing WebSocket server...');
      
      this.server = server;
      this.wss = new WebSocket.Server({ 
        server: server,
        path: '/ws',
        perMessageDeflate: false
      });

      this.wss.on('connection', (ws, request) => {
        console.log('📡 New WebSocket connection from:', request.socket.remoteAddress);
        
        // Add client to real-time service
        realTimeService.addClient(ws);

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connection',
          message: 'Connected to real-time updates',
          timestamp: new Date()
        }));

        // Handle incoming messages
        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message);
            await this.handleMessage(ws, data);
          } catch (error) {
            console.error('Error handling WebSocket message:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format',
              timestamp: new Date()
            }));
          }
        });

        // Handle connection close
        ws.on('close', (code, reason) => {
          console.log(`📡 WebSocket connection closed: ${code} - ${reason}`);
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
        });
      });

      this.wss.on('error', (error) => {
        console.error('WebSocket Server error:', error);
      });

      console.log('✅ WebSocket server initialized on /ws');
      return this.wss;
    } catch (error) {
      console.error('❌ Error initializing WebSocket server:', error);
      throw error;
    }
  }

  // Handle incoming WebSocket messages
  async handleMessage(ws, data) {
    try {
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date()
          }));
          break;

        case 'get_stats':
          const stats = await realTimeService.getRealTimeStats();
          ws.send(JSON.stringify({
            type: 'stats',
            data: stats,
            timestamp: new Date()
          }));
          break;

        case 'subscribe':
          // Handle subscription to specific events
          ws.send(JSON.stringify({
            type: 'subscribed',
            subscription: data.subscription || 'all',
            timestamp: new Date()
          }));
          break;

        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${data.type}`,
            timestamp: new Date()
          }));
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Internal server error',
        timestamp: new Date()
      }));
    }
  }

  // Broadcast message to all connected clients
  broadcast(message) {
    if (!this.wss) return;

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Get server statistics
  getStats() {
    if (!this.wss) return null;

    return {
      connectedClients: this.wss.clients.size,
      serverRunning: true,
      timestamp: new Date()
    };
  }

  // Close WebSocket server
  close() {
    if (this.wss) {
      console.log('🔄 Closing WebSocket server...');
      this.wss.close(() => {
        console.log('✅ WebSocket server closed');
      });
    }
  }
}

// Create singleton instance
const websocketServer = new WebSocketServer();

module.exports = websocketServer;
