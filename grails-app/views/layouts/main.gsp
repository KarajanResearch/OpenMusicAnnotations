<!doctype html>
<html lang="en" class="no-js">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>
    Karajan Research: Open Music Annotations
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <asset:link rel="icon" href="favicon.ico" type="image/x-ico"/>

    <asset:stylesheet src="application.css"/>
    <asset:javascript src="application.js"/>


    <g:layoutHead/>
</head>

<body>

<nav class="navbar navbar-expand-lg navbar-dark navbar-static-top" role="navigation">
    <a class="navbar-brand" href="/#"><asset:image height="48px" src="icon-color.png" alt="OMA Logo"/></a>

    <a href="/#">Karajan Research: Open Music Annotations</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" aria-expanded="false" style="height: 0.8px;" id="navbarContent">
        <ul class="nav navbar-nav ml-auto">
            <g:pageProperty name="page.nav"/>


            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    Browse Data
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <g:each var="c" in="${[
                            [   controller: "data",
                                action: "index",
                                tag: "Tempo Annotations"
                            ],


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
        <p><a href="https://github.com/KarajanResearch/OpenMusicAnnotations" target="_blank">Github</a>.</p>

    </div>



    <div class="col">
        <a href="https://karajan-research.org/" target="_blank">
            <asset:image src="slack.svg" alt="Slack" class="float-left"/>
        </a>
        <strong class="centered"><a href="https://karajan-research.org/" target="_blank">Join the Community</a></strong>
        <p><a href="https://karajan-research.org/" target="_blank">@ Karajan Research</a>.</p>
    </div>

    <div class="col">
        <a href="/imprint" >
            <span style="width: 100%; text-align: center;">Imprint and Privacy</span>
        </a>

    </div>

</div>


<div id="spinner" class="spinner" style="display:none;">
    <g:message code="spinner.alt" default="Loading&hellip;"/>
</div>


</body>
</html>
