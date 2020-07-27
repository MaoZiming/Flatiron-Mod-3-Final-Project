// Credit: The modal window was adapated from https://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/

// The rest are coded from scratch

const character = document.querySelector("#character") 
const bar = document.querySelector("#bar")
const bar_width = 20

var start = document.querySelector("#start") //start box
var next = document.querySelector("#block")  //next box

const score = document.querySelector("#score")
const bonus = document.querySelector("#bonus")
const name_input = document.querySelector("#name")
const name_display = document.querySelector("#name_display")

const mOverlay = document.querySelector("#modal_window")
const mOpen = document.querySelector('#modal_open')
const mClose = document.querySelector('#modal_close')
const modal = document.querySelector('#modal_holder')
var modalOpen = false

const leaderboard_btn = document.querySelector("#leaderboard")
const leaderboard_div = document.querySelector("#leaderboard_div")
const btn_close = document.querySelector("#close")

var time_hold = 0 // record the time the space_key is held
var timer_function = null // the event that the space key is held
var char_bottom = 27  // character bottom (percentage)
var char_left = 24
var char_height = 16
var char_width = 3  


var next_left = 40 //next box left (percentage)
var next_width = 15 //next box width (perecntage)

var start_width = 10 //start box width (percentage)
var start_left = 20 //start box left (percentage)

const jump_height = 60  //maximum jump_height (percentage)
const jump_width = 80  //maximum jump_width (percentage)
const right_border = 100 - char_width 
const speed_factor_y = 5  //set the speed of vertical jump
const speed_factor_x = 1.5

var shift_distance   //the distance shifted after each jump round

var from = start //the object where the character jumps from, used for landing on the same object determination

var round_passed = 0 //record the number of rounds passed
var score_number = 0 //total number of scores
var consecutive_times = 1
var keyDown = false  //if key is down

var top_players  //top_players for leaderboard

var players_list //list of players

get_players() //eq. to start

function get_players(){ //make a fetch requests to get players

  fetch("http://localhost:3000/api/v1/players")
  .then(res => res.json())
  .then(res => {
    players_list = res
    modalShow ()  //show modal window
    create_players_selection(res)
  })

}

function create_players_selection(players){   
  
  //create existing players selection dropdown box
  
  const player_selection_div = document.querySelector("#player_selection")
  player_selection_div.innerHTML = ""
  const l = document.createElement("label")
  l.innerText = "Select from existing players"
  const br = document.createElement("br")
  var selectList = document.createElement("select")
  selectList.id = "selectList"
  var option = document.createElement("option")
  option.value = -1
  option.text = "Nothing Selected"
  selectList.appendChild(option)
  for (let player of players){
    var option = document.createElement("option")
    option.value = player.id
    option.text = player.name
    selectList.appendChild(option)
  }

  // update player input if dropdown selection box changes
  selectList.addEventListener("change", function(){
    if (selectList.selectedIndex !== 0){
      name_input.value = selectList.options[selectList.selectedIndex].text
      name_display.innerText = name_input.value
    }
  })

  player_selection_div.append(l, br, selectList)

  // If the current_player is an existing player, update the dropdown selection box
  if (players_list.find(player => player.name == name_display.innerText)){
    selectList.selectedIndex = players_list.findIndex(player => player.name == name_display.innerText) + 1
  }
  else {
    selectList.selectedIndex = 0
  }

}

const record_player = function(username, score){  
  
  // after the game ends, record the name of the player

  if (username == "") {
    return
  }
  if (players_list.find(player => player.name == username)){
    let player_id = players_list.find(player => player.name == username).id
    record_game(score, player_id)
    return
  }
  let configObj_player = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: username
    })
  }

  fetch("http://localhost:3000/api/v1/players", configObj_player)
  .then(res => res.json())
  .then(res => record_game(score, res.id)) 
  // after recording the player, record the game with the score
}

const record_game = function(score, id){

  let configObj_game = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      score: score,
      player_id: id
    })
  }

  fetch("http://localhost:3000/api/v1/games", configObj_game)
  .then(res => res.json())
  .then(get_players())

}


btn_close.addEventListener("click", function(){
  modalClose()
})

leaderboard_btn.addEventListener("click", function(){

  if (leaderboard_div.innerText != ""){
    leaderboard_div.innerText = ""
  }
  else {
  fetch("http://localhost:3000/api/v1/leaderboards/1")
  .then(res => res.json())
  .then(res => {
    top_players = res

  leaderboard_div.innerText = ""

  const ol = document.createElement("ol")
  for (const index in top_players){
    const li = document.createElement("li")
    li.innerText = top_players[index].name + " | " + top_players[index].max_score
    ol.append(li)
  }
  leaderboard_div.append(ol)
  })}
})

const keydown_function = function(event){  //when "space" key is pressed down
  keyDown = true 
  if (event.repeat || event.keyCode !== 32) { return } //make sure space is pressed'
  key_hold_sound()
  var height_percentage = 1
  timer_function = setInterval(function(){ 
      if (height_percentage > 0.5){
        height_percentage -= 0.001
      }
      character.style.height = (height_percentage*char_height) + 
      "%"   //shrink the character height when "space" is pressed
      time_hold += 5
      let bar_current_width = bar_width * (4000 - time_hold) / 4000
      if (bar_current_width > 0){
          bar.style = `width: ${bar_current_width}%`
      }
  }, 1)   
}


const keyup_function = function(event){ //when "space" key is lifted

  if (!keyDown) {return}
  if (event.isComposing || event.keyCode !== 32) {
      return
  }
  character.style.height = "16%"
  key_hold_sound_pause()
  land_sound()
  let height_percentage = time_hold > 4000 ? 1 : time_hold / 4000
  jump(height_percentage)
  clearInterval(timer_function) //clear the hold down function
  bar.style = `width: ${bar_width}%` //reset the bar
  time_hold = 0
  keyDown = false
}

function create_next_box(left = 30, width = 8){  
  
  // after the boxes are shifted, create a new box by
  // changing the location of the start box

  if (left == null) left = 30
  if (width == null) width = 3


  start.style.left = left + "%"
  start.style.width = width + "%"
  start.style.opacity = 1

  next_left = left 
  next_width = width
  return start
}

function shift_next(){  
  
  //after each jump, shift everything to the left

  let id = setInterval(frame, 1)
  let ct = 0
  shift_distance = next_left + next_width / 2 - start_left - start_width / 2 - (Math.random()*2) //needs to be changed later
  document.removeEventListener("keyup", keyup_function)
  document.removeEventListener("keydown", keydown_function)


  function frame(){
    if (ct > shift_distance){
      clearInterval(id)
      bonus.innerText = ""
      start_left = next_left   //next box is shifted to the left 
      start_width = next_width  //next box becomes the new start box
      let tmp = next
      if (box_location[round_passed -1] == undefined){
        alert("Game over, you have passed all the boxes!")
        score_number = 0
        score.innerText = ` Score: ${score_number }`
        record_player(name_display.innerText, score_number)

        
      }
      next = create_next_box(next_left + box_location[round_passed-1].left + next_width, box_location[round_passed-1].width) //next box becomes the new box created from start box
      start = tmp //start box becomes the (then) next box    
      document.addEventListener("keyup", keyup_function)
      document.addEventListener("keydown", keydown_function)
    }
    
    else {
      ct += shift_distance/250
      next_left -= shift_distance/250
      char_left -= shift_distance/250
      start_left -= shift_distance/250
      next.style.left = next_left + "%"
      character.style.left = char_left + "%"
      start.style.left = start_left + "%"
    }
  }
}


function jump(height_percentage){

    let id = setInterval(frame, 1)
    let current_bottom = char_bottom
    let current_left = char_left
    let max_height = char_bottom + jump_height * height_percentage
    let max_length = jump_width / 2

    document.removeEventListener("keyup", keyup_function)
    document.removeEventListener("keydown", keydown_function)

    function frame() {
      if (current_bottom > max_height) {
        clearInterval(id)
        document.addEventListener("keyup", keyup_function)
        document.addEventListener("keydown", keydown_function)
        fall(current_bottom, max_height, current_left, height_percentage)
        
      } else {
        current_bottom += Math.sqrt( max_height - current_bottom) / speed_factor_y 
        // v^2 = 2gx => velocity is proportional to sqrt(distance)
        character.style.bottom = current_bottom + '%'
        if (current_left < right_border){
            current_left += speed_factor_x * height_percentage
            character.style.left = current_left + '%'
        }
      }
    }
}

function fall(current_bottom, max_height, current_left, height_percentage){
    let id = setInterval(frame, 1)
    document.removeEventListener("keyup", keyup_function)
    document.removeEventListener("keydown", keydown_function)
    let max_length = jump_width
    let checked = false
    var rotated = false
    function frame() {
        let rotated_dist = 0  
        
        //rotated_dist is used to account for the change in height caused by rotation
        //so if the char reaches button while being rotated
        // current_bottom - rotated_dist = 0

        if (rotated) {
          rotated_dist = char_width * 2 //this gives the correct position
        }

        if (current_bottom - rotated_dist<= 0){ 
          
            //when the box touches the bottom

            fall_sound()
            clearInterval(id)
            record_player(name_display.innerText, score_number)
            alert( `Score: ${score_number }`)

            score_number = 0
            score.innerText = ` Score: ${score_number }`
        }

        else if (current_bottom <= char_bottom) {
          // If the bottom of the character reaches below the button of the boxes
          
          char_left = current_left

          if (checkPass() && char_left + char_width/2 < next_left){
            // if only the first-half of the character is on the box
            checked = true
            character.style.transform = "rotate(-90deg)"
            // Because the center of the rotation is bottom left
            // we don't need to account for rotate_distance
            
          }
          if (checkPass() && char_left + char_width /2 > next_left + next_width){
            // if only the next-half of the character is on the box
            
            checked = true
            character.style.transform = "rotate(90deg)"
            rotated = true
          }
          if (checkPass(true) && !checked) {   
            
              //if character lands on the next box

              document.addEventListener("keyup", keyup_function)
              document.addEventListener("keydown", keydown_function)
              clearInterval(id)
              start.style.opacity = 0 // hide the start box
              round_passed ++
              score_number += 10
              score.innerText = ` Score: ${score_number }`
              if (from == start){   //if the character is jumped from the start box
                from = next 
                shift_next()
              }
          }
          else {
              if (char_left + char_width /2 <= start_width + start_left){   
                
                //haven't left the starting box

                document.addEventListener("keyup", keyup_function)
                document.addEventListener("keydown", keydown_function)
                clearInterval(id)
                consecutive_times = 0
              }
              else {   //left the starting box but misses

                if (char_left <= start_width + start_left){
                  // less than half of the character is on the start box

                  char_left = start_width + start_left
                  character.style.left = (char_left) + "%"
                  character.style.transform = "rotate(90deg)"
                  rotated = true
                }

                current_bottom -= Math.sqrt(max_height - current_bottom + 0.01) /speed_factor_y
                character.style.bottom = current_bottom + '%'

                if (current_left < right_border ){
                  if (current_left + char_width  > next_left && current_left + char_width < next_left + next_width){return}
                  // If the right border of the character hits the box
                  // Stop incrementing the left value
                  
                  else {
                  current_left += speed_factor_x * height_percentage
                  character.style.left = current_left + '%'
                  }
                }

              }
          }
          checked = true  //We have checked the pass     
        } 
        
        else { //still flying above the height of the box
          current_bottom -= Math.sqrt( max_height - current_bottom + 0.01) /speed_factor_y
          character.style.bottom = current_bottom + '%'
          if (current_left < right_border ){

            current_left += speed_factor_x * height_percentage
            character.style.left = current_left + '%'

        }
        }
    }    
}

function checkPass(cumulative = false){ 
  
    //check if the character lands on the next box

    let error_margin = next_width * 0.2
    if (cumulative && char_left + char_width/2 > next_left + next_width /2 - error_margin && char_left + char_width /2 < next_left + next_width /2 + error_margin ){

    // If the character hits within error_margin to the center

      bonus.innerText = "+" + 10 * (Math.pow(2, consecutive_times - 1))
      bonus.style.left = char_left + "%"
      score_number += 10 * (Math.pow(2, consecutive_times - 1))
      consecutive_times ++ 
      score.innerText = ` Score: ${score_number }`
      combo_sound()
    }
    else {
      if (cumulative){
      consecutive_times = 1}
    }

    if (char_left + char_width > next_left && char_left < next_left + next_width) {return true}
    // If the character hits the next box

    else {
       return false
    }
}

let enterClose = function(event){  
  //when "enter" is pressed, it is going to close the modal window

  if (event.code === "Enter"){
    modalClose(event)
    document.removeEventListener("keydown", enterClose)
  }
}

function modalShow () {
  lastFocus = document.activeElement
  name_display.innerText = name_input.value

  mOverlay.setAttribute('aria-hidden', 'false')
  modalOpen = true
  modal.setAttribute('tabindex', '0')
  document.addEventListener("keydown", enterClose)
  modal.focus()


  name_input.addEventListener("input", function(){

    // If the value of name_input matches one of the existing usernames
    // Update the selection box to reflect that

    if (modalOpen){
      name_display.innerText = name_input.value
      const selectList = document.querySelector("#selectList")

      if (players_list.find(player => player.name == name_display.innerText)){
        selectList.selectedIndex = players_list.findIndex(player => player.name == name_display.innerText) + 1
      }
      else {
        selectList.selectedIndex = 0
      }
    } 
  })
}

// mClose is the close button
mClose.addEventListener('click', modalClose)


function modalClose ( event ) {
  if (modalOpen) {
    mOverlay.setAttribute('aria-hidden', 'true')
    modal.setAttribute('tabindex', '-1')
    modalOpen = false
    lastFocus.focus()
    leaderboard_div.innerText = ""
    // Start the game
    document.addEventListener("keyup", keyup_function)
    document.addEventListener("keydown", keydown_function)
    restart()
  }
}

function focusRestrict ( event ) {
  if ( modalOpen && !modal.contains( event.target ) ) {
    event.stopPropagation()
    modal.focus()
  }
}

function restart(){  //restart the game and reposition all the components
   character.style.left = "24%"
   character.style.bottom = "27%"
   character.style.transform = ""
   start.style.left = "20%"
   next.style.left = "40%"
   start_width = 10
   next_width = 15
   start.style.width = "10%"
   next.style.width = "15%"
   next_left = 40
   start_left = 20
   round_passed = 0
   consecutive_times = 0
   char_left = 24
   char_bottom = 27
}