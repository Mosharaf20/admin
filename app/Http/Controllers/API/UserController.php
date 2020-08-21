<?php

namespace App\Http\Controllers\API;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //$this->authorize('isAdmin');
        if (Gate::allows('isAdmin') || Gate::allows('isAuthor')) {
            return response(User::latest()->paginate(6));
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request,[
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'bio'=>['required','max:255'],
            'rule'=>['required'],
            'name'=>['required','max:255','string'],
        ]);
        User::create([
            'name'=>$request['name'],
            'email'=>$request['email'],
            'bio'=>$request['bio'],
            'rule'=>$request['rule'],
            'password'=>Hash::make($request['password'])
        ]);
        return response(['message'=>'success']) ;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request)
    {
        $user =auth('api')->user();
        $this->validate($request,[
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|min:8',
            'name'=>'required|max:255',
        ]);

        $currentAvatar = $user->avatar;

        if($request->avatar != $currentAvatar)
        {
            $name = time().'.'.explode('/',substr($request->avatar,0,strpos($request->avatar,';')))[1];
            Image::make($request->avatar)->save(public_path('img/profile/').$name);
            $request->merge(['avatar'=>$name]);

            $photoPath = public_path('img/profile/'.$currentAvatar);
            if(file_exists($photoPath))
            {
                @unlink($photoPath);
            }
        }

        if(!empty($request->password))
        {
            $request->merge(['password'=>Hash::make($request['password'])]);
        }
        $user->update($request->all());

        return response(['message'=>'success']);

    }

    public function profile()
    {
       return auth('api')->user();
    }

    public function searching()
    {
        $keyword =request()->get('q');
        if ($keyword) {
            $users = User::Where('name', 'LIKE', '%' . $keyword . '%')
                ->orWhere('rule', 'LIKE', '%' . $keyword . '%')
                ->orWhere('email', 'LIKE', '%' . $keyword . '%')->paginate(10);
        }else{
            $users = response(User::latest()->paginate(6));
        }
        return $users;
    }

    public function show($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->validate($request,[
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|string|min:8',
            'bio'=>['required','max:255'],
            'rule'=>['required'],
            'name'=>['required','max:255','string'],
        ]);

        if(!empty($request->password))
        {
            $password =Hash::make($request['password']);
        }

        $user->update(array_merge([
            'name'=>$request['name'],
            'email'=>$request['email'],
            'bio'=>$request['bio'],
            'rule'=>$request['rule'],
        ],['password'=>$password ?? $user->password]
    ));
        return response(['message'=>'success']) ;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response(['message'=>'Deleted Successfully']);
    }
}
