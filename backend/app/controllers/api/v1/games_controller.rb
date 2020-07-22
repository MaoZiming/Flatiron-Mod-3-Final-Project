class Api::V1::GamesController < ApplicationController


    def index 
        games = Game.All 
        render json: games
    end

    def show
        game = Game.find(params[:id])
        render json: game
    end


end
