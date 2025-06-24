const mongoose = require('mongoose');
const User = require('../models/User');
const Services = require('../models/Services');
const Application = require('../models/Application');

class RealTimeService {
  constructor() {
    this.changeStreams = new Map();
    this.clients = new Set();
  }

  // Initialize change streams for real-time monitoring
  async initializeChangeStreams() {
    try {
      console.log('🔄 Initializing MongoDB Change Streams...');

      // Watch User collection changes
      const userChangeStream = User.watch([], { fullDocument: 'updateLookup' });
      userChangeStream.on('change', (change) => {
        this.handleUserChange(change);
      });
      userChangeStream.on('error', (error) => {
        console.error('❌ User change stream error:', error.message);
        this.reconnectChangeStream('users', User);
      });
      this.changeStreams.set('users', userChangeStream);

      // Watch Services collection changes
      const servicesChangeStream = Services.watch([], { fullDocument: 'updateLookup' });
      servicesChangeStream.on('change', (change) => {
        this.handleServicesChange(change);
      });
      servicesChangeStream.on('error', (error) => {
        console.error('❌ Services change stream error:', error.message);
        this.reconnectChangeStream('services', Services);
      });
      this.changeStreams.set('services', servicesChangeStream);

      // Watch Application collection changes
      const applicationChangeStream = Application.watch([], { fullDocument: 'updateLookup' });
      applicationChangeStream.on('change', (change) => {
        this.handleApplicationChange(change);
      });
      applicationChangeStream.on('error', (error) => {
        console.error('❌ Application change stream error:', error.message);
        this.reconnectChangeStream('applications', Application);
      });
      this.changeStreams.set('applications', applicationChangeStream);

      console.log('✅ Change Streams initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing change streams:', error);
      throw error;
    }
  }

  // Handle user collection changes
  handleUserChange(change) {
    const eventData = {
      type: 'user_change',
      operation: change.operationType,
      timestamp: new Date(),
      data: change.fullDocument || change.documentKey
    };

    console.log(`👤 User ${change.operationType}:`, change.documentKey);
    this.broadcastToClients(eventData);
  }

  // Handle services collection changes
  handleServicesChange(change) {
    const eventData = {
      type: 'services_change',
      operation: change.operationType,
      timestamp: new Date(),
      data: change.fullDocument || change.documentKey
    };

    console.log(`💼 Services ${change.operationType}:`, change.documentKey);
    this.broadcastToClients(eventData);
  }

  // Handle application collection changes
  handleApplicationChange(change) {
    const eventData = {
      type: 'application_change',
      operation: change.operationType,
      timestamp: new Date(),
      data: change.fullDocument || change.documentKey
    };

    console.log(`📄 Application ${change.operationType}:`, change.documentKey);
    this.broadcastToClients(eventData);
  }

  // Broadcast events to all connected clients
  broadcastToClients(eventData) {
    this.clients.forEach(client => {
      try {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify(eventData));
        }
      } catch (error) {
        console.error('Error broadcasting to client:', error);
        this.clients.delete(client);
      }
    });
  }

  // Add a client for real-time updates
  addClient(client) {
    this.clients.add(client);
    console.log(`📡 Client connected. Total clients: ${this.clients.size}`);

    client.on('close', () => {
      this.clients.delete(client);
      console.log(`📡 Client disconnected. Total clients: ${this.clients.size}`);
    });

    client.on('error', (error) => {
      console.error('Client error:', error);
      this.clients.delete(client);
    });
  }

  // Get real-time statistics
  async getRealTimeStats() {
    try {
      const stats = {
        timestamp: new Date(),
        users: {
          total: await User.countDocuments(),
          jobseekers: await User.countDocuments({ user_type: 'jobseeker' }),
          recruiters: await User.countDocuments({ user_type: 'recruiter' })
        },
        services: {
          total: await Services.countDocuments(),
          active: await Services.countDocuments({ status: 'active' }),
          closed: await Services.countDocuments({ status: 'closed' })
        },
        applications: {
          total: await Application.countDocuments(),
          applied: await Application.countDocuments({ status: 'applied' }),
          shortlisted: await Application.countDocuments({ status: 'shortlisted' }),
          hired: await Application.countDocuments({ status: 'hired' })
        },
        connectedClients: this.clients.size
      };

      return stats;
    } catch (error) {
      console.error('Error getting real-time stats:', error);
      throw error;
    }
  }

  // Close all change streams
  async closeChangeStreams() {
    console.log('🔄 Closing change streams...');
    for (const [name, stream] of this.changeStreams) {
      try {
        await stream.close();
        console.log(`✅ Closed ${name} change stream`);
      } catch (error) {
        console.error(`❌ Error closing ${name} change stream:`, error);
      }
    }
    this.changeStreams.clear();
  }

  // Reconnect a change stream after error
  async reconnectChangeStream(streamName, Model) {
    try {
      console.log(`🔄 Reconnecting ${streamName} change stream...`);

      // Close existing stream if it exists
      const existingStream = this.changeStreams.get(streamName);
      if (existingStream && !existingStream.closed) {
        await existingStream.close();
      }

      // Create new stream with error handling
      const newStream = Model.watch([], { fullDocument: 'updateLookup' });

      // Set up event handlers based on stream type
      if (streamName === 'users') {
        newStream.on('change', (change) => this.handleUserChange(change));
      } else if (streamName === 'services') {
        newStream.on('change', (change) => this.handleServicesChange(change));
      } else if (streamName === 'applications') {
        newStream.on('change', (change) => this.handleApplicationChange(change));
      }

      newStream.on('error', (error) => {
        console.error(`❌ ${streamName} change stream error:`, error.message);
        setTimeout(() => this.reconnectChangeStream(streamName, Model), 5000);
      });

      this.changeStreams.set(streamName, newStream);
      console.log(`✅ ${streamName} change stream reconnected`);
    } catch (error) {
      console.error(`❌ Failed to reconnect ${streamName} change stream:`, error);
      setTimeout(() => this.reconnectChangeStream(streamName, Model), 10000);
    }
  }

  // Get active change streams info
  getChangeStreamsInfo() {
    const info = {};
    for (const [name, stream] of this.changeStreams) {
      info[name] = {
        closed: stream.closed,
        resumeToken: stream.resumeToken
      };
    }
    return info;
  }
}

// Create singleton instance
const realTimeService = new RealTimeService();

module.exports = realTimeService;
