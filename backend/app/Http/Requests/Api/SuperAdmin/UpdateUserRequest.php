<?php

namespace App\Http\Requests\Api\SuperAdmin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
        $userId = $this->route('user');
        $isDetailRequired = in_array($this->input('role'), ['Proponent', 'Viewer']);

        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:100'],
            'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'role' => ['sometimes', 'required', 'string', Rule::in(['Super Admin', 'Admin', 'Adviser', 'Proponent', 'Viewer'])],
            'student_id' => [Rule::requiredIf($isDetailRequired), 'nullable', 'string', 'max:50'],
            'department' => [Rule::requiredIf($isDetailRequired), 'nullable', 'string', 'max:50'],
            'program' => [Rule::requiredIf($isDetailRequired), 'nullable', 'string', 'max:50'],
            'adviser_id' => [Rule::requiredIf($isDetailRequired), 'nullable', 'exists:users,id'],
        ];
    }
}
