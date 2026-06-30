<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseApiController
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if ($user->role !== 'admin') {
                return response()->json([
                    'message' => 'Access denied'
                ], 403);
            }
            if ($user->status !== 'active') {
                return response()->json([
                    'message' => 'Account is not active'
                ], 403);
            }

            $token = $user->createToken('admin-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logged out successfully'
            ]);
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }

    public function me(Request $request)
    {
        try {
            return response()->json($request->user());
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }
}
