<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        
        return true; 
    }

    
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
            // is_admin is optional for the form, defaults to false in the controller
            'is_admin' => ['sometimes', 'boolean'],
        ];
    }
}