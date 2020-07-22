class Api::V1::PlayersController < ApplicationController


    def index 
        players = Player.All 
        render json: players
    end

    def show
        player = Player.find(params[:id])
        render json: player
    end




end
