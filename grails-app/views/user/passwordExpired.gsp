<!doctype html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>Open Music Annotations</title>
</head>
<body>


<style type="text/css">

    #login{
        margin: 15px 0px;
        padding: 0px;
        text-align: center;
    }

    #login .inner {
        width: 440px;
        padding: 20px;
        margin: 60px auto;
        text-align: left;
        border: 1px solid #aab;
        background-color: #f0f0fa;
        -moz-box-shadow: 2px 2px 2px #eee;
        -webkit-box-shadow: 2px 2px 2px #eee;
        -khtml-box-shadow: 2px 2px 2px #eee;
        box-shadow: 2px 2px 2px #eee;
    }
    .fheader{
        font-size: larger;
    }

</style>



<div id='login'>
    <div class='inner'>
        <g:if test='${flash.message}'>
            <div class='login_message'>${flash.message}</div>
        </g:if>
        <div class='fheader'>Please update your password...</div>


        <g:form action='updatePassword' id='passwordResetForm' class='cssform' autocomplete='off'>


            <table>
                <tr>
                    <td>Username</td>
                    <td>${username}</td>
                </tr>
                <tr>
                    <td>Current Password</td>
                    <td><g:passwordField name='password' class='text_' /></td>
                </tr>
                <tr>
                    <td>New Password</td>
                    <td><g:passwordField name='password_new' class='text_' /></td>
                </tr>
                <tr>
                    <td>Repeat Password</td>
                    <td><g:passwordField name='password_new_2' class='text_' /></td>
                </tr>


            </table>

            <p>
                <input type='submit' value='Save' />
            </p>
        </g:form>
    </div>
</div>




</body>
</html>