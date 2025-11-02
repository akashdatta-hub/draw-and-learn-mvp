#!/bin/bash

# Fix unused variables in lib files
sed -i '' 's/const { type, user_id, session_id, ts, ...rest } = event;/const { type, user_id, session_id, ts } = event;/' src/lib/analytics.ts
sed -i '' 's/  canvasData: ImageData | HTMLCanvasElement,/  _canvasData: ImageData | HTMLCanvasElement,/' src/lib/aiRecognition.ts
sed -i '' 's/private currentUtterance:/private _currentUtterance:/' src/lib/tts.ts
sed -i '' 's/this.currentUtterance = /this._currentUtterance = /g' src/lib/tts.ts

# Fix unused in pages
sed -i '' 's/, getStreak//' src/pages/debug.tsx

# Fix unused in hooks
sed -i '' 's/  const markReviewed = useCallback(/  const markReviewed = useCallback(/' src/hooks/useSpacedRepetition.ts
sed -i '' 's/    (wordId: string, passed: boolean, currentInterval: number): string => {/    (_wordId: string, passed: boolean, currentInterval: number): string => {/' src/hooks/useSpacedRepetition.ts

# Fix unused in StageChallenge
sed -i '' "s/import TTSButton from/\/\/ import TTSButton from/" src/components/stages/StageChallenge.tsx

echo "Fixed remaining issues"
