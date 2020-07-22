class Player < ApplicationRecord
    has_many :games
    has_many :leaderboard_players
    has_many :leaderboards, through: :leaderboard_players
end
