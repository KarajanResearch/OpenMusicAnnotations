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
        width: 80% ;
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
        text-align: center;
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
    <h2 class="welcome">
        <g:link controller="user" action="index">Create Account</g:link> or <g:link controller="login" action="auth">Login</g:link> to get started.
    </h2>
    <p>
        All data you add is private to you by default.
    </p>

    <h2 class="welcome">
         <g:link controller="recording" action="index">Browse and Edit Recordings</g:link>.
    </h2>

    <h1 class="welcome">Documentation</h1>

    <h2 class="welcome">Adding your own Recordings</h2>
    <iframe width="1015" height="571" src="https://www.youtube.com/embed/N_LR1BFODoM?rel=0&vq=hd1080" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


    <h2 class="welcome">Data Analysis with Python Notebooks</h2>

    <p>
        Watch the video and have a look at the tutorials at <a href="https://github.com/KarajanResearch/oma-jupyter-tutorials" title="Tutorials on Github" target="_blank">Github</a>.
    </p>
    <iframe width="1015" height="571" src="https://www.youtube.com/embed/FJ6h4ce9J2w?rel=0&vq=hd1080" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>





    <!--
    <h3>Misc.</h3>
    <ul>
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

-->


</div>

</body>
</html>
