# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
LeaderboardPlayer.destroy_all
Game.destroy_all
Player.destroy_all

Leaderboard.destroy_all


player1 = Player.create(name: "player1")
player2 = Player.create(name: "player2")
player3 = Player.create(name: "player3")
player4 = Player.create(name: "player4")
player5 = Player.create(name: "player5")
game1 = Game.create(score: 20, player_id: player1.id)
game2 = Game.create(score: 300, player_id: player2.id)
game3 = Game.create(score: 400, player_id: player3.id)
game4 = Game.create(score: 210, player_id: player4.id)
game5 = Game.create(score: 320, player_id: player5.id)
top_player = Leaderboard.create()
top_player.players << player1
top_player.players << player2
top_player.players << player3
top_player.players << player4
top_player.players << player5