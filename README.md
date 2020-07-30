# Flatiron Module Final Project: Square Jump
## Made by Ziming Mao
## Short Description

Square Jump is a single page Javascript game. Player controls the avatar by pressing the space key to jump from box to box. Video Link: https://youtu.be/N5zGHOdjvlc
 
## Features
Press the key “Space” to control the jump. The bar at the top right corner will show how long the “space” key is pressed. The longer the “space” is pressed, the longer the jump will be.
If the player avatar doesn’t land on another box, the game ends. If the player avatar lands on the next box, the player gets 10 points and a new box is created. The cycle continues.
The box will get thinner as the user gets more points to increase difficulty. Landing at the center of the box will give the user more points. The bonus points will increase as user makes consecutive jumps to the center


## Install instructions

To install the app, git clone the repository in your local directory. Go to backend folder, Run:
```ruby
bundle install
```
To install all required gems. Run:
```ruby
rails db:migrate 
```
To migrate all changes to the database. 
```ruby
rails db:seed
```
To migrate seed the database. 

Finally, run 
```ruby
rails s
```
To run the backend. 
To open the game front end, simply open index.html

## Contributor's guide

Pull requests are welcome. Please make sure that your PR is well-scoped.
For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License

Copyright (c) 2020 Ziming Mao

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
