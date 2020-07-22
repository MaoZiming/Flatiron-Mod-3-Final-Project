class LeaderboardPlayer < ApplicationRecord
    belongs_to :leaderboard
    belongs_to :player
end
