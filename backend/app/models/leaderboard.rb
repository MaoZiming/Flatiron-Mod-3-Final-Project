class Leaderboard < ApplicationRecord
    has_many :leaderboard_players
    has_many :players, through: :leaderboard_players
end
