<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/game/{any?}', function ( $id ) {
    return view('welcome', [ 'user' => App\User::find( $id ) ]);
});


Route::group(['prefix' => 'api'], function () {
    Route::get('game', 'GameController@index');
    Route::put('game', 'GameController@updateGame');
    Route::post('moves', 'GameController@create');
});
