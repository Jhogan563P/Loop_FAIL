import { useState, useEffect, useCallback, useRef } from 'react';

export type GameSection = 1 | 2 | 3 | 4 | 'final';
export type GamePhase = 'playing' | 'exploding' | 'challenge-failed';

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

// Section configuration based on songs.ts durations
// Each section has a fixed duration and presents challenges during that time
const SECTION_CONFIG = {
  1: { 
    keysPerChallenge: 1, 
    totalChallenges: 3, 
    timePerChallenge: 5.0, 
    minCorrectHits: 2,
    sectionDuration: 21 // seconds from songs.ts
  },
  2: { 
    keysPerChallenge: 2, 
    totalChallenges: 3, 
    timePerChallenge: 4.0, 
    minCorrectHits: 2,
    sectionDuration: 24
  },
  3: { 
    keysPerChallenge: 4, 
    totalChallenges: 3, 
    timePerChallenge: 3.0, 
    minCorrectHits: 2,
    sectionDuration: 33
  },
  4: { 
    keysPerChallenge: 6, 
    totalChallenges: 3, 
    timePerChallenge: 2.0, 
    minCorrectHits: 1,
    sectionDuration: 26
  },
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
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(SECTION_CONFIG[1].sectionDuration);

  const [isGameOver, setIsGameOver] = useState(false);
  const [currentErrorLevel, setCurrentErrorLevel] = useState<0 | 1 | 2 | 3 | 4>(0);
  // For section 1 we have two passes: first playback without challenges, second playback with the 2 challenges.
  const [sectionOnePassedHalf, setSectionOnePassedHalf] = useState(false);

  // Use refs to always have the latest values in event handlers
  const currentKeysRef = useRef(currentKeys);
  const completedChallengesRef = useRef(completedChallenges);
  const totalChallengesRef = useRef(totalChallenges);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    currentKeysRef.current = currentKeys;
  }, [currentKeys]);

  useEffect(() => {
    completedChallengesRef.current = completedChallenges;
  }, [completedChallenges]);

  useEffect(() => {
    totalChallengesRef.current = totalChallenges;
  }, [totalChallenges]);

  // Generate new challenge
  const generateNewChallenge = useCallback(() => {
    const config = SECTION_CONFIG[currentSection as 1 | 2 | 3 | 4];
    const newKeys = getRandomKeys(config.keysPerChallenge);
    console.log('New challenge keys:', newKeys);
    setCurrentKeys(newKeys);
    setPressedKeys([]);
    setTimeRemaining(challengeTimeLimit);
  }, [currentSection, challengeTimeLimit]);

  // Start challenges for the current section (used e.g. when section 1 reaches its second pass)
  const startSectionChallenges = useCallback((section?: 1 | 2 | 3 | 4) => {
    const s = section ?? (currentSection as 1 | 2 | 3 | 4);
    const config = SECTION_CONFIG[s];
    setTotalChallenges(config.totalChallenges);
    setCompletedChallenges(0);
    setCorrectHits(0);
    setIncorrectHits(0);
    setCurrentErrorLevel(0); // Reset error level when starting challenges
    setChallengeTimeLimit(config.timePerChallenge);
    setTimeRemaining(config.timePerChallenge);
    setSectionTimeRemaining(config.sectionDuration);
    setCurrentKeys(getRandomKeys(config.keysPerChallenge));
    setPressedKeys([]);
    setCurrentPhase('playing');
  }, [currentSection]);

  const markSectionOneHalfPassed = useCallback(() => {
    setSectionOnePassedHalf(true);
  }, []);

  // Initialize section
  const initializeSection = useCallback((section: 1 | 2 | 3 | 4) => {
    const config = SECTION_CONFIG[section];
    console.log('Initializing section:', section, config);
    // By default initialize section challenges. For section 1 we start with the first playback
    // without challenges; the actual challenges will be started when the half-point is reached.
    setTotalChallenges(section === 1 ? 0 : config.totalChallenges);
    setCompletedChallenges(0);
    setCorrectHits(0);
    setIncorrectHits(0);
    setCurrentErrorLevel(0); // Reset error level when starting new section
    setChallengeTimeLimit(config.timePerChallenge);
    setTimeRemaining(config.timePerChallenge);
    setSectionTimeRemaining(config.sectionDuration);
    setCurrentKeys(getRandomKeys(config.keysPerChallenge));
    setPressedKeys([]);
    setCurrentPhase('playing');
  }, []);

  // Check if section time is complete (not challenges)
  const checkSectionComplete = useCallback(() => {
    if (currentSection === 'final') return;

    const config = SECTION_CONFIG[currentSection as 1 | 2 | 3 | 4];

    // Section completes based on time, not challenges
    if (sectionTimeRemaining <= 0) {
      console.log('Section Time Complete:', { currentSection, correctHits, incorrectHits, min: config.minCorrectHits });
      
      // For section 1 we always transition to section 2 (no explosion, just transition)
      if (currentSection === 1) {
        console.log('Section 1 complete - transition to section 2');
        const nextSection = 2 as 1 | 2 | 3 | 4;
        setCurrentSection(nextSection);
        initializeSection(nextSection);
        return;
      }

      if (correctHits >= config.minCorrectHits) {
        // Passed: go to next section (no explosion)
        console.log('Section Passed! Transitioning to next section');
        if (currentSection === 4) {
          setCurrentSection('final');
          setIsGameOver(true);
        } else {
          const nextSection = (currentSection + 1) as 1 | 2 | 3 | 4;
          setCurrentSection(nextSection);
          initializeSection(nextSection);
        }
      } else {
        // Failed: show explosion then go to final
        console.log('Section Failed! Showing explosion');
        setCurrentPhase('exploding');
        setTimeout(() => {
          setCurrentSection('final');
          setIsGameOver(true);
        }, EXPLOSION_DURATION);
      }
    }
  }, [currentSection, sectionTimeRemaining, correctHits, incorrectHits, initializeSection]);

  // Reset pressed keys when currentKeys changes (new challenge)
  useEffect(() => {
    console.log('Challenge changed, resetting pressed keys. New target:', currentKeys);
    setPressedKeys([]);
  }, [currentKeys]);

  // Handle key down/up events
  useEffect(() => {
    if (currentPhase === 'exploding' || currentPhase === 'challenge-failed' || isGameOver) {
      console.log('Input blocked - phase:', currentPhase, 'gameOver:', isGameOver);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const targetKeys = currentKeysRef.current;
      console.log('🎹 Key pressed:', key, 'Current target keys:', targetKeys, 'Total challenges:', totalChallengesRef.current);

      if (e.repeat) return;
      
      // Don't process keys if no challenges are active
      if (totalChallengesRef.current === 0 || targetKeys.length === 0) {
        console.log('⚠️ No active challenges, ignoring key');
        return;
      }
      
      if (isProcessingRef.current) {
        console.log('Already processing a challenge result, ignoring key');
        return;
      }

      // Check if the pressed key is one of the target keys
      const isCorrectKey = targetKeys.includes(key);
      console.log('🔍 Is correct key?', isCorrectKey, 'Key:', key, 'Target:', targetKeys);
      
      if (!isCorrectKey) {
        // Wrong key pressed (ANY key that's not in target) - mark as incorrect
        console.log('✗ Wrong key pressed:', key, 'Expected:', targetKeys);
        isProcessingRef.current = true;
        
        setIncorrectHits(h => h + 1);
        // Increment error level (max 4)
        setCurrentErrorLevel(prev => Math.min(4, prev + 1) as 0 | 1 | 2 | 3 | 4);
        
        // Show explosion animation
        setCurrentPhase('challenge-failed');
        
        setCompletedChallenges(c => {
          const newCount = c + 1;
          console.log('❌ Failed - Total completed:', newCount);

          // Show explosion for 1 second, then continue
          setTimeout(() => {
            console.log('🔄 Returning to playing phase after explosion');
            setCurrentPhase('playing');
            generateNewChallenge();
            isProcessingRef.current = false;
          }, 1000);
          
          return newCount;
        });
        
        setPressedKeys([]); // Reset pressed keys
        return; // Exit early
      }
      
      // Only process valid keys from KEY_POOL for correct answers
      if (!KEY_POOL.includes(key)) {
        console.log('⚠️ Key not in pool but is correct, ignoring');
        return;
      }

      setPressedKeys(prev => {
        console.log('Previous pressed keys:', prev);
        if (prev.includes(key)) return prev;

        const newPressed = [...prev, key];
        console.log('Pressed keys:', newPressed, 'Target:', targetKeys);

        // Check if all target keys are pressed
        const allTargetsPressed = targetKeys.every(k => newPressed.includes(k));
        console.log('All targets pressed:', allTargetsPressed);

        if (allTargetsPressed) {
          // Success!
          console.log('✓ Challenge Success!');
          isProcessingRef.current = true;
          
          setCorrectHits(h => h + 1);
          setCompletedChallenges(c => {
            const newCount = c + 1;
            console.log('Success - Total completed:', newCount);

            // Always generate new challenge (continue until section time ends)
            setTimeout(() => {
              generateNewChallenge();
              isProcessingRef.current = false;
            }, 100);
            
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
  }, [currentPhase, isGameOver, totalChallenges, generateNewChallenge]);

  // Section timer countdown (continues even during challenge-failed)
  useEffect(() => {
    if (isGameOver || currentPhase === 'exploding') return;

    const interval = setInterval(() => {
      setSectionTimeRemaining((prev) => {
        if (prev <= 0.1) return 0;
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver, currentPhase]);

  // Challenge timer countdown
  useEffect(() => {
    if (isGameOver || currentPhase === 'exploding' || currentPhase === 'challenge-failed') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          if (isProcessingRef.current) return challengeTimeLimit;
          
          // Time expired - count as incorrect
          console.log('⏰ Challenge timeout!');
          isProcessingRef.current = true;
          
          setIncorrectHits(p => p + 1);
          // Increment error level (max 4)
          setCurrentErrorLevel(prev => Math.min(4, prev + 1) as 0 | 1 | 2 | 3 | 4);
          
          // Show explosion animation
          setCurrentPhase('challenge-failed');
          
          setCompletedChallenges(p => {
            const newCount = p + 1;
            console.log('Timeout - Total completed:', newCount);

            // Show explosion for 1 second, then continue
            setTimeout(() => {
              setCurrentPhase('playing');
              generateNewChallenge();
              isProcessingRef.current = false;
            }, 1000);
            
            return newCount;
          });

          return challengeTimeLimit;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver, currentPhase, challengeTimeLimit, generateNewChallenge]);

  // Check section completion based on time
  useEffect(() => {
    checkSectionComplete();
  }, [sectionTimeRemaining, checkSectionComplete]);

  // Reset game
  const resetGame = useCallback(() => {
    console.log('🔄 Resetting game state...');
    setCurrentSection(1);
    setIsGameOver(false);
    setTotalChallenges(SECTION_CONFIG[1].totalChallenges);
    setCompletedChallenges(0);
    setCorrectHits(0);
    setIncorrectHits(0);
    setCurrentErrorLevel(0);
    setChallengeTimeLimit(SECTION_CONFIG[1].timePerChallenge);
    setTimeRemaining(SECTION_CONFIG[1].timePerChallenge);
    setSectionTimeRemaining(SECTION_CONFIG[1].sectionDuration);
    setCurrentKeys(getRandomKeys(SECTION_CONFIG[1].keysPerChallenge));
    setPressedKeys([]);
    setCurrentPhase('playing');
    setSectionOnePassedHalf(false);
  }, []);

  return {
    currentSection,
    currentPhase,
    currentErrorLevel,
    totalChallenges,
    completedChallenges,
    correctHits,
    incorrectHits,
    currentKeys,
    pressedKeys,
    challengeTimeLimit,
    timeRemaining,
    sectionTimeRemaining,
    isGameOver,
    resetGame,
    // exported helpers
    startSectionChallenges,
    sectionOnePassedHalf,
    markSectionOneHalfPassed,
  };
};
