<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    /**
    
     */
    public function authorize(): bool
    {
       return true;
    }

    /**
     
     
     * @return array<string, 
     */
    public function rules(): array
    {
        return [
            
        ];
    }
}
