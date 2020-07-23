class Leaderboard < ApplicationRecord
    has_many :leaderboard_players
    has_many :players, through: :leaderboard_players


    def rank_games
        self.display_score.sort{ |a,b| b[:max_score] <=> a[:max_score]}
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
