function key_hold_sound(){
    document.getElementById('audio_hold').play()
  }
  
function key_hold_sound_pause(){
    document.getElementById('audio_hold').pause()
    document.getElementById('audio_hold').currentTime = 0
}

function land_sound(){
    document.getElementById('audio_land').play()
}

function fall_sound(){
    document.getElementById('audio_fall').play()
}

function combo_sound(){
    if (consecutive_times == 1){
        document.getElementById('combo_one').play()
    }
    else if (consecutive_times == 2){
        document.getElementById('combo_two').play()
    }
    else if (consecutive_times >= 3){
        document.getElementById('combo_three').play()
    }
}
  