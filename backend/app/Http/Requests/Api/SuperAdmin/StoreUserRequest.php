<?php

namespace App\Http\Requests\Api\SuperAdmin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isDetailRequired = in_array($this->input('role'), ['Proponent', 'Viewer']);

        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', 'string', Rule::in(['Super Admin', 'Admin', 'Adviser', 'Proponent', 'Viewer'])],
            'student_id' => [Rule::requiredIf($isDetailRequired), 'nullable', 'string', 'max:50'],
            'department' => [Rule::requiredIf($isDetailRequired), 'nullable', 'string', 'max:50'],
            'program' => [Rule::requiredIf($isDetailRequired), 'nullable', 'string', 'max:50'],
            'adviser_id' => [Rule::requiredIf($isDetailRequired), 'nullable', 'exists:users,id'],
        ];
    }
}
