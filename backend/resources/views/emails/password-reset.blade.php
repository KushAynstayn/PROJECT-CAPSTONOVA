<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        /* CSS resets and base styles for email clients */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    </style>
</head>
<body style="background-color: #f7fafc; margin: 0 !important; padding: 40px 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); padding: 40px;">

                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <img src="{{ $message->embed(public_path('images/logo_capstonova1.png')) }}" alt="Project Capstonova Logo" width="60" style="display: block; margin-bottom: 10px;">
                            
                            <h1 style="font-size: 16px; font-weight: 700; color: #718096; margin: 0; letter-spacing: 1px; text-transform: uppercase;">PROJECT CAPSTONOVA</h1>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <h2 style="font-size: 28px; font-weight: 700; color: #2d3748; margin: 0;">Reset your password</h2>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 15px 0 25px 0; font-size: 16px; color: #4a5568; line-height: 1.5;">
                           Click the button below to reset your account password.
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <a href="{{ $resetUrl }}" target="_blank" style="background-color: #991b1b; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 15px 35px; border-radius: 6px; display: inline-block;">
                                Reset Password
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="font-size: 14px; color: #718096; padding-top: 20px;">
                            This password reset link will expire in 60 minutes.
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="font-size: 14px; color: #718096; padding-top: 5px; padding-bottom: 20px;">
                            If you did not request a password reset, you can safely ignore this email.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>