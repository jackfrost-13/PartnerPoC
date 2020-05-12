import { render , html } from 'lit-html';
import './card.css';

export default class MessagesApp{
    constructor({divContainer}){
        this.messageList = document.getElementById(divContainer);
        this.dwcURL = null;
    }

    init(){
        this.render();
        this.addEventListener();
    }

    addEventListener(){
        var self = this;
        document.getElementById("bname").onkeyup = function(event) {
            var technicalInput = document.getElementById("tname");
            var businessInput = document.getElementById("bname");
            if(event){
                if(event.key === " "){
                    technicalInput.value = technicalInput.value + '_';
                }
                else{
                    if(event.keyCode > 47){
                        technicalInput.value = technicalInput.value + event.key;
                    }
                    if(event.keyCode === 8 ){
                        let str = technicalInput.value;
                        str = str.substring(0, str.length - 1);
                        technicalInput.value = str;
                    }
                }
            }
        }

        document.getElementById("bname").onchange = function(event) {
            //Sending for name validation to DWC along with status done.
            var inputVal = document.getElementById("tname");
            var body = {
                name: inputVal.value,
                businessName: inputVal.value,
                status: "done"
            };
            //inputVal.style.backgroundColor = "pink";
            window.top.postMessage( body,  'http://localhost:15002');
        }

        function onMessageReceived(event) {
            //Checking initial connection and saving DWC URL
            if (event.origin === 'http://localhost:15002' && event.data.isValid === undefined) {
                self.dwcURL = event.origin;
            }
            //If valid name
            if(event.origin === 'http://localhost:15002'){
                switch(event.data.isValid){
                    case true:{
                        var inputVal = document.getElementById("tname");
                        inputVal.style.backgroundColor = "white";
                        break;
                    }
                    case false:{
                        var inputVal = document.getElementById("tname");
                        inputVal.style.backgroundColor = "pink";
                        break;
                    }
                }
                if(event.data.schemaCredentials){
                    var schemaDetails = event.data.schemaCredentials;
                    console.log("Open SQL Schema Details Received", event.data.schemaCredentials);
                }
            }
        }

        window.addEventListener("message", onMessageReceived, false);
    }

    render() {
        render(this.createForm(), this.messageList);
    }

    createForm(){
        return html `<div class="form">
        <div class="flex">
        <label class="label-class" for="lname">Business Name:</label>
        <input class="input-field" type="text" id="bname">
        </div>
        <div class = "flex">
        <label class="label-class2" for="lname">Technical Name:</label>
        <input class="input-field" type="text" id="tname">
        </div>
        </div>`
    }



    
}