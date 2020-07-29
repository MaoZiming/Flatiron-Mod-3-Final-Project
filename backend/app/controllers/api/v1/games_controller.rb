class Api::V1::GamesController < ApplicationController


    def index 
        games = Game.all
        
        render json: games, only: [:id, :score], include: :player
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

    def destroy
        game = Game.find(params[:id])
        player = game.player
        game.destroy
        if player.games.length == 0 
            
            # Destroy the joiner class with that player as well.
            LeaderboardPlayer.all.find_by(player_id: player.id).destroy
            player.destroy

        end

        games = Game.all
        render json: games
    end




end
