<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function index()
    {
        $users = User::latest()->paginate(10);

        return response()->json($users);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,customer',
            'status' => 'required|in:active,inactive,banned'
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json($user, 201);
    }


    public function show(User $user)
    {
        return response()->json($user);
    }


    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
            'role' => 'sometimes|in:admin,customer',
            'status' => 'sometimes|in:active,inactive,banned'
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json($user);
    }


    public function destroy(User $user)
    {
        $user->update([
            'status' => 'inactive'
        ]);

        return response()->json([
            'message' => 'User deactivated'
        ]);
    }

}
