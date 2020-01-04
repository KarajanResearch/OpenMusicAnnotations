
<div id="search-${this.searchBean}" class="content scaffold-edit" role="main">

    <asset:javascript src="jquery-2.2.0.min.js" />
    <asset:javascript src="search/base.js" />

<div>
    <f:field property="${this.searchBean}-search" label="Search ${this.searchBean.capitalize()}">

        <g:textField id="${this.searchBean}-search" name="${this.searchBean}-search" />

        <div>
            <ul id="${this.searchBean}-search-results"></ul>
        </div>

        <g:hiddenField name="${this.searchBean}" id="${this.searchBean}" />
    </f:field>
</div>

    <!--

    <f:field property="${this.searchBean + "-resultName"}" label="Selection">
        <g:field type="text" size="50" name="${this.searchBean}ResultName" id="${this.searchBean}ResultName" />
    </f:field>

-->

    <script type="application/javascript">


    <g:applyCodec encodeAs="none">

        newSearchBase(
            "${this.searchBean}",
            ${this.searchBase},
            "${this.searchBean}-search-results",
            undefined,
            "#${this.searchBean}-search",
            function (id, name) {
                $("#${this.searchBean}").val(id);
                //$("#${this.searchBean + "ResultName"}").val(name);
                $("#${this.searchBean + "-search"}").val("");
                $("#${this.searchBean + "-search-results"}").empty();


                // trigger events for the outside world
                ${this.onSelected}(id, name);


            }
        );

        </g:applyCodec>


            $("#${this.searchBean + "-search"}").ready(function(arg) {

                console.log("${this.searchBean} search ready");
                var t0 = performance.now();

                // convention: searchBean must be a valid controller name that
                // must implement getSearchBase

                var ajaxUrl="${createLink(controller: this.searchBean, action:'getSearchBase')}";

                console.log(ajaxUrl);

                $.ajax({
                    url:ajaxUrl,
                    data: {
                        //workId: workId
                    },
                    success: function(resp) {
                        //console.log(resp);
                        if (resp["Error"]) {
                            console.log(resp["Error"]);
                            return;
                        }
                        /** Hack: call updateSearBase again, set search data lazyly */
                        updateSearchBase("${this.searchBean}", resp);
                        var t1 = performance.now();
                        console.log("Call to newSearchBase for ${this.searchBean} took " + (t1 - t0) + " milliseconds.");

                        $("#${this.searchBean}-search").val("Type to search...");
                        // trigger ready events for the outside world
                        ${this.onReady}();
                    }
                });
            });



    </script>
</div>