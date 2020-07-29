class Player < ApplicationRecord
    has_many :games
    has_many :leaderboard_players
    has_many :leaderboards, through: :leaderboard_players

    def max_score
        if self.games.length == 0 then
            return 0
        end
        self.games.max {|a,b| a.score <=> b.score}.score
    end
end
