class Leaderboard < ApplicationRecord
    has_many :leaderboard_players
    has_many :players, through: :leaderboard_players

    def rank_games
        self.display_score.select {|game| game[:name] != "" && game[:max_score] > 0 }.sort{ |a,b| b[:max_score] <=> a[:max_score]}.slice(0, 10)
    end
    
    def display_score
        self.players.map {|player| 
            {
                name: player.name,
                max_score: player.max_score
            }
        }
    end
end
