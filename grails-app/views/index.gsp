<!doctype html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>Open Music Annotations</title>
</head>
<body>





<div class="svg" role="presentation">
    <div class="grails-logo-container">
        <asset:image src="index-header.jpg" class="grails-logo"/>

    </div>
</div>


<style>
    #welcomeScreen {
        margin-top: 40px;
        margin-bottom: 40px;
        width: 60% ;
        margin-left: auto ;
        margin-right: auto ;
        font-size: 1.1em;
    }
    h1.welcome {
        text-align: center;
        font-size: 2em;
        margin-bottom: 40px;
        margin-top: 40px;
    }
    h2.welcome {
        font-size: 1.5em;
        margin-bottom: 20px;
        margin-top: 20px;
    }
</style>

<div id="welcomeScreen">

    <h1 class="welcome">Open Music Annotations</h1>

    <p>
        Welcome to the Open Music Annotation Cloud, a database for any type of terms, tags, or attributes that humans associate with audible music.
    </p>
    <p>
        <g:link controller="user" action="index">Create Account</g:link> to get started.
    </p>

    <h1 class="welcome">Documentation</h1>

    <h2 class="welcome">Notes for Musicologists</h2>

    <ul>
        <li>uploading audio</li>
        <li>adding annotations</li>
        <li>the classical music catalog</li>
        <li>written-first v.s. recorded-first music</li>
    </ul>

    <h2 class="welcome">Notes for Programmers</h2>
    <ul>
        <li>introduction to musical data</li>
        <li>API of oma.cloud</li>
        <li>musical python notebooks</li>
    </ul>




</div>

</body>
</html>
