// Word Page - 5-Stage Learning Loop
// Per build_plan.md: Understand → Try → Review → Retry → Challenge

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import TTSButton from '../../components/TTSButton';
import StageUnderstand from '../../components/stages/StageUnderstand';
import StageTry from '../../components/stages/StageTry';
import StageReview from '../../components/stages/StageReview';
import StageRetry from '../../components/stages/StageRetry';
import StageChallenge from '../../components/stages/StageChallenge';
import AIChatAssistant from '../../components/AIChatAssistant';
import RewardToaster from '../../components/RewardToaster';

export default function WordPage() {
  const { wordId } = useParams<{ wordId: string }>();
  const navigate = useNavigate();
  const { getWordById, getWordProgress, updateProgress, stages } = useGame();
  const { logEvent } = useAnalytics();

  const word = wordId ? getWordById(wordId) : undefined;
  const progress = wordId ? getWordProgress(wordId) : undefined;

  const [currentStage, setCurrentStage] = useState(1);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<{ stars: number; xp: number; message: string }>();
  const [stageStartTime, setStageStartTime] = useState(Date.now());

  useEffect(() => {
    if (word && wordId) {
      logEvent({
        type: 'word_opened',
        word_id: wordId,
      });
    }
  }, [word, wordId, logEvent]);

  useEffect(() => {
    setStageStartTime(Date.now());
    if (wordId) {
      logEvent({
        type: 'stage_started',
        word_id: wordId,
        stage: currentStage as 1 | 2 | 3 | 4 | 5,
      });
    }
  }, [currentStage, wordId, logEvent]);

  if (!word || !wordId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">Word not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleStageComplete = async (result: 'pass' | 'fail', hintsUsed: number = 0) => {
    const timeMs = Date.now() - stageStartTime;
    const stage = stages.find((s) => s.id === currentStage);

    // Log completion event
    logEvent({
      type: 'stage_completed',
      word_id: wordId,
      stage: currentStage as 1 | 2 | 3 | 4 | 5,
      result,
      hints_used: hintsUsed,
      time_ms: timeMs,
    });

    if (result === 'pass' && stage) {
      // Award XP and stars
      const xpGained = stage.scoring.xp;
      const starsGained = stage.scoring.stars;

      await updateProgress(wordId, {
        stage: currentStage,
        xp: (progress?.xp || 0) + xpGained,
        stars: (progress?.stars || 0) + starsGained,
        last_result: 'pass',
        last_seen: new Date().toISOString(),
      });

      // Show reward
      setRewardData({
        stars: starsGained,
        xp: xpGained,
        message: `Nice! You're getting stronger at English!`,
      });
      setShowReward(true);

      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (currentStage < 5) {
          setCurrentStage(currentStage + 1);
        } else {
          // Completed all stages
          navigate('/');
        }
        setShowReward(false);
      }, 2000);
    } else {
      // On fail, show encouraging message
      setRewardData({
        stars: 0,
        xp: 0,
        message: `So close! Try this tip 👇`,
      });
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <StageUnderstand word={word} onComplete={handleStageComplete} />;
      case 2:
        return <StageTry word={word} onComplete={handleStageComplete} />;
      case 3:
        return <StageReview word={word} onComplete={handleStageComplete} />;
      case 4:
        return <StageRetry word={word} onComplete={handleStageComplete} />;
      case 5:
        return <StageChallenge word={word} onComplete={handleStageComplete} />;
      default:
        return <div>Invalid stage</div>;
    }
  };

  const stageName = stages.find((s) => s.id === currentStage)?.name || 'Unknown';

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
              aria-label="Go back home"
            >
              ← Home
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-blue-900">{word.word}</h1>
              <p className="text-gray-600">{word.telugu_hint}</p>
            </div>
            <TTSButton text={word.word} source="instruction" wordId={wordId} />
          </div>

          {/* Stage Navigator */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((stage) => (
              <div
                key={stage}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  stage === currentStage
                    ? 'bg-blue-600 text-white'
                    : stage < currentStage
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stage < currentStage ? '✓' : stage}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Stage {currentStage}: {stageName}
          </div>
        </div>

        {/* Stage Content */}
        <div className="card mb-6">{renderStage()}</div>

        {/* AI Assistant Toggle */}
        <div className="text-center">
          <button
            onClick={() => {
              setShowAssistant(!showAssistant);
              if (!showAssistant) {
                logEvent({ type: 'assistant_opened' });
              }
            }}
            className="btn-secondary"
          >
            {showAssistant ? '❌ Close' : '💡 Need a hint?'}
          </button>
        </div>

        {/* AI Assistant */}
        {showAssistant && (
          <div className="mt-4">
            <AIChatAssistant word={word} currentStage={currentStage} />
          </div>
        )}

        {/* Reward Toaster */}
        {showReward && rewardData && (
          <RewardToaster
            stars={rewardData.stars}
            xp={rewardData.xp}
            message={rewardData.message}
          />
        )}
      </div>
    </div>
  );
}
