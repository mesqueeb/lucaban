<?php

namespace App;

// use Laravel\Passport\HasApiTokens;
// →　Tried passport but then replaced with JWT
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    public function items()
    {
        return $this->belongsToMany('App\Item');
    }
    public function scopeUserItems($query)
    {
        $query->find(auth()->id())->items();
    }
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
}
