<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Move extends Model
{

	protected $fillable = ['game_id', 'column', 'player_id'];

    public function game() {
        return $this->hasOne('App\Game');
    }

    public function player() {
        return $this->hasOne('App\Player');
    }
}
