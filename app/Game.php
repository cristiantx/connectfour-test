<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = ['status', 'player1_id', 'player2_id'];

    public function moves() {
        return $this->hasMany('App\Move');
    }
}
