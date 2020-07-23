class Api::V1::LeaderboardsController < ApplicationController


    def index 
        leaderboards = Leaderboard.all 
        render json: leaderboards
    end

    def show
        leaderboard = Leaderboard.all[0].rank_games
        render json: leaderboard
    end


end
