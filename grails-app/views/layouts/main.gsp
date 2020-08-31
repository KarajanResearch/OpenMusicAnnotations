<!doctype html>
<html lang="en" class="no-js">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>
        <g:layoutTitle default="Open Music Annotations"/>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <asset:link rel="icon" href="favicon.ico" type="image/x-ico"/>

    <asset:stylesheet src="application.css"/>
    <asset:javascript src="application.js"/>


    <g:layoutHead/>
</head>

<body>

<nav class="navbar navbar-expand-lg navbar-dark navbar-static-top" role="navigation">
    <!--<a class="navbar-brand" href="/#"><asset:image src="grails.svg" alt="Grails Logo"/></a>-->
    <a class="navbar-brand" href="/#"><asset:image height="48px" src="icon-color.png" alt="OMA Logo"/></a>

    <a href="/#">Open Music Annotations</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" aria-expanded="false" style="height: 0.8px;" id="navbarContent">
        <ul class="nav navbar-nav ml-auto">
            <g:pageProperty name="page.nav"/>




            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    Menu
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <g:each var="c" in="${[
                            [   controller: "recording",
                                action: "index",
                                tag: message(code: 'default.menu.recording.label', default: 'Recordings')
                            ],

                            [
                                controller: "user", action: "show",
                                tag: message(code: 'default.menu.user.label', default: 'My Account')
                            ],

                            [
                                controller: "logout",
                                    action: "index",
                                    tag: message(code: 'default.menu.logout.label', default: 'Logout')
                            ]
                    ] }">
                        <li class="controller">
                            <g:link controller="${c.controller}" action="${c.action}">${c.tag}</g:link>
                        </li>
                    </g:each>
                </ul>
            </li>

        </ul>
    </div>



</nav>

<g:layoutBody/>

<div class="footer row" role="contentinfo">

    <div class="col">
        <a href="https://github.com/KarajanResearch/OpenMusicAnnotations" target="_blank">
            <asset:image src="documentation.svg" alt="Grails Documentation" class="float-left"/>
        </a>
        <strong class="centered"><a href="https://github.com/KarajanResearch/OpenMusicAnnotations" target="_blank">Documentation</a></strong>
        <p>Documentation for all the features <a href="https://github.com/KarajanResearch/OpenMusicAnnotations" target="_blank">Github</a>.</p>

    </div>

    <div class="col">
        <a href="https://karajan-research.org/" target="_blank">
            <asset:image src="slack.svg" alt="Slack" class="float-left"/>
        </a>
        <strong class="centered"><a href="https://karajan-research.org/" target="_blank">Join the Community</a></strong>
        <p>Get feedback and share your experience with the community <a href="https://karajan-research.org/" target="_blank">@ Karajan Research</a>.</p>
    </div>
</div>


<div id="spinner" class="spinner" style="display:none;">
    <g:message code="spinner.alt" default="Loading&hellip;"/>
</div>


</body>
</html>
