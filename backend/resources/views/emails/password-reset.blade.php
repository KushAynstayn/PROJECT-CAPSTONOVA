<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <h2>Reset Your Password</h2>
    <p>You are receiving this email because we received a password reset request for your account.</p>
    <p>Please click the button below to reset your password:</p>
    
    <a href="{{ $resetUrl }}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block;">
        Reset Password
    </a>

    <p>This password reset link will expire in 60 minutes.</p>
    <p>If you did not request a password reset, no further action is required.</p>
</body>
</html>