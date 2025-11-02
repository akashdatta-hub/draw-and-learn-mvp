#!/bin/bash

# Remove unused React imports
sed -i '' "s/import React, /import /" src/components/AIChatAssistant.tsx
sed -i '' "s/import React, /import /" src/components/RewardToaster.tsx  
sed -i '' "s/import React, /import /" src/components/TTSButton.tsx
sed -i '' "s/import React, /import /" src/components/stages/StageRetry.tsx
sed -i '' "s/import React, /import /" src/components/stages/StageReview.tsx
sed -i '' "s/import React, /import /" src/components/stages/StageTry.tsx
sed -i '' "s/import React, /import /" src/pages/debug.tsx
sed -i '' "s/import React, /import /" src/pages/index.tsx
sed -i '' "s/import React, /import /" src/pages/leaderboard.tsx
sed -i '' "s/import React, /import /" src/pages/review.tsx
sed -i '' "s/import React, /import /" src/pages/word/\[wordId\].tsx

echo "Fixed unused React imports"
