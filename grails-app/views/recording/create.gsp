<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'recording.label', default: 'Recording')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>


        <asset:javascript src="jquery-3.3.1.min.js" />
        <asset:javascript src="dropzone.js" />
        <asset:stylesheet src="dropzone.css" />
        <asset:stylesheet src="custom-dropzone.css" />

    </head>
    <body>
        <a href="#create-recording" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
            </ul>
        </div>
        <div id="create-recording" class="content scaffold-create" role="main">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
            </g:if>

            <g:hasErrors bean="${this.recording}">
            <ul class="errors" role="alert">
                <g:eachError bean="${this.recording}" var="error">
                <li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
                </g:eachError>
            </ul>
            </g:hasErrors>

            <div id="recording-dropzone" class="dropzone">




            </div>


            <script type="application/javascript">


                $("#recording-dropzone").dropzone({
                    url: "/recording/addDigitalAudio/${this.recording.id}",
                    acceptedFiles: "audio/wave,audio/wav,audio/x-wav,audio/x-pn-wav",
                    timeout: 3600000,
                    maxFilesize: 1024, // MB
                    accept: function(file, done) {
                        console.log("accept");
                        console.log(file);
                        $("input#title").val(file.name);
                        done();
                    },
                    success: function (file) {
                        console.log("accept");
                        console.log(file);

                        //window.location("/recording/show/${this.recording.id}");
                    }
                });


                //console.log(Dropzone.options);
            </script>

            <g:form resource="${this.recording}" method="POST">






                <fieldset class="form">
                    <f:all bean="recording" order="title"/>
                </fieldset>
                <fieldset class="buttons">
                    <g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" />
                </fieldset>



            </g:form>


        </div>
    </body>
</html>
