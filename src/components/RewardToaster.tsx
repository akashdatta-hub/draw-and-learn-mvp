// Reward Toaster Component
// Per governance: Visible progress, positive reinforcement

interface RewardToasterProps {
  stars: number;
  xp: number;
  message: string;
}

export default function RewardToaster({ stars, xp, message }: RewardToasterProps) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-bounce">
      <div className="card bg-green-100 border-2 border-green-400 shadow-2xl">
        <div className="text-center">
          <div className="text-3xl mb-2">
            {stars > 0 && '⭐'.repeat(stars)}
          </div>
          {xp > 0 && (
            <div className="text-xl font-bold text-blue-600 mb-2">+{xp} XP</div>
          )}
          <div className="text-lg font-semibold text-gray-800">{message}</div>
        </div>
      </div>
    </div>
  );
}
