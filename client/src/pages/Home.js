import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Network,
  Search,
  Users,
  BookOpen,
  TrendingUp,
  Shield,
  ArrowRight,
  Play,
  ThumbsUp,
  ThumbsDown,
  Target,
  Route,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { currentTheme } = useTheme();

  const features = [
    {
      icon: Network,
      title: 'Interactive Graph Explorer',
      description:
        'Discover the interconnected world of BJJ through our interactive knowledge graph. See how positions and techniques relate to each other and find your own path through the art.',
    },
    {
      icon: Target,
      title: 'Game Plan Designer',
      description:
        'Design your BJJ game plan by selecting positions you know and finding the optimal path between them. Create personalized strategies for training and competition.',
    },
    {
      icon: Search,
      title: 'Discover & Explore',
      description:
        'Browse through our community-curated collection of positions, techniques, and learning resources. Find what resonates with your style.',
    },
    {
      icon: Users,
      title: 'Community Knowledge',
      description:
        'Learn from fellow practitioners who share their insights and experiences. Every vote and contribution helps build our collective understanding.',
    },
    {
      icon: BookOpen,
      title: 'Learning Journeys',
      description:
        'Follow paths created by the community, or forge your own. From fundamentals to advanced concepts, find what works for you.',
    },
    {
      icon: TrendingUp,
      title: 'Your Learning Path',
      description:
        'Keep track of what you have explored and discovered. Your journey is unique - document it your way.',
    },
    {
      icon: Shield,
      title: 'Community Curated',
      description:
        'Content is rated and verified by practitioners like you. Find resources that the community has found most valuable.',
    },
  ];

  const stats = [
    { label: 'Positions', value: '500+' },
    { label: 'Techniques', value: '2000+' },
    { label: 'Instructional Links', value: '5000+' },
    { label: 'Active Users', value: '10,000+' },
  ];

  return (
    <div className="mobile-space-y">
      {/* Hero Section */}
      <section className="text-center mobile-py">
        <div className="max-w-4xl mx-auto">
          <h1 className="mobile-text-3xl font-bold text-gray-900 mb-6">
            Discover BJJ Together
          </h1>
          <p className="mobile-text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore the art of Brazilian Jiu Jitsu through our community&apos;s
            shared knowledge. Connect with fellow practitioners, discover new
            techniques, design personalized game plans, and contribute to our
            collective understanding of this beautiful martial art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/explorer"
                className="btn-primary btn-mobile text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Exploring</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary btn-mobile text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>Get Started</span>
                </Link>
                <Link
                  to="/explorer"
                  className="btn-outline btn-mobile text-lg px-8 py-3"
                >
                  Explore Without Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Belt Theme Indicator */}
      {isAuthenticated && user && user.beltRank && user.beltRank.color && (
        <section className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700">
            <div
              className={`w-3 h-3 rounded-full bg-${user.beltRank.color}-belt`}
            ></div>
            <span className="text-sm font-medium">
              {user.beltRank.color &&
                user.beltRank.color.charAt(0).toUpperCase() +
                  user.beltRank.color.slice(1)}{' '}
              Belt Theme
            </span>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mobile-text-2xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 mobile-text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Game Planning Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            <Target className="w-8 h-8 text-green-600" />
            <Route className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">
            Design Your BJJ Game Plan
          </h2>
          <p className="mobile-text-lg text-gray-600 max-w-3xl mx-auto">
            Select positions you know and let our pathfinding algorithm create
            the optimal route between them. Build personalized strategies for
            training, competition, and skill development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Select Your Positions
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Choose positions you&apos;re comfortable with from our interactive
              graph. Build your game around techniques you know.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Route className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Find Optimal Paths
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Our algorithm finds the shortest route connecting all your
              selected positions. Discover efficient transitions and sequences.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Execute Your Plan
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Follow your personalized game plan step-by-step. Practice the
              sequences and refine your strategy.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/explorer"
            className="btn-primary btn-mobile text-lg px-8 py-3 flex items-center justify-center space-x-2 mx-auto"
          >
            <Target className="w-5 h-5" />
            <span>Start Planning Your Game</span>
          </Link>
        </div>
      </section>

      {/* Voting System Section */}
      <section className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            <ThumbsUp className="w-8 h-8 text-green-600" />
            <ThumbsDown className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">
            Help Shape Our Community Knowledge
          </h2>
          <p className="mobile-text-lg text-gray-600 max-w-3xl mx-auto">
            Your voice matters in our community. Vote on positions, techniques,
            and learning resources to help fellow practitioners discover what
            resonates with them. Every vote contributes to our shared
            understanding of BJJ.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Share What Works
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Vote up positions, techniques, and resources that have helped you
              in your practice.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsDown className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Guide Others Away
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Help fellow practitioners avoid misleading or ineffective
              resources by voting down.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Discover Community Favorites
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Explore what the community has found most valuable in their BJJ
              journey.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/top-voted"
            className="btn-primary btn-mobile text-lg px-8 py-3 flex items-center justify-center space-x-2 mx-auto"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Explore Community Favorites</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">
            Explore BJJ Your Way
          </h2>
          <p className="mobile-text-lg text-gray-600 max-w-3xl mx-auto">
            Our community has built a space where you can discover, learn, and
            contribute to the art of Brazilian Jiu Jitsu in whatever way feels
            right for you.
          </p>
        </div>

        <div className="mobile-card-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card card-mobile hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="mobile-text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mobile-text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 rounded-lg p-6 sm:p-8 text-center text-white">
        <h2 className="mobile-text-2xl font-bold mb-4">
          Ready to Explore BJJ Together?
        </h2>
        <p className="mobile-text-lg mb-8 opacity-90">
          Join our community of practitioners who are discovering, learning, and
          sharing their BJJ journey together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              to="/explorer"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors btn-mobile"
            >
              Explore the Graph
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors btn-mobile"
              >
                Join Our Community
              </Link>
              <Link
                to="/login"
                className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors btn-mobile"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">
            Start Exploring
          </h2>
          <p className="mobile-text-lg text-gray-600">
            Begin your journey in three simple ways
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Discover Connections
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Navigate through positions and techniques using our interactive
              graph to see how everything connects.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Design Your Game Plan
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Select positions you know and let our algorithm find the optimal
              path between them for your personalized strategy.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Find Learning Resources
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Discover videos and articles that the community has found helpful
              for each technique.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">4</span>
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Share & Connect
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Share your insights, rate resources, and connect with fellow
              practitioners.
            </p>
          </div>
        </div>
      </section>

      {/* GrappleMap Acknowledgment */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="mobile-text-xl font-bold text-gray-900 mb-4">
            Special Thanks to GrappleMap
          </h2>
          <p className="mobile-text-base text-gray-600 max-w-3xl mx-auto">
            Our 3D visualization and position data is made possible thanks to
            the incredible work of{' '}
            <a
              href="https://github.com/Eelis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Eelis
            </a>{' '}
            and the{' '}
            <a
              href="https://github.com/Eelis/GrappleMap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              GrappleMap project
            </a>
            . GrappleMap is a comprehensive database of interconnected grappling
            positions and transitions, animated with stick figures, that has
            been released into the public domain.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Network className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Original GrappleMap
            </h3>
            <p className="text-gray-600 mobile-text-sm mb-4">
              Explore the original GrappleMap website with its extensive
              database of positions and transitions.
            </p>
            <a
              href="https://eelis.net/GrappleMap/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-mobile text-sm"
            >
              Visit GrappleMap
            </a>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">Open Source</h3>
            <p className="text-gray-600 mobile-text-sm mb-4">
              GrappleMap is open source and available on GitHub. Check out the
              source code and contribute to the project.
            </p>
            <a
              href="https://github.com/Eelis/GrappleMap"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-mobile text-sm"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            GrappleMap is released into the public domain. We are grateful for
            this incredible resource that has helped make BJJ more accessible to
            practitioners worldwide.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
