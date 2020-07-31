<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
    <title><g:message code="default.show.label" args="[entityName]" /></title>
</head>
<body>

<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
    </ul>
</div>
<div id="register-user" class="content scaffold-show" role="main">
    <h1><g:message code="default.register.label" args="[entityName]" /></h1>
    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>



    <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div class="card card-signin my-5">
                <div class="card-body">
                    <h2 class="card-title text-center">Register Here</h2>
                    <g:if test='${flash.message}'>
                        <div class="alert alert-danger" role="alert">${flash.message}</div>
                    </g:if>
                    <form class="form-signin" action="register" method="POST" id="loginForm" autocomplete="off">


                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" placeholder="Your username" class="form-control" name="username" id="username" autocapitalize="none"/>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" placeholder="Your password" class="form-control" name="password" id="password"/>
                        </div>

                        <div class="form-group">
                            <label for="password">Re-Enter Password</label>
                            <input type="password" placeholder="Re-enter password" class="form-control" name="repassword" id="repassword"/>
                        </div>

                        <div class="form-group">
                            <label for="username">Email Address</label>
                            <input type="text" placeholder="Your email address" class="form-control" name="email" id="email" autocapitalize="none"/>
                        </div>

                        <button id="submit" class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Register</button>
                        <hr class="my-4">
                        <p>Already have an account? <g:link controller="login" action="auth">Login</g:link></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        document.addEventListener("DOMContentLoaded", function(event) {
            document.forms['loginForm'].elements['username'].focus();
        });
    </script>



</div>



</body>
</html>