class Api::V1::GamesController < ApplicationController


    def index 
        games = Game.all 
        render json: games
    end

    def show
        game = Game.find(params[:id])
        render json: game
    end


    def create
        # byebug
        # game = Game.create(game_params)
        game = Game.new(params.require(:game).permit(:score, :player_id))
        game.save()
        render json: game
    end




end
