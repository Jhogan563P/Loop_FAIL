import { useState, useEffect, useCallback } from 'react';

export type GameSection = 1 | 2 | 3 | 4 | 'final';
export type GamePhase = 'playing' | 'exploding';

export interface GameState {
  currentSection: GameSection;
  currentPhase: GamePhase;

  // Challenge tracking
  totalChallenges: number;
  completedChallenges: number;
  correctHits: number;
  incorrectHits: number;

  // Current challenge
  currentKeys: string[];
  pressedKeys: string[];
  challengeTimeLimit: number;
  timeRemaining: number;

  isGameOver: boolean;
}

const KEY_POOL = ['A', 'S', 'D', 'F', 'J', 'K', 'L'];

// Helper to get N random unique keys
const getRandomKeys = (count: number) => {
  const shuffled = [...KEY_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const EXPLOSION_DURATION = 2000;

// Section configuration
const SECTION_CONFIG = {
  1: { keysPerChallenge: 1, totalChallenges: 5, timePerChallenge: 2.5, minCorrectHits: 3 },
  2: { keysPerChallenge: 2, totalChallenges: 10, timePerChallenge: 3.0, minCorrectHits: 6 },
  3: { keysPerChallenge: 4, totalChallenges: 16, timePerChallenge: 4.0, minCorrectHits: 10 },
  4: { keysPerChallenge: 6, totalChallenges: 18, timePerChallenge: 5.0, minCorrectHits: 11 },
};

export const useGameState = () => {
  const [currentSection, setCurrentSection] = useState<GameSection>(1);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('playing');

  const [totalChallenges, setTotalChallenges] = useState(SECTION_CONFIG[1].totalChallenges);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);
  const [incorrectHits, setIncorrectHits] = useState(0);

  const [currentKeys, setCurrentKeys] = useState<string[]>(getRandomKeys(SECTION_CONFIG[1].keysPerChallenge));
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [challengeTimeLimit, setChallengeTimeLimit] = useState(SECTION_CONFIG[1].timePerChallenge);
  const [timeRemaining, setTimeRemaining] = useState(SECTION_CONFIG[1].timePerChallenge);

  const [isGameOver, setIsGameOver] = useState(false);

  // Generate new challenge
  const generateNewChallenge = useCallback(() => {
    const config = SECTION_CONFIG[currentSection as 1 | 2 | 3 | 4];
    const newKeys = getRandomKeys(config.keysPerChallenge);
    console.log('New challenge keys:', newKeys);
    setCurrentKeys(newKeys);
    setPressedKeys([]);
    setTimeRemaining(challengeTimeLimit);
  }, [currentSection, challengeTimeLimit]);

  // Initialize section
  const initializeSection = useCallback((section: 1 | 2 | 3 | 4) => {
    const config = SECTION_CONFIG[section];
    console.log('Initializing section:', section, config);
    setTotalChallenges(config.totalChallenges);
    setCompletedChallenges(0);
    setCorrectHits(0);
    setIncorrectHits(0);
    setChallengeTimeLimit(config.timePerChallenge);
    setTimeRemaining(config.timePerChallenge);
    setCurrentKeys(getRandomKeys(config.keysPerChallenge));
    setPressedKeys([]);
    setCurrentPhase('playing');
  }, []);

  // Check if section is complete
  const checkSectionComplete = useCallback(() => {
    if (currentSection === 'final') return;

    const config = SECTION_CONFIG[currentSection as 1 | 2 | 3 | 4];

    if (completedChallenges >= totalChallenges) {
      console.log('Section Complete Check:', { completedChallenges, totalChallenges, correctHits, min: config.minCorrectHits });
      if (correctHits >= config.minCorrectHits) {
        // Passed
        console.log('Section Passed!');
        setCurrentPhase('exploding');
        setTimeout(() => {
          if (currentSection === 4) {
            setCurrentSection('final');
            setIsGameOver(true);
          } else {
            const nextSection = (currentSection + 1) as 1 | 2 | 3 | 4;
            setCurrentSection(nextSection);
            initializeSection(nextSection);
          }
        }, EXPLOSION_DURATION);
      } else {
        // Failed
        console.log('Section Failed!');
        setCurrentPhase('exploding');
        setTimeout(() => {
          setCurrentSection('final');
          setIsGameOver(true);
        }, EXPLOSION_DURATION);
      }
    }
  }, [currentSection, completedChallenges, totalChallenges, correctHits, initializeSection]);

  // Handle key down/up events
  useEffect(() => {
    if (currentPhase === 'exploding' || isGameOver) {
      console.log('Input blocked - phase:', currentPhase, 'gameOver:', isGameOver);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      console.log('Key pressed:', key, 'Valid:', KEY_POOL.includes(key));

      if (!KEY_POOL.includes(key)) return;
      if (e.repeat) return;

      setPressedKeys(prev => {
        if (prev.includes(key)) return prev;
        const newPressed = [...prev, key];
        console.log('Pressed keys:', newPressed, 'Target:', currentKeys);

        // Check if all target keys are pressed
        const allTargetsPressed = currentKeys.every(k => newPressed.includes(k));
        console.log('All targets pressed:', allTargetsPressed);

        if (allTargetsPressed) {
          // Success!
          console.log('✓ Challenge Success!');
          setCorrectHits(h => h + 1);
          setCompletedChallenges(c => {
            const newCount = c + 1;
            console.log('Completed:', newCount, '/', totalChallenges);

            // Generate new challenge immediately if not done
            if (newCount < totalChallenges) {
              setTimeout(() => generateNewChallenge(), 100);
            }
            return newCount;
          });

          return []; // Reset pressed keys
        }

        return newPressed;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      setPressedKeys(prev => prev.filter(k => k !== key));
    };

    console.log('Adding keyboard listeners');
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      console.log('Removing keyboard listeners');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentPhase, isGameOver, currentKeys, totalChallenges, generateNewChallenge]);

  // Timer countdown
  useEffect(() => {
    if (isGameOver || currentPhase === 'exploding') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          // Time expired - count as incorrect
          console.log('⏰ Time expired!');
          setIncorrectHits(p => p + 1);
          setCompletedChallenges(p => {
            const newCount = p + 1;
            console.log('Timeout - Completed:', newCount, '/', totalChallenges);

            if (newCount < totalChallenges) {
              setTimeout(() => generateNewChallenge(), 100);
            }
            return newCount;
          });

          return challengeTimeLimit;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver, currentPhase, totalChallenges, challengeTimeLimit, generateNewChallenge]);

  // Check section completion
  useEffect(() => {
    checkSectionComplete();
  }, [completedChallenges, checkSectionComplete]);

  // Reset game
  const resetGame = useCallback(() => {
    console.log('🔄 Resetting game state...');
    setCurrentSection(1);
    setIsGameOver(false);
    setTotalChallenges(SECTION_CONFIG[1].totalChallenges);
    setCompletedChallenges(0);
    setCorrectHits(0);
    setIncorrectHits(0);
    setChallengeTimeLimit(SECTION_CONFIG[1].timePerChallenge);
    setTimeRemaining(SECTION_CONFIG[1].timePerChallenge);
    setCurrentKeys(getRandomKeys(SECTION_CONFIG[1].keysPerChallenge));
    setPressedKeys([]);
    setCurrentPhase('playing');
  }, []);

  return {
    currentSection,
    currentPhase,
    totalChallenges,
    completedChallenges,
    correctHits,
    incorrectHits,
    currentKeys,
    pressedKeys,
    challengeTimeLimit,
    timeRemaining,
    isGameOver,
    resetGame,
  };
};
