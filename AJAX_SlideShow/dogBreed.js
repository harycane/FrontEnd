/**
 * Created by HaryKrishnan Ramasubramanian (Andrew ID: hramasub) on 05/01/17.
 */
/*
timerID variable to clear the previous slideshow timer.
 */
let timerID = 0;

/*
Immediately invoked function.
 */
(function() {

"use strict";
ajax();

/*
Function fetch data using Ajax.
 */
function ajax() {
/*
 * Create a new XMLHttpRequest instance.
*/
    let xhr = new XMLHttpRequest();



    xhr.onreadystatechange = function() {

        /*
         * State:
         *
         * 1 - Open			open() called but not send()
         * 2 - Sent			send() called but no response
         * 3 - Receiving	some data has been received
         * 4 - Complete		Response is finished and we can use the response data
         *
         */

        if (xhr.readyState === XMLHttpRequest.DONE) { //value === 4
            /*
             * Check the HTTP response code to make sure it was successful.
             */
            if (( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304) {

                /*
                Contains responseText.
                 */
                let data = JSON.parse(xhr.responseText);
                /*
                Gets the select element by Id.
                 */
               let choice  = document.getElementById("choice");

               /*
               Adds various options from the responseText array to
               the select element.
                */
                data.forEach(
                    function (val, index, array) {
                        let opt = document.createElement("option");
                        opt.id = val.id;
                        opt.innerHTML = val.name;
                        /* Add an option to the select drop down.
                         https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_select_add
                         */
                        choice.add(opt);
                    }
                );

                /*
                Adds the event listener on change, thereby when the
                user selects another option, the select listener is invoked.
                 */
                document.getElementById("choice").addEventListener("change", select, false);

                /*
                select method invoked for intial page load.
                 */
                select();


            } else {
                alert("Error: " + xhr.status);
            }
            xhr = null;
        }



    };

    /*
    Opens a GET request connection with the server.
     */
    xhr.open("GET", "http://csw08724.appspot.com/breeds.ajax", true);


    xhr.send(null);


    /*
    Select Listener method.
    Used to populate the Breed name.
    And fetch the rest of the data using the Id attribute.
     */
    function select() {
        /* Retrieving the index and the text of the selected option.
         https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_option_index
         */
        let index = document.getElementById("choice").selectedIndex;

        let options = document.getElementById("choice").options;

        let name = document.getElementById("dog");
        name.innerHTML = options[index].value;

        /*
        To clear the timer from the previous slide show.
         */
        clearTimeout(timerID);

        /*
        Get the rest of the info through another Ajax, by passing the
        Id.
         */
        getInfo(options[index].id);
    }

}

/*
Ajax method that fetches content using the Id and dynamically populates it.
 */
function getInfo(id) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        /*
         * State:
         *
         * 1 - Open			open() called but not send()
         * 2 - Sent			send() called but no response
         * 3 - Receiving	some data has been received
         * 4 - Complete		Response is finished and we can use the response data
         *
         */
        if (xhr.readyState === XMLHttpRequest.DONE) { //value === 4
            /*
             * Check the HTTP response code to make sure it was successful.
             */
            if (( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304) {

                /*
                 Contains responseText.
                 */
                let data = JSON.parse(xhr.responseText);

                    /*
                    Populates the Description section.
                     */
                        let desc = document.getElementById("desc");
                        desc.innerHTML="";
                        let div1 = document.createElement("div");
                        desc.appendChild(div1);
                        div1.innerHTML = data.description;

                /*
                 Populates the Origins section.
                 */
                        let origins = document.getElementById("origins");
                        origins.innerHTML="";
                        let div2 = document.createElement("div");
                        origins.appendChild(div2);
                        div2.innerHTML = data.origins;

                /*
                 Populates the RightForYou section.
                 */
                        let rightForYou = document.getElementById("right");
                        rightForYou.innerHTML="";
                        let div3 = document.createElement("div");
                        rightForYou.appendChild(div3);
                        div3.innerHTML = data.rightForYou;

                /*
                 Populates the SlideShow with images.
                 */
                        let slides = document.getElementById("slide");
                        slides.innerHTML="";


                       for(let i = 0; i < data.imageUrls.length; i++) {
                            let div = document.createElement("div");
                            slides.appendChild(div);

                            div.setAttribute("class", "slideshow");
                            let image = document.createElement("img");
                            div.appendChild(image);

                            image.src = "http://csw08724.appspot.com/" + data.imageUrls[i];
                            image.style.width = "100%";
                       }




                       /*
                       Count variable to iterate over the image array.
                       Gets reset to 1 if it exceeds the image array length, inside
                       the SlideShow function.
                        */
                        let count = 0;
                        SlideShow();

                       /* Automatic Slide Show reference.
                         https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_slideshow_auto
                        */
                        /*
                        Function to create an Automatic SlideShow.
                        Acheived by setting the current image's display style to be block
                        while setting the rest of the images' display style to be none.
                        */
                        function SlideShow() {

                            let slideshow = document.getElementsByClassName("slideshow");
                            for(let i = 0; i < slideshow.length; i++) {
                                slideshow[i].style.display = "none";
                            }

                            if(++count > slideshow.length) {
                                count = 1;
                            }

                            slideshow[count-1].style.display = "block";
                            /*
                            timerID used to clear the timer.
                             */
                            timerID = setTimeout(SlideShow, 5000);

                        }



            } else {
                alert("Error: " + xhr.status);
            }



            xhr = null;




        }
    };

    /*
     Opens a GET request connection with the server.
     Passes the Id attribute to fetch the corresponding content.
     */
    xhr.open("GET", "http://csw08724.appspot.com/breed.ajax?id=" + id, true);


    xhr.send(null);
}

})();
