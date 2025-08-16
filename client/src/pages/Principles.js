import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  BookOpen,
  Target,
  Shield,
  Zap,
  Move,
  Eye,
  Brain,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  Users,
  Lightbulb,
  Award,
} from 'lucide-react';

const Principles = () => {
  const { currentTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('fundamentals');

  const categories = [
    { id: 'fundamentals', label: 'Fundamentals', icon: BookOpen },
    { id: 'leverage', label: 'Leverage', icon: Target },
    { id: 'base', label: 'Base & Posture', icon: Shield },
    { id: 'frames', label: 'Frames', icon: Zap },
    { id: 'movement', label: 'Movement', icon: Move },
    { id: 'timing', label: 'Timing', icon: Eye },
    { id: 'strategy', label: 'Strategy', icon: Brain },
  ];

  const principles = {
    fundamentals: [
      {
        title: 'Position Before Submission',
        description:
          'Always establish a dominant position before attempting submissions. A strong position gives you control and multiple submission options.',
        icon: TrendingUp,
        examples: [
          'Mount before armbar',
          'Back control before RNC',
          'Side control before kimura',
        ],
      },
      {
        title: 'Hip Escape (Shrimp)',
        description:
          'The fundamental movement for creating space and escaping bad positions. Master this before learning complex techniques.',
        icon: Move,
        examples: [
          'Escaping side control',
          'Creating space in guard',
          'Recovering guard',
        ],
      },
      {
        title: 'Grip Fighting',
        description:
          "Control your opponent's grips while establishing your own. Good grips lead to good positions.",
        icon: Shield,
        examples: [
          'Breaking collar grips',
          'Establishing sleeve control',
          "Preventing opponent's grips",
        ],
      },
    ],
    leverage: [
      {
        title: 'Use Your Hips',
        description:
          'Your hips are your strongest weapon. Use them to generate power and create angles for techniques.',
        icon: Zap,
        examples: [
          'Hip bump sweep',
          'Bridge and roll escape',
          'Hip escape movements',
        ],
      },
      {
        title: 'Create Angles',
        description:
          "Don't fight force with force. Create angles to make your opponent's strength work against them.",
        icon: RotateCcw,
        examples: ['Triangle setup', 'Armbar from guard', 'Kimura trap'],
      },
      {
        title: 'Leverage Over Strength',
        description:
          'Technique and leverage will always beat raw strength. Focus on proper mechanics over muscle.',
        icon: Target,
        examples: ['Triangle choke', 'Kimura lock', 'Armbar mechanics'],
      },
    ],
    base: [
      {
        title: 'Maintain Your Base',
        description:
          'Keep your center of gravity low and stable. A strong base prevents you from being swept or moved.',
        icon: Shield,
        examples: [
          'Wide stance in guard',
          'Hip placement in mount',
          'Posture in side control',
        ],
      },
      {
        title: 'Good Posture',
        description:
          'Keep your spine straight and head up. Good posture makes you harder to control and more mobile.',
        icon: ArrowUp,
        examples: [
          'Posture in guard',
          'Standing in mount',
          'Posture in side control',
        ],
      },
      {
        title: 'Weight Distribution',
        description:
          'Distribute your weight effectively to control your opponent while maintaining mobility.',
        icon: TrendingUp,
        examples: [
          'Hip pressure in mount',
          'Shoulder pressure in side control',
          'Weight on opponent in guard',
        ],
      },
    ],
    frames: [
      {
        title: 'Create Frames',
        description:
          'Use your arms and legs to create space and prevent your opponent from closing distance.',
        icon: Zap,
        examples: [
          'Forearm frame in guard',
          'Knee frame in half guard',
          'Hand frame in side control',
        ],
      },
      {
        title: 'Frame to Escape',
        description:
          'Use frames to create space, then move your hips to escape bad positions.',
        icon: Move,
        examples: [
          'Framing in side control',
          'Guard recovery',
          'Escaping mount',
        ],
      },
      {
        title: 'Frame to Attack',
        description:
          'Use frames to control your opponent and set up attacks from dominant positions.',
        icon: Target,
        examples: [
          'Cross face in side control',
          'Head control in mount',
          'Framing for submissions',
        ],
      },
    ],
    movement: [
      {
        title: 'Hip Movement',
        description:
          'Your hips are your engine. Learn to move them efficiently to create opportunities.',
        icon: Move,
        examples: ['Hip escape', 'Bridge and roll', 'Hip bump sweep'],
      },
      {
        title: 'Shrimp Movement',
        description:
          'The fundamental escape movement. Master this to escape any bad position.',
        icon: ArrowLeft,
        examples: ['Escaping side control', 'Guard recovery', 'Creating space'],
      },
      {
        title: 'Technical Stand-up',
        description:
          'Learn to stand up safely from any position. This is essential for self-defense.',
        icon: ArrowUp,
        examples: [
          'Standing from guard',
          'Standing from mount',
          'Standing from side control',
        ],
      },
    ],
    timing: [
      {
        title: 'Recognize Opportunities',
        description:
          'Learn to see openings and capitalize on them quickly. Timing is everything in BJJ.',
        icon: Eye,
        examples: [
          'Submission opportunities',
          'Sweep opportunities',
          'Pass opportunities',
        ],
      },
      {
        title: 'Chain Attacks',
        description:
          "Don't rely on single techniques. Learn to chain attacks together when one fails.",
        icon: RotateCcw,
        examples: [
          'Armbar to triangle',
          'Kimura to armbar',
          'Sweep to submission',
        ],
      },
      {
        title: 'Defensive Timing',
        description:
          'Learn to defend at the right moment. Early defense is often wasted energy.',
        icon: Shield,
        examples: [
          'Defending submissions',
          'Preventing sweeps',
          'Escaping positions',
        ],
      },
    ],
    strategy: [
      {
        title: 'Energy Management',
        description:
          "Conserve your energy and use it efficiently. Don't waste energy on low-percentage moves.",
        icon: Zap,
        examples: [
          'Picking your battles',
          'Resting in good positions',
          'Efficient movement',
        ],
      },
      {
        title: 'Positional Hierarchy',
        description:
          'Understand which positions are better than others. Always work toward better positions.',
        icon: TrendingUp,
        examples: [
          'Guard to mount',
          'Side control to back',
          'Half guard to full guard',
        ],
      },
      {
        title: 'Adapt to Your Opponent',
        description:
          "Change your strategy based on your opponent's style and strengths.",
        icon: Users,
        examples: [
          'Against strong opponents',
          'Against flexible opponents',
          'Against aggressive opponents',
        ],
      },
    ],
  };

  const getCategoryIcon = categoryId => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : BookOpen;
  };

  return (
    <div className="max-w-6xl mx-auto mobile-space-y">
      {/* Header */}
      <section className="text-center mobile-py">
        <div className="max-w-4xl mx-auto">
          <h1 className="mobile-text-3xl font-bold text-gray-900 mb-6">
            BJJ Principles & Concepts
          </h1>
          <p className="mobile-text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Master the fundamental concepts that make Brazilian Jiu Jitsu work.
            Understanding these principles will accelerate your learning and
            improve your overall game.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Principles Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles[activeCategory]?.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div
                key={index}
                className="card card-mobile hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mobile-text-lg font-semibold text-gray-900 mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mobile-text-sm">
                      {principle.description}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <Lightbulb className="w-4 h-4" />
                    <span>Examples</span>
                  </h4>
                  <ul className="space-y-1">
                    {principle.examples.map((example, exampleIndex) => (
                      <li
                        key={exampleIndex}
                        className="text-sm text-gray-600 flex items-start space-x-2"
                      >
                        <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learning Tips */}
      <section className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            <Award className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">
            How to Apply These Principles
          </h2>
          <p className="mobile-text-lg text-gray-600 max-w-3xl mx-auto">
            Understanding principles is one thing, but applying them takes
            practice. Here are some tips to help you integrate these concepts
            into your game.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Focus on One at a Time
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Pick one principle to focus on during each training session. This
              helps you develop deeper understanding.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">
              Think, Don&apos;t Just Move
            </h3>
            <p className="text-gray-600 mobile-text-sm">
              Before executing a technique, think about which principles
              you&apos;re applying. This builds better understanding.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="mobile-text-lg font-semibold mb-2">Ask Questions</h3>
            <p className="text-gray-600 mobile-text-sm">
              Discuss principles with training partners and instructors.
              Different perspectives deepen your understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">
            Ready to Apply These Principles?
          </h2>
          <p className="mobile-text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Now that you understand the fundamental principles, put them into
            practice by exploring techniques and positions in our interactive
            graph.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/explorer"
              className="btn-primary btn-mobile text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Techniques</span>
            </a>
            <a
              href="/search"
              className="btn-outline btn-mobile text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>Search Concepts</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Principles;
