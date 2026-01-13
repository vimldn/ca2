'use client';

import { useState } from 'react';
import { grammarSchools, stateSchools, calculateDistance } from '@/lib/schools';

export default function Home() {
  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locationInfo, setLocationInfo] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('grammar');

  async function lookupPostcode(postcodeValue) {
    // Clean the postcode - remove spaces
    const cleanPostcode = postcodeValue.replace(/\s+/g, '');
    
    const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
    const data = await response.json();
    
    if (data.status !== 200 || !data.result) {
      throw new Error('Invalid postcode');
    }
    
    return data.result;
  }

  async function handleSearch(e) {
    e.preventDefault();
    
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResults(null);
    setLocationInfo(null);

    try {
      const postcodeData = await lookupPostcode(postcode);
      
      const { latitude, longitude, admin_district, region, postcode: formattedPostcode } = postcodeData;

      setLocationInfo({
        postcode: formattedPostcode,
        district: admin_district || 'N/A',
        region: region || 'N/A',
      });

      // Calculate distances to grammar schools
      const grammarWithDistance = grammarSchools
        .map(school => ({
          ...school,
          distance: calculateDistance(latitude, longitude, school.lat, school.lng)
        }))
        .filter(s => s.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      // Calculate distances to state schools
      const stateWithDistance = stateSchools
        .map(school => ({
          ...school,
          distance: calculateDistance(latitude, longitude, school.lat, school.lng)
        }))
        .filter(s => s.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      setResults({
        grammar: grammarWithDistance,
        state: stateWithDistance,
      });

      setSuccess(`Found ${grammarWithDistance.length} grammar schools and ${stateWithDistance.length} state schools within ${radius} miles`);

    } catch (err) {
      console.error('Postcode lookup error:', err);
      setError('Invalid postcode or unable to lookup. Please check and try again.');
    } finally {
      setLoading(false);
    }
  }

  const currentSchools = results ? (activeTab === 'grammar' ? results.grammar : results.state) : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30">
              🎓
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              UK School Finder
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Find state and grammar schools near your postcode
          </p>
        </header>

        {/* Search Box */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="postcode" className="block text-slate-400 text-sm font-medium mb-2">
                Enter your postcode
              </label>
              <input
                type="text"
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                placeholder="e.g. SW1A 1AA or UB8 1JR"
                className="w-full px-4 py-3 text-lg bg-black/25 border-2 border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
            <div className="sm:w-40">
              <label htmlFor="radius" className="block text-slate-400 text-sm font-medium mb-2">
                Search radius
              </label>
              <select
                id="radius"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full px-4 py-3 text-lg bg-black/25 border-2 border-white/10 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={15}>15 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </div>
            <div className="sm:self-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Searching...' : 'Search Schools'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 px-4 py-3 bg-red-500/15 border border-red-500/25 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-4 px-4 py-3 bg-green-500/15 border border-green-500/25 rounded-xl text-green-300">
              {success}
            </div>
          )}
        </div>

        {/* Location Info */}
        {locationInfo && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 flex flex-wrap gap-8">
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider">Postcode</span>
              <div className="font-semibold text-lg text-blue-400">{locationInfo.postcode}</div>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider">District</span>
              <div className="font-semibold text-lg text-white">{locationInfo.district}</div>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider">Region</span>
              <div className="font-semibold text-lg text-white">{locationInfo.region}</div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('grammar')}
                className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                  activeTab === 'grammar'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                Grammar Schools ({results.grammar.length})
              </button>
              <button
                onClick={() => setActiveTab('state')}
                className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                  activeTab === 'state'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                State Schools ({results.state.length})
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4 text-amber-300 text-sm">
              {activeTab === 'grammar' ? (
                <>⚠️ Grammar schools use entrance exams (11+) for admission - distance is for reference only. Contact schools directly for exam dates and catchment requirements.</>
              ) : (
                <>⚠️ Catchment areas vary by local authority. This shows proximity only - contact your local council or individual schools for official catchment boundaries.</>
              )}
            </div>

            {/* School List */}
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] overflow-hidden">
              {currentSchools.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <div className="text-5xl mb-4">📭</div>
                  <p>No {activeTab} schools found within {radius} miles.<br />Try increasing the search radius.</p>
                </div>
              ) : (
                currentSchools.map((school, index) => (
                  <div
                    key={index}
                    className="px-5 py-4 border-b border-white/5 last:border-b-0 flex justify-between items-center hover:bg-white/[0.03] transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-100 mb-1">{school.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-3 flex-wrap">
                        <span>📍 {school.la}</span>
                        {school.type && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            school.type === 'Boys' ? 'bg-blue-500/20 text-blue-400' :
                            school.type === 'Girls' ? 'bg-pink-500/20 text-pink-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {school.type}
                          </span>
                        )}
                        {school.phase && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-400">
                            {school.phase}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-xl font-bold ${
                        school.distance < 3 ? 'text-green-400' :
                        school.distance < 7 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {school.distance.toFixed(1)} mi
                      </div>
                      <div className="text-xs text-slate-500">
                        {(school.distance * 1.609).toFixed(1)} km
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-white/[0.02] rounded-xl text-center text-sm text-slate-500">
              Data sourced from Get Information About Schools (GIAS). Distances are approximate (as the crow flies).<br />
              Always verify catchment areas with your local authority or individual schools before applying.
            </div>
          </div>
        )}

        {/* Initial State */}
        {!results && !loading && (
          <div className="text-center py-16 text-slate-500">
            <div className="text-6xl mb-4">🏫</div>
            <p>Enter your postcode above to find nearby schools</p>
          </div>
        )}
      </div>
    </main>
  );
}
