class Api::V1::PlayersController < ApplicationController


    def index 
        players = Player.all
        render json: players
    end

    def show
        player = Player.find(params[:id])
        render json: player
    end

    def create
        player = Player.create(player_params)
        Leaderboard.all[0].players << player
        render json: player
    end

    def update
        # byebug
        player = Player.find(params[:id])
        player.update(player_params)
        render json: player
    end

    # def destroy
    #     player = Player.find(params[:id])
    #     player.destroy
    #     render json: "Player deleted!!"
    # end

    private

    def player_params
        params.require(:player).permit(:name)
    end


end
