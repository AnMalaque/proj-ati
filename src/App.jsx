  import React, { useState, useEffect } from 'react';
  import { Activity, Plus, Trash2, Globe, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

  export default function UptimeMonitor() {
    const [monitors, setMonitors] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMonitor, setNewMonitor] = useState({
      name: '',
      url: '',
      interval: 60
    });

    // Simulate monitoring checks
    useEffect(() => {
      const interval = setInterval(() => {
        setMonitors(prev => prev.map(monitor => ({
          ...monitor,
          lastChecked: new Date().toISOString(),
          responseTime: Math.floor(Math.random() * 500) + 50,
          status: Math.random() > 0.1 ? 'up' : 'down',
          uptime: Math.random() > 0.1 ? Math.min(monitor.uptime + 0.1, 100) : monitor.uptime - 5
        })));
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    const addMonitor = () => {
      if (!newMonitor.name || !newMonitor.url) return;

      const monitor = {
        id: Date.now(),
        name: newMonitor.name,
        url: newMonitor.url,
        interval: newMonitor.interval,
        status: 'checking',
        uptime: 100,
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setMonitors([...monitors, monitor]);
      setNewMonitor({ name: '', url: '', interval: 60 });
      setShowAddForm(false);
    };

    const deleteMonitor = (id) => {
      setMonitors(monitors.filter(m => m.id !== id));
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'up': return 'text-green-600 bg-green-50';
        case 'down': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusIcon = (status) => {
      switch(status) {
        case 'up': return <CheckCircle className="w-5 h-5" />;
        case 'down': return <XCircle className="w-5 h-5" />;
        default: return <AlertCircle className="w-5 h-5" />;
      }
    };

    const formatTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString();
    };

    return (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Uptime Monitor</h1>
                  <p className="text-sm text-gray-600">HTTP Endpoint Monitoring</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Monitor
              </button>
            </div>
          </div>

          {/* Add Monitor Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Add New Monitor</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monitor Name
                  </label>
                  <input
                    type="text"
                    value={newMonitor.name}
                    onChange={(e) => setNewMonitor({...newMonitor, name: e.target.value})}
                    placeholder="My Website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newMonitor.url}
                    onChange={(e) => setNewMonitor({...newMonitor, url: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={newMonitor.interval}
                    onChange={(e) => setNewMonitor({...newMonitor, interval: parseInt(e.target.value)})}
                    min="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addMonitor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Monitor
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Monitors List */}
          {monitors.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No monitors yet</h3>
              <p className="text-gray-600 mb-4">Add your first HTTP endpoint to start monitoring</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Monitor
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {monitors.map(monitor => (
                <div key={monitor.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{monitor.name}</h3>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(monitor.status)}`}>
                          {getStatusIcon(monitor.status)}
                          {monitor.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {monitor.url}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMonitor(monitor.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Uptime</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{monitor.uptime.toFixed(1)}%</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Response Time</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{monitor.responseTime}ms</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-medium">Last Checked</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{formatTime(monitor.lastChecked)}</p>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Check interval: {monitor.interval}s
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    );
  }