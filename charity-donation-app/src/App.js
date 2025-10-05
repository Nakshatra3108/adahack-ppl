import React, { useState, useEffect } from 'react';
import { Heart, Trophy, X, Users, TrendingUp, LogOut, Info } from 'lucide-react';
import { authAPI, donationAPI, leaderboardAPI } from './api';

// Audio (from public/)
const walkAudio = new Audio('/sounds/walk.mp3');
const interactAudio = new Audio('/sounds/interact.mp3');
const donateAudio = new Audio('/sounds/donate.mp3');

// Image paths (from public/)
const backgroundImage = process.env.PUBLIC_URL + '/images/background.jpg';
const defaultStallImage = process.env.PUBLIC_URL + '/images/stall.png';


// All charities from Postcode Lottery organized by trusts
const charityGroups = {
  animal: {
    name: "Postcode Animal Trust",
    icon: "/images/animal.png",
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-600",
    description: "Supporting animal welfare across the UK",
    charities: [
      { id: 1, name: "Battersea Dogs & Cats Home", impact: { amount: 25, description: "provide care for 1 rescue dog for a day" } },
      { id: 2, name: "Cats Protection", impact: { amount: 20, description: "feed 3 rescue cats for a week" } },
      { id: 3, name: "Dogs Trust", impact: { amount: 30, description: "provide veterinary care for 2 dogs" } },
      { id: 4, name: "PDSA", impact: { amount: 35, description: "provide emergency treatment for 1 pet" } },
      { id: 5, name: "RSPCA", impact: { amount: 25, description: "rescue and rehabilitate 1 animal" } },
      { id: 6, name: "Guide Dogs", impact: { amount: 50, description: "support guide dog training for 1 week" } },
      { id: 7, name: "Blue Cross", impact: { amount: 30, description: "provide veterinary care for pets in need" } },
      { id: 8, name: "The Donkey Sanctuary", impact: { amount: 40, description: "care for rescued donkeys" } }
    ]
  },
  healthcare: {
    name: "Postcode Care Trust",
    icon: "/images/care.png",
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-600",
    description: "Supporting healthcare and wellbeing initiatives",
    charities: [
      { id: 9, name: "Alzheimer's Society", impact: { amount: 30, description: "fund 2 hours of dementia support" } },
      { id: 10, name: "Breast Cancer Now", impact: { amount: 40, description: "fund 1 hour of research" } },
      { id: 11, name: "Maggie's", impact: { amount: 35, description: "provide cancer support for 2 people" } },
      { id: 12, name: "Mind", impact: { amount: 25, description: "provide mental health support for 3 people" } },
      { id: 13, name: "RNIB", impact: { amount: 30, description: "provide sight loss support services" } },
      { id: 14, name: "Young Lives vs Cancer", impact: { amount: 45, description: "support 1 young person with cancer for a day" } },
      { id: 15, name: "Marie Curie", impact: { amount: 35, description: "provide palliative care" } },
      { id: 16, name: "Macmillan Cancer Support", impact: { amount: 40, description: "support cancer patients and families" } }
    ]
  },
  children: {
    name: "Postcode Children Trust",
    icon: "/images/children.png",
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-600",
    description: "Protecting and supporting children's futures",
    charities: [
      { id: 17, name: "Barnardo's", impact: { amount: 30, description: "support 5 vulnerable children for a day" } },
      { id: 18, name: "NSPCC", impact: { amount: 35, description: "fund 1 hour of Childline counseling" } },
      { id: 19, name: "Save the Children", impact: { amount: 40, description: "provide school supplies for 10 children" } },
      { id: 20, name: "Children in Need", impact: { amount: 25, description: "support disadvantaged children" } },
      { id: 21, name: "Place2Be", impact: { amount: 30, description: "provide mental health support for 2 children" } },
      { id: 22, name: "Action for Children", impact: { amount: 35, description: "support vulnerable families" } }
    ]
  },
  education: {
    name: "Postcode Education Trust",
    icon: "/images/education.png",
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-600",
    description: "Promoting education and literacy worldwide",
    charities: [
      { id: 23, name: "Room to Read", impact: { amount: 30, description: "provide education for 10 children" } },
      { id: 24, name: "Book Aid International", impact: { amount: 25, description: "send 20 books to developing countries" } },
      { id: 25, name: "Street Child", impact: { amount: 35, description: "provide schooling for children in crisis" } },
      { id: 26, name: "UNICEF UK", impact: { amount: 45, description: "provide learning materials for 15 children" } },
      { id: 27, name: "Teach First", impact: { amount: 40, description: "support education in disadvantaged areas" } }
    ]
  },
  environment: {
    name: "Postcode Green Trust",
    icon: "/images/environment.png",
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-600",
    description: "Protecting nature and green spaces",
    charities: [
      { id: 28, name: "Woodland Trust", impact: { amount: 20, description: "plant 25 trees" } },
      { id: 29, name: "Royal Botanic Gardens Kew", impact: { amount: 35, description: "fund plant conservation research" } },
      { id: 30, name: "The Royal Parks", impact: { amount: 30, description: "maintain green spaces" } },
      { id: 31, name: "Trees for Cities", impact: { amount: 25, description: "plant 30 urban trees" } },
      { id: 32, name: "Groundwork UK", impact: { amount: 30, description: "improve local green spaces" } }
    ]
  },
  earth: {
    name: "Postcode Earth Trust",
    icon: "/images/earth.png",
    color: "from-teal-500 to-teal-700",
    bgColor: "bg-teal-600",
    description: "Fighting climate change globally",
    charities: [
      { id: 33, name: "WWF-UK", impact: { amount: 35, description: "protect wildlife habitats" } },
      { id: 34, name: "Friends of the Earth", impact: { amount: 30, description: "fund environmental campaigns" } },
      { id: 35, name: "The Wildlife Trusts", impact: { amount: 30, description: "protect wildlife habitat" } },
      { id: 36, name: "National Trust", impact: { amount: 40, description: "conserve landscapes" } },
      { id: 37, name: "Greenpeace UK", impact: { amount: 45, description: "protect oceans and climate" } }
    ]
  },
  community: {
    name: "Postcode Community Trust",
    icon: "/images/community.png",
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-600",
    description: "Supporting local communities",
    charities: [
      { id: 38, name: "Age UK", impact: { amount: 25, description: "support elderly people" } },
      { id: 39, name: "Crisis", impact: { amount: 30, description: "help homeless people" } },
      { id: 40, name: "Shelter", impact: { amount: 35, description: "provide housing advice" } },
      { id: 41, name: "The Trussell Trust", impact: { amount: 20, description: "provide food bank support" } },
      { id: 42, name: "Citizens Advice", impact: { amount: 25, description: "provide advice services" } }
    ]
  },
  culture: {
    name: "Postcode Culture Trust",
    icon: "/images/culture.png",
    color: "from-violet-500 to-violet-700",
    bgColor: "bg-violet-600",
    description: "Supporting arts and culture",
    charities: [
      { id: 43, name: "National Theatre", impact: { amount: 40, description: "support theatre education" } },
      { id: 44, name: "Youth Music", impact: { amount: 25, description: "provide music education" } },
      { id: 45, name: "English Heritage", impact: { amount: 35, description: "preserve historic sites" } },
      { id: 46, name: "National Museums Scotland", impact: { amount: 30, description: "support exhibitions" } }
    ]
  },
  Sport: {
    name: "Postcode Sport Trust",
    icon: "/images/sport.png",
    color: "from-cyan-500 to-cyan-700",
    bgColor: "bg-cyan-600",
    description: "Promoting physical activity and sport",
    charities: [
      { id: 47, name: "StreetGames", impact: { amount: 30, description: "provide sports for young people" } },
      { id: 48, name: "Sport Relief", impact: { amount: 35, description: "support vulnerable people through sport" } },
      { id: 49, name: "Youth Sport Trust", impact: { amount: 25, description: "promote PE in schools" } },
      { id: 50, name: "SportsAid", impact: { amount: 40, description: "support young athletes" } }
    ]
  },
  global: {
    name: "Postcode Global Trust",
    icon: "/images/global.png",
    color: "from-indigo-500 to-indigo-700",
    bgColor: "bg-indigo-600",
    description: "Supporting international development",
    charities: [
      { id: 51, name: "Médecins Sans Frontières", impact: { amount: 50, description: "provide medical care in crisis zones" } },
      { id: 52, name: "WaterAid", impact: { amount: 35, description: "provide clean water for 15 people" } },
      { id: 53, name: "Oxfam GB", impact: { amount: 40, description: "provide emergency aid" } },
      { id: 54, name: "British Red Cross", impact: { amount: 45, description: "respond to emergencies worldwide" } },
      { id: 55, name: "ActionAid", impact: { amount: 35, description: "empower communities in poverty" } }
    ]
  }
};

const bannerIssues = [
  { id: 'animal', text: "Help Animals in Need - Support Animal Welfare", group: 'animal', icon: '/images/animal.png' },
  { id: 'homeless', text: "End Homelessness - Support Community Charities", group: 'community', icon: '/images/community.png' },
  { id: 'children', text: "Protect Children's Futures", group: 'children', icon: '/images/children.png' },
  { id: 'climate', text: "Combat Climate Change Today", group: 'earth', icon: '/images/earth.png' },
  { id: 'health', text: "Support Healthcare Access", group: 'healthcare', icon: '/images/care.png' },
  { id: 'education', text: "Give the Gift of Education", group: 'education', icon: '/images/education.png' }
];

const App = () => {
  const [currentView, setCurrentView] = useState('auth');
  const [user, setUser] = useState(null);
  const [characterPos, setCharacterPos] = useState({ x: 50, y: 50 });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [donationAmount, setDonationAmount] = useState(25);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [userDonations, setUserDonations] = useState([]);
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [charityLeaderboard, setCharityLeaderboard] = useState([]);
  const [hoveredStall, setHoveredStall] = useState(null); // mouse hover
  const [proximityStall, setProximityStall] = useState(null); // near-by via character
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const groupKeys = Object.keys(charityGroups);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentView('game');
      fetchUserDonations();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerIssues.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Movement & keyboard (added: play walk sound & space interaction)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (currentView !== 'game' || showDonationModal) return;

      const speed = 5;
      const key = e.key.toLowerCase();

      setCharacterPos(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (key === 'arrowleft' || key === 'a') {
          newX = Math.max(5, prev.x - speed);
        } else if (key === 'arrowright' || key === 'd') {
          newX = Math.min(95, prev.x + speed);
        } else if (key === 'arrowup' || key === 'w') {
          newY = Math.max(20, prev.y - speed);
        } else if (key === 'arrowdown' || key === 's') {
          newY = Math.min(80, prev.y + speed);
        }

        // play walking sound if moved
        if (newX !== prev.x || newY !== prev.y) {
          try { walkAudio.currentTime = 0; walkAudio.play(); } catch (err) { /* ignore autoplay errors */ }
        }

        return { x: newX, y: newY };
      });

      // Spacebar interaction: check proximity stall first, then hover stall
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const activeStall = proximityStall || hoveredStall;
        if (activeStall) {
          try { interactAudio.currentTime = 0; interactAudio.play(); } catch (err) {}
          // reuse existing handler to navigate to charity list
          handleBannerClick(activeStall);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentView, showDonationModal, hoveredStall, proximityStall]);

  // proximity detection (near a stall)
  useEffect(() => {
    if (!groupKeys || groupKeys.length === 0) return;
  
    const total = groupKeys.length;
    const positions = groupKeys.map((key, i) => {
      const pairIndex = Math.floor(i / 2);
      const xPercent = (pairIndex + 1) * (100 / (Math.ceil(total / 2) + 1)); // Match rendering xPercent
      const isTop = i % 2 === 0;
      const yPercent = isTop ? 25 : 75; // Match topStyle percentages (25% and 75%)
      return { key, x: xPercent, y: yPercent };
    });
  
    const nearest = positions.reduce((closest, p) => {
      const dx = Math.abs(characterPos.x - p.x);
      const dy = Math.abs(characterPos.y - p.y);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (!closest || dist < closest.dist) return { key: p.key, dist };
      return closest;
    }, null);
  
    if (nearest && nearest.dist < 15) { // Increased threshold to 15
      setProximityStall(nearest.key);
    } else {
      setProximityStall(null);
    }
  }, [characterPos, groupKeys]);

  const fetchUserDonations = async () => {
    try {
      const response = await donationAPI.getUserDonations();
      setUserDonations(response.data);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    }
  };

  const fetchLeaderboards = async () => {
    try {
      const [usersRes, charitiesRes] = await Promise.all([
        leaderboardAPI.getUsers(),
        leaderboardAPI.getCharities()
      ]);
      setUserLeaderboard(usersRes.data);
      setCharityLeaderboard(charitiesRes.data);
    } catch (err) {
      console.error('Failed to fetch leaderboards:', err);
    }
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setCurrentView('game');
      await fetchUserDonations();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.signup(name, email, password);
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setCurrentView('game');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('auth');
    setUserDonations([]);
  };

  // selectCharity: when user clicks "Donate Now" on a charity card
  const selectCharity = (charity, groupKey) => {
    // keep original behavior but set the charity icon to the group's image so DonationModal shows an image
    const withImageIcon = { ...charity, icon: charity.icon && typeof charity.icon === 'string' && charity.icon.startsWith('/images') ? charity.icon : charityGroups[groupKey].icon };
    setSelectedCharity(withImageIcon);
    setSelectedGroup(groupKey);
    setShowDonationModal(true);
  };

  const calculateImpact = (charity, amount) => {
    const multiplier = amount / charity.impact.amount;
    const description = charity.impact.description;
    const match = description.match(/(\d+)/);

    if (match) {
      const originalNumber = parseInt(match[1]);
      const newNumber = Math.round(originalNumber * multiplier);
      return description.replace(match[1], newNumber.toString());
    }
    return description;
  };

  const processDonation = async () => {
    setLoading(true);
    setError('');
    try {
      const donationData = {
        charityName: selectedCharity.name,
        charityGroup: charityGroups[selectedGroup].name,
        amount: donationAmount
      };

      await donationAPI.create(donationData);

      // play donation sound (keeps the rest of the donation flow unchanged)
      try { donateAudio.currentTime = 0; donateAudio.play(); } catch (err) {}

      const updatedUser = {
        ...user,
        totalDonated: (user.totalDonated || 0) + donationAmount
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      await fetchUserDonations();

      setShowDonationModal(false);
      setSelectedCharity(null);

      alert('Thank you for your donation!');
    } catch (err) {
      setError(err.response?.data?.message || 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  const getUserRank = () => {
    const total = user?.totalDonated || 0;
    if (total >= 500) return { rank: 'Diamond Donor', icon: '💎', min: 500 };
    if (total >= 250) return { rank: 'Gold Donor', icon: '🥇', min: 250 };
    if (total >= 100) return { rank: 'Silver Donor', icon: '🥈', min: 100 };
    if (total >= 50) return { rank: 'Bronze Donor', icon: '🥉', min: 50 };
    return { rank: 'Supporter', icon: '⭐', min: 0 };
  };

  const handleBannerClick = (groupKey) => {
    setSelectedGroup(groupKey);
    setCurrentView('charityList');
  };

  if (currentView === 'auth') {
    return <AuthView onLogin={handleLogin} onSignup={handleSignup} loading={loading} error={error} setError={setError} />;
  }

  if (currentView === 'ranks') {
    return <RanksView user={user} onNavigate={setCurrentView} onLogout={handleLogout} />;
  }

  if (currentView === 'leaderboard') {
    return (
      <LeaderboardView
        userLeaderboard={userLeaderboard}
        charityLeaderboard={charityLeaderboard}
        currentUser={user}
        onNavigate={setCurrentView}
        fetchLeaderboards={fetchLeaderboards}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'dashboard') {
    const userRank = getUserRank();
    const totalDonated = user?.totalDonated || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentView} currentView={currentView} />

        <div className="max-w-6xl mx-auto p-6 mt-4">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Total Donated</h3>
                <Heart className="text-red-500" size={24} />
              </div>
              <p className="text-4xl font-bold text-gray-900">£{totalDonated}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Your Rank</h3>
                <Trophy className="text-yellow-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {userRank.icon} {userRank.rank}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Donations</h3>
                <Users className="text-blue-500" size={24} />
              </div>
              <p className="text-4xl font-bold text-gray-900">{userDonations.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Donation History</h2>
            {userDonations.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...userDonations].reverse().map((donation, index) => (
                  <div key={donation._id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition">
                    <div>
                      <p className="font-semibold text-gray-800">{donation.charityName}</p>
                      <p className="text-sm text-gray-500">{donation.charityGroup}</p>
                      <p className="text-xs text-gray-400">{new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xl font-bold text-green-600">£{donation.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No donations yet. Start making a difference today!</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'charityList' && selectedGroup) {
    const group = charityGroups[selectedGroup];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentView} currentView={currentView} />

        <div className="max-w-7xl mx-auto p-6 mt-4">
          <div className={`bg-gradient-to-r ${group.color} rounded-2xl shadow-2xl p-8 mb-6 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              {/* show group image */}
              <img src={group.icon} alt={group.name} className="w-20 h-20 rounded-full object-cover" />
              <div>
                <h1 className="text-5xl font-bold mb-2">{group.name}</h1>
                <p className="text-xl text-white/90">{group.description}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {group.charities.map((charity) => (
              <div
                key={charity.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:shadow-2xl hover:bg-white/20 transition transform hover:-translate-y-2 cursor-pointer border border-white/20"
                onClick={() => selectCharity(charity, selectedGroup)}
              >
                {/* use group's image for each charity card icon */}
                <div className="text-6xl mb-4 text-center">
                  <img src={group.icon} alt={charity.name} className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{charity.name}</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">Example Impact:</p>
                  <p className="text-white">
                    <span className="font-bold text-green-400">£{charity.impact.amount}</span> can{' '}
                    {charity.impact.description}
                  </p>
                </div>
                <button
                  onClick={() => selectCharity(charity, selectedGroup)}
                  className={`mt-4 w-full py-3 bg-gradient-to-r ${group.color} text-white rounded-lg font-semibold hover:shadow-lg transition`}
                >
                  Donate Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {showDonationModal && selectedCharity && (
          <DonationModal
            charity={selectedCharity}
            amount={donationAmount}
            setAmount={setDonationAmount}
            calculateImpact={calculateImpact}
            onDonate={processDonation}
            onClose={() => {
              setShowDonationModal(false);
              setSelectedCharity(null);
            }}
            loading={loading}
            error={error}
          />
        )}
      </div>
    );
  }

  // Main game view (updated UI: straight pathway, stalls on both sides, character image, proximity)
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 flex flex-col">
      <div
        className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg`}
        onClick={() => handleBannerClick(bannerIssues[currentBannerIndex].group)}
      >
        <img src={bannerIssues[currentBannerIndex].icon} alt="banner" className="w-8 h-8" />
        <p className="text-center font-bold text-lg animate-pulse">
          {bannerIssues[currentBannerIndex].text} - Click to Donate
        </p>
      </div>

      <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentView} currentView={currentView} />

      <div className="flex-1 relative overflow-hidden">
      <div
        className="w-full h-full relative bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
          {/* pathway (center road) */}
          {/* central pathway (slightly transparent overlay over background) */}
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
  <div className="w-full h-40"></div>
</div>


          {/* stalls positioned along the horizontal axis, two rows */}
          <div className="absolute inset-0 z-50">
            {groupKeys.map((key, i) => {
              const group = charityGroups[key];
              const total = groupKeys.length;
              const pairIndex = Math.floor(i / 2); // Index for each pair
const xPercent = (pairIndex + 1) * (100 / (Math.ceil(total / 2) + 1)); // Even spacing for pairs
const isTop = i % 2 === 0; // Alternate between top and bottom
              const topStyle = isTop ? '25%' : '70%';
              const isNear = (hoveredStall === key) || (proximityStall === key);

              return (
                <div
                  key={key}
                  style={{ position: 'absolute', left: `${xPercent}%`, top: topStyle, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => setHoveredStall(key)}
                  onMouseLeave={() => setHoveredStall(null)}
                >
                  <div
  className={`relative w-48 h-56 md:w-64 md:h-72 cursor-pointer transition-transform duration-300 ${isNear ? 'scale-110' : 'scale-100'}`}

  onClick={() => {
    try { interactAudio.currentTime = 0; interactAudio.play(); } catch (err) {}
    handleBannerClick(key);
  }}
>
  {/* Stall image */}
  <img
    src={defaultStallImage}
    alt={group.name}
    className="w-full h-full object-contain drop-shadow-2xl"
  />

  {/* Stall label */}
  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap">
    {group.name.replace('Postcode ', '').replace(' Trust', '')}
  </div>

  {/* Glow effect when near */}
  {isNear && (
    <div className="absolute inset-0 rounded-xl border-4 border-yellow-400 animate-pulse pointer-events-none"></div>
  )}
</div>


                  {/* tooltip: appears when hovered by mouse OR when in proximity */}
                  {(hoveredStall === key || proximityStall === key) && (
  <div
    className={`absolute ${isTop ? 'top-[-110px] left-1/2 transform -translate-x-1/2' : 'bottom-[-110px] left-1/2 transform -translate-x-1/2'} z-60 animate-fade-in`}
  >
    <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 rounded-xl shadow-2xl border-2 border-yellow-400 max-w-xs text-center">
      <div className="flex items-center gap-2 mb-2 justify-center">
        <img src={group.icon} alt="" className="w-8 h-8" />
        <p className="font-bold text-lg">{group.name}</p>
      </div>
      <p className="text-sm text-gray-300">{group.description}</p>
      <div className="mt-2 text-xs text-yellow-400">Click or press <span className="font-bold">Space</span> to explore</div>
    </div>
  </div>
)}
                </div>
              );
            })}
          </div>

          {/* character (image) - keeps original position handling */}
          <div
  className="absolute z-50 transition-all duration-200 ease-out"
  style={{
    left: `${characterPos.x}%`,
    top: `${characterPos.y}%`,
    transform: 'translate(-50%, -50%)'
  }}
>
  <div className="relative flex flex-col items-center">
    <img
      src="/images/character.png"
      alt="character"
      className="w-20 h-28 md:w-24 md:h-32 object-contain drop-shadow-2xl"
    />
    <div className="w-10 h-2 bg-black/40 rounded-full blur-sm mt-[-6px]"></div>
  </div>
</div>

        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-2xl border-2 border-yellow-400 z-40">
  <p className="text-center font-bold text-base mb-1">
    Use <span className="text-yellow-400">W A S D</span> or <span className="text-yellow-400">Arrow Keys</span> to move
  </p>
  <p className="text-xs text-center text-gray-300">
    Click on charity stalls or use the banner above to donate — or press <span className="font-bold text-yellow-400">Space</span> when near a stall
  </p>
</div>
      </div>

      {showDonationModal && selectedCharity && (
        <DonationModal
          charity={selectedCharity}
          amount={donationAmount}
          setAmount={setDonationAmount}
          calculateImpact={calculateImpact}
          onDonate={processDonation}
          onClose={() => {
            setShowDonationModal(false);
            setSelectedCharity(null);
          }}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

const Navbar = ({ user, onLogout, onNavigate, currentView }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-b-2 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => onNavigate('game')}
          >
            <Heart className="text-red-500" size={28} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Charity Quest
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('game')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentView === 'game' ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                currentView === 'dashboard' ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'
              }`}
            >
              <Users size={18} />
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                currentView === 'leaderboard' ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'
              }`}
            >
              <Trophy size={18} />
              Leaderboard
            </button>
            <button
              onClick={() => onNavigate('ranks')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                currentView === 'ranks' ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'
              }`}
            >
              <Info size={18} />
              Ranks
            </button>
            <div className="border-l border-gray-600 h-8"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                <span className="font-bold text-yellow-400">{user?.name}</span>
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RanksView = ({ user, onNavigate, onLogout }) => {
  const ranks = [
    { name: 'Supporter', icon: '⭐', min: 0, color: 'from-gray-400 to-gray-600', description: 'Starting your charitable journey' },
    { name: 'Bronze Donor', icon: '🥉', min: 50, color: 'from-orange-700 to-orange-900', description: 'Making a difference in your community' },
    { name: 'Silver Donor', icon: '🥈', min: 100, color: 'from-gray-300 to-gray-500', description: 'Committed to positive change' },
    { name: 'Gold Donor', icon: '🥇', min: 250, color: 'from-yellow-400 to-yellow-600', description: 'A generous philanthropist' },
    { name: 'Diamond Donor', icon: '💎', min: 500, color: 'from-cyan-400 to-blue-600', description: 'Elite charitable champion' }
  ];

  const currentTotal = user?.totalDonated || 0;
  const currentRank = ranks.filter(r => currentTotal >= r.min).pop();
  const nextRank = ranks.find(r => r.min > currentTotal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentView="ranks" />
      
      <div className="max-w-6xl mx-auto p-6 mt-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <Trophy size={64} />
            <div>
              <h1 className="text-5xl font-bold mb-2">Donor Ranks</h1>
              <p className="text-xl text-white/90">Your journey to making a bigger impact</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border-2 border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">Your Current Rank</h2>
          <div className={`bg-gradient-to-r ${currentRank.color} rounded-xl p-6 shadow-xl`}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{currentRank.icon}</span>
              <div>
                <h3 className="text-4xl font-bold text-white">{currentRank.name}</h3>
                <p className="text-xl text-white/80">{currentRank.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white text-lg mb-2">Total Donated: <span className="font-bold text-2xl">£{currentTotal}</span></p>
              {nextRank && (
                <div className="mt-4">
                  <p className="text-white/90 mb-2">Progress to {nextRank.name}:</p>
                  <div className="bg-black/30 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
                      style={{ width: `${Math.min(100, (currentTotal / nextRank.min) * 100)}%` }}
                    >
                      {Math.round((currentTotal / nextRank.min) * 100)}%
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mt-2">£{nextRank.min - currentTotal} more to reach {nextRank.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranks.map((rank, index) => {
            const isUnlocked = currentTotal >= rank.min;
            return (
              <div
                key={index}
                className={`rounded-xl p-6 shadow-xl transform transition-all duration-300 ${
                  isUnlocked 
                    ? `bg-gradient-to-br ${rank.color} hover:scale-105` 
                    : 'bg-gray-800/50 grayscale opacity-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{rank.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{rank.name}</h3>
                  <p className="text-white/80 mb-4">{rank.description}</p>
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-white font-semibold">
                      {isUnlocked ? '✓ Unlocked' : `Requires £${rank.min}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AuthView = ({ onLogin, onSignup, loading, error, setError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="text-red-500" size={64} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Charity Quest</h1>
          <p className="text-gray-600">Make a difference through gamified giving</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              !isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Join thousands making a difference through charitable giving</p>
        </div>
      </div>
    </div>
  );
};

const LeaderboardView = ({ userLeaderboard, charityLeaderboard, currentUser, onNavigate, fetchLeaderboards, onLogout }) => {
  useEffect(() => {
    fetchLeaderboards();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar user={currentUser} onLogout={onLogout} onNavigate={onNavigate} currentView="leaderboard" />

      <div className="max-w-6xl mx-auto p-6 mt-4">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <Trophy size={64} />
            <div>
              <h1 className="text-5xl font-bold mb-2">Leaderboards</h1>
              <p className="text-xl text-white/90">See who's making the biggest impact</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border-2 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-blue-400" size={32} />
              <h2 className="text-3xl font-bold text-white">Top Donors</h2>
            </div>
            <div className="space-y-3">
              {userLeaderboard.length > 0 ? (
                userLeaderboard.map((donor, index) => {
                  const isCurrentUser = donor._id === currentUser?.id;
                  return (
                    <div
                      key={donor._id}
                      className={`flex items-center justify-between p-4 rounded-lg transition ${
                        isCurrentUser ? 'bg-blue-500/30 border-2 border-blue-400 shadow-lg' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                        <div>
                          <span className="font-semibold text-white text-lg">{donor.name}</span>
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded font-bold">YOU</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xl font-bold text-green-400">£{donor.totalDonated}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center py-8">No donors yet. Be the first</p>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border-2 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-400" size={32} />
              <h2 className="text-3xl font-bold text-white">Top Charities</h2>
            </div>
            <div className="space-y-3">
              {charityLeaderboard.length > 0 ? (
                charityLeaderboard.map((charity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <div>
                        <span className="font-semibold text-white text-lg">{charity.name}</span>
                        <p className="text-xs text-gray-400">{charity.donationCount} donations</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-400">£{charity.totalAmount}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No donations yet. Start donating</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DonationModal = ({ charity, amount, setAmount, calculateImpact, onDonate, onClose, loading, error }) => {
  const commonAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative transform animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-4">
          {/* charity.icon will be an image path if we selected from the group (see selectCharity above) */}
          {charity?.icon && typeof charity.icon === 'string' && charity.icon.startsWith('/images') ? (
            <img src={charity.icon} alt={charity.name} className="w-20 h-20 mx-auto mb-3" />
          ) : (
            <div className="text-7xl mb-3">{charity.icon}</div>
          )}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{charity.name}</h2>
          <p className="text-gray-600">Choose your donation amount</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 mb-6">
          {commonAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`py-3 rounded-lg font-semibold transition transform hover:scale-110 ${
                amount === amt
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              £{amt}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Custom Amount (£)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-lg"
            min="1"
          />
        </div>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6 border-2 border-green-300">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Heart className="text-red-500" size={20} />
            Your Impact
          </h3>
          <p className="text-gray-700 text-lg">
            Your donation of <span className="font-bold text-green-600">£{amount}</span> will{' '}
            <span className="font-bold">{calculateImpact(charity, amount)}</span>
          </p>
        </div>

        <button
          onClick={onDonate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {loading ? 'Processing...' : `Donate £${amount} Now`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your donation will be securely processed
        </p>
      </div>
    </div>
  );
};

export default App;
