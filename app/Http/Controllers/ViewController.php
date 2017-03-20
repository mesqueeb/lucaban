<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class viewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', [
            'except'=>['index','indexJA'],
        ]);
    }
    public function index()
    {
        return view('layouts.welcome')->with('defaultLanguage','en');
    }
    public function indexJA()
    {
        return view('layouts.welcome')->with('defaultLanguage','ja');
    }
    public function items()
    {
    	$tags = \App\Item::existingTags();
		return view('items.index')->with('tags',$tags);
    }
}
