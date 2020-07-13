//TODO: Add a way to look into data tables (the function is done)
//TODO: Fix bolt list yield stress. I'm pretty sure its wrong, but i'm used the same we always used.
//TODO: Add a decent-looking footer
//TODO: Figure out why it fucks on mobile/firefox
//TODO: How fucking cool would be to have like, a valve image on the "results" section, and have the parts you're in highlight?

//buttons
resetButton=document.querySelector("#resetButton");
loadButton=document.querySelector("#loadButton");
loginButton=document.querySelector("#loginButton");
boltYieldMsgBox=document.querySelectorAll("#boltYieldMsgBox");

window.userTorqueUnits="lb-ft"; // Default torque result units

//User Input - Packing
packingButtons=document.querySelectorAll("#userPackingSelection button"); //Array of items

//User Input - Data
userStemDiameter=document.querySelector("#stemDiameter");
userStemDiameterUnits=document.querySelector("#stemDiameterUnits");

userPackingSize=document.querySelector("#packingSize");
userPackingSizeUnits=document.querySelector("#packingSizeUnits");

userMediaPressure=document.querySelector("#mediaPressure");
userMediaPressureUnits=document.querySelector("#mediaPressureUnits");

userBoltDiameter=document.querySelector("#boltDiameter");
userBoltDiameterUnits=document.querySelector("#boltDiameterUnits");

userNumberRings=document.querySelector("#numberRings");
userNumberBolts=document.querySelector("#numberBolts");
userBoltGrade=document.querySelector("#boltGrade");
userKFactor=document.querySelector("#kFactor");

//form
formItems=document.querySelectorAll("#calculatorWrapper input");

///results
//cards
LECard=document.querySelector("#LECard");
GeneralCard=document.querySelector("#GeneralCard");
MinimumCard=document.querySelector("#MinimumCard");
//variables
hiBoltTorque=document.querySelector("#hiBoltTorque");
hiBoltYield=document.querySelector("#hiBoltYield");
hiPackingStress=document.querySelector("#hiPackingStress");
hiPackingFriction=document.querySelector("#hiPackingFriction");

init();

function init(){
    loadTableData();
    setListeners();
}

function setListeners(){
    loadButton.addEventListener("click", loadForm);
    resetButton.addEventListener("click", resetForm);
    loginButton.addEventListener("click", userLogin);
    hiBoltTorqueUnits.addEventListener("click", convertTorqueResult);
    medBoltTorqueUnits.addEventListener("click", convertTorqueResult);
    lowBoltTorqueUnits.addEventListener("click", convertTorqueResult);

    for (let i = 0; i < boltYieldMsgBox.length; i++) {
        boltYieldMsgBox[i].addEventListener("click", boltYieldMessageBox);
    }    
    //Bolt Grade Select
    $(".js-basic-single").select2({
        placeholder: "Select",
        allowClear: false,
        data: BOLT_GRADE_GROUP,
        //theme: "flat",
    });

    for (let i = 0; i < packingButtons.length; i++) {
        packingButtons[i].addEventListener("click", selectPacking);           
    }

    for (let i = 0; i < formItems.length; i++) {
        formItems[i].addEventListener("change", checkForm);           
    }
    $('#boltGrade').trigger("change", checkForm);
    $('#boltGrade').on('select2:select', checkForm);
}

function boltYieldMessageBox(){
    Swal.fire({
        icon: 'info',
        title: 'High bolt Yield % Too High',
        text: 'Going above the bolt maximum yield risks permanent bolt deformation, which not only decreases the force that reaches the packing rings, but also risks total bolt failure.',
        footer: '<a class="cursor-pointer" onclick="boltYieldMessageBoxFix()">How can I fix this issue?</a>'
      })
}

function boltYieldMessageBoxFix(){
    Swal.fire({
        title: 'High bolt Yield %',
        html: '<div>\
        <div>• Choose a bolt material with higher Yield Strength.</div>\
        <div>• If the valve design allows, increase bolt diameter.</div>\
        <div>• If the valve design allows, increase the number of bolts.</div>\
        </div>',
      })
}

function genericErrorMessageBox(title, message){
    Swal.fire({
        icon: 'error',
        title: title,
        text: message        
      })
}

function loadTableData(){
    window.allowableBoltYield=0.75;
    window.minBoltSize=0.25;//in //this limitation is due to root area
    window.maxBoltSize=4;//in //this limitation is due to root area
    window.BOLT_GRADE_GROUP = [
        {id: '-1',text: 'Select Bolt Grade',},
        {id: 'ASTM A193 B4B',text: 'ASTM A193 B4B', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [105]},
        {id: 'ASTM A193 B4C',text: 'ASTM A193 B4C', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [85]},
        {id: 'ASTM A193 B5',text: 'ASTM A193 B5', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [100]},
        {id: 'ASTM A193 B6',text: 'ASTM A193 B6', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [85]},
        {id: 'ASTM A193 B7',text: 'ASTM A193 B7', yieldStressRangeIN: ["<=2.5","<=4"], yieldStressValueKSI: [105, 95]},
        {id: 'ASTM A193 B7M',text: 'ASTM A193 B7M', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [80]},
        {id: 'ASTM A193 B8 Cl 1',text: 'ASTM A193 B8 Cl 1', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [30]},
        {id: 'ASTM A193 B8 Cl 2',text: 'ASTM A193 B8 Cl 2', yieldStressRangeIN: ["<=0.75","<=1.0","<=1.25","<=4.0"], yieldStressValueKSI: [100, 80, 65, 50]},
        {id: 'ASTM A193 B8C Cl 1',text: 'ASTM A193 B8C Cl 1', yieldStressRangeIN: ["<=4.0"], yieldStressValueKSI: [30]},
        {id: 'ASTM A193 B8C Cl 2',text: 'ASTM A193 B8C Cl 2', yieldStressRangeIN: ["<=0.75","<=1.0","<=1.25","<=4.0"], yieldStressValueKSI: [100, 80, 65, 50]},
        {id: 'ASTM A193 B8F',text: 'ASTM A193 B8F', yieldStressRangeIN: ["<=4.0"], yieldStressValueKSI: [30]},
        {id: 'ASTM A193 B8M Cl 1',text: 'ASTM A193 B8M Cl 1', yieldStressRangeIN: ["<=4.0"], yieldStressValueKSI: [30]},
        {id: 'ASTM A193 B8M Cl 2',text: 'ASTM A193 B8M Cl 2', yieldStressRangeIN: ["<=0.75","<=1.25","<=1.50","<=4.0"], yieldStressValueKSI: [95, 65, 50, 80]},
        {id: 'ASTM A193 B8T Cl 1',text: 'ASTM A193 B8T Cl 1', yieldStressRangeIN: ["<=4.0"], yieldStressValueKSI: [30]},
        {id: 'ASTM A193 B8T Cl 2',text: 'ASTM A193 B8T Cl 2', yieldStressRangeIN: ["<=0.75","<=1.25","<=1.50","<=4.0"], yieldStressValueKSI: [95, 65, 50, 80]},
        {id: 'ASTM A193 B16',text: 'ASTM A193 B16', yieldStressRangeIN: ["<=2.5","<=4"], yieldStressValueKSI: [105, 95]},
        {id: 'ASTM A453 651A',text: 'ASTM A453 651A', yieldStressRangeIN: ["<=2.75","<=4"], yieldStressValueKSI: [60, 70]},
        {id: 'ASTM A453 651B',text: 'ASTM A453 651B', yieldStressRangeIN: ["<=2.75","<=4"], yieldStressValueKSI: [50, 60]},
        {id: 'ASTM A453 660A',text: 'ASTM A453 660A', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [85]},
        {id: 'ASTM A453 660B',text: 'ASTM A453 660B', yieldStressRangeIN: ["<=4"], yieldStressValueKSI: [85]},
    ];
    window.BOLT_ROOT_GROUP = {
        rootAreaRangeIN: ["<=1/4", "<=5/16", "<=3/8", "<=7/16", "<=1/2","<=9/16","<=5/8","<=3/4","<=7/8","<=1", "<=1.125", "<=1.25", "<=1.375", "<=1.5", "<=1.625", "<=1.75", "<=1.875", "<=2.0", "<=2.25", "<=2.5", "<=2.75", "<=3.0", "<=3.25", "<=3.50", "<=3.75", "<=4.0"],
        rootAreaValueINSQ: [0.0269, 0.0454, 0.0678, 0.0933, 0.1257, 0.162, 0.2017, 0.3019, 0.4192, 0.5509, 0.7276, 0.9289, 1.155, 1.405, 1.68, 1.979, 2.303, 2.652, 3.422, 4.291, 5.258, 6.32, 7.487, 8.748, 10.11, 11.57],
    };
    window.PACKING_GROUP = [
        {id: "Teadit 2236", packingStress: [73, 55, 35], frictionCoefficient:0.048, packingCompression: [0.7, 0.75, 0.8]},
        {id: "Teadit 2235", packingStress: [60], frictionCoefficient:0.06, packingCompression:[0.7]},
        {id: "Teadit 2000IC", packingStress: [35], frictionCoefficient:0.09, packingCompression:[0.7]},
        {id: "Teadit 2202", packingStress: [20], frictionCoefficient:0.065, packingCompression:[0.7]},
        {id: "Teadit 2005", packingStress: [55], frictionCoefficient:0.05, packingCompression:[0.7]},
    ];
    //TODO Emerson_VC bolt material is wrong
    window.VALVE_GROUP = [
        {id: "API622_64", stemDiameter: 25.4, packingSize:6.4, numberRings: 5, numberBolts: 2, mediaPressure: 40, boltDiameter: "5/8", boltGrade: "ASTM A193 B7", KFactor: 0.2},
        {id: "API622_48", stemDiameter: 11.1, packingSize:4.8, numberRings: 5, numberBolts: 2, mediaPressure: 40, boltDiameter: "3/8", boltGrade: "ASTM A193 B7", KFactor: 0.2},
        {id: "Velan", stemDiameter: 25.4, packingSize:6.4, numberRings: 5, numberBolts: 2, mediaPressure: 40, boltDiameter: "5/8", boltGrade: "ASTM A193 B7", KFactor: 0.2},
        {id: "Emerson_VC", stemDiameter: 12.7, packingSize:6.4, numberRings: 5, numberBolts: 2, mediaPressure: 40, boltDiameter: "7/16", boltGrade: "ASTM A193 B7", KFactor: 0.2},
    ];
}
function checkForm(){
    //This is called on every field change OR packing selection
    //1. Checks if ALL form fields are filled, and if so, calculates the result. If not, does nothing.
    //2. Check for invalid entries (such as letters where there should be values)
    var formLabel;
    for (let i = 0; i < formItems.length; i++) {
        formLabel = formItems[i].parentElement.parentElement.children[0].innerText; //Name of the label ("Stem Diameter")
        if (formItems[i].value == "" && formLabel != "Number of Rings"){return;} //Form is empty
        if (formItems[i].value < 0 && formLabel != "Media Pressure"){genericErrorMessageBox("Negative Value", formLabel+" cannot be negative."); return;} //Form is empty
        if (formItems[i].value > 1 && formLabel == '"k" Factor'){genericErrorMessageBox("Value Out of Bounds", formLabel+" is an adimensional value between 0 and 1."); return;}
        if (formLabel == "Bolt Diameter"){
            var boltDiameter = formItems[i].value; 
            userBoltDiameterUnits.value != "in" ? boltDiameter = convert(eval(userBoltDiameter.value),"mm","in") : boltDiameter = eval(formItems[i].value) //in
            if (boltDiameter < minBoltSize){
                genericErrorMessageBox("Bolt too small", formLabel+" smaller than " + minBoltSize + " inches is not supported."); 
                return;
            } else if (boltDiameter > maxBoltSize){
                genericErrorMessageBox("Bolt too big", formLabel+" bigger than " + maxBoltSize + " inches is not supported."); 
                return;
            }
        } //Form is empty
        try {
            eval(formItems[i].value); 
        } catch (e) {
            if (e) {
                //If the form is a text (and shouldnt be)
                //alert(e.message);
                alert(formItems[i].value + " is an invalid value for " + formLabel);
            } else {
                console.log("all ok");
            }function genericMessage(title, message){
                //Checks if ALL form fields are filled, and if so, calculates the result
                for (let i = 0; i < formItems.length; i++) {
                    formItems[i].value="";
                }
                return;
            }            
        }
    }
    if ($('#boltGrade').val() == "-1"){return false;} //Bolt grade wasnt selected yet
    if(!window.userPacking){return false;} //Packing wasnt selected yet
    
    processPacking(window.userPacking);//This should get packing from somewhere
}

async function adminPacking(){
    const {value: formValues} = await Swal.fire({
        title: 'Define Packing',
        html:
          '<div>Packing Seating Stress</div>' +
          '<input id="swal-input1" class="swal2-input">' +
          '<div>Friction Coefficient (can be empty)</div>' +
          '<input id="swal-input2" class="swal2-input">' +
          '<div>Friction Coefficient (can be empty)</div>' +
          '<input id="swal-input3" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value
          ]
        }
      })  

      if (formValues) {
        for (let i = 0; i < formValues.length; i++) {
            if (formValues[i] == "" || formValues[i] < 0) {
                formValues[i]=0;
            } else if (formValues[1] >= 1) {
                formValues[1]=0;
            } else if (formValues[2] >= 1) {
                formValues[2]=0;
            } else {
                formValues[i] = eval(formValues[i]);
            }
        }
        PACKING_GROUP.push({id: "Custom", packingStress: [formValues[0]], frictionCoefficient: formValues[1], packingCompression: [formValues[2]]});
        console.log(PACKING_GROUP)
      }
      //selectPacking();
}

async function selectPacking(){
    //Function is called from {select button} in the selection packing card
    //Checks to see if theres innertext (Packing Name)    
    var thisPackingName=this.parentNode.childNodes[1].innerText;
    var buttonsPackingName=[];
    if (thisPackingName){
        //First, lets unselect any other buttons that might be selected
        for (let i = 0; i < packingButtons.length; i++) {
            buttonsPackingName[i]=packingButtons[i].parentNode.childNodes[1].innerText;
            if ((packingButtons[i].classList.contains("activePacking")) && (thisPackingName!=buttonsPackingName[i])){
                    packingButtons[i].childNodes[1].innerText="Select";
                    packingButtons[i].childNodes[1].classList.toggle("ml-2");
                    packingButtons[i].childNodes[3].classList.toggle("hidden")
                    packingButtons[i].classList.toggle("selectPacking");
                    packingButtons[i].classList.toggle("activePacking");
            }    
        }
        //Then we deal with user selection        
        //If packing is not selected
        if(this.classList.contains("selectPacking")){
            window.userPacking = this.parentNode.childNodes[1].innerText; //Gets the first node of the card (which is the title)
            //Dom Styling
            this.childNodes[1].innerText="Selected";
            this.childNodes[1].classList.toggle("ml-2");
            this.childNodes[3].classList.toggle("hidden")

            this.classList.toggle("selectPacking");
            this.classList.toggle("activePacking");
        //If packing is already selected and we'll unselect it 
        } else if (this.classList.contains("activePacking")){
            //If user wants to unselect current packing
            window.userPacking = null;
            updateWebPage(null,null,true);
            this.childNodes[1].innerText="Select";
            this.childNodes[1].classList.toggle("ml-2");
            this.childNodes[3].classList.toggle("hidden")
            this.classList.toggle("selectPacking");
            this.classList.toggle("activePacking");
            return;
        }
    } else {
        console.log("Error in selectPacking, no innerText found on packing card.");//Error handling //TODO: make it proper
        return;
    }
    //Checks to see if the custom packing was already created, if so it will not atempt to recreate.
    if (thisPackingName == "Custom" && PACKING_GROUP[PACKING_GROUP.length-1].id != "Custom"){await adminPacking();}
    
    checkForm(); //Tries to execute the calculation if the form fields have been filled
}

function processPacking(packing){
    var packingStress, frictionCoefficient, packingCompression, packingData
    //Load packing data into an object
    packingObject = PACKING_GROUP.find( record => record.id == packing);
    frictionCoefficient=packingObject.frictionCoefficient;
    packingStress = packingObject.packingStress;
    packingCompression = packingObject.packingCompression;

    if (packingStress.length == 1){
        packingData = calculate(packingStress[0], frictionCoefficient, packingCompression[0]);
        updateWebPage(packingData, "medium");
        //DOM Manipulation
        GeneralCard.classList.remove("hidden")
        MinimumCard.classList.add("hidden")
        LECard.classList.add("hidden");

    } else if (packingStress.length == 3){
        //This is currently just for 2236, which has three types of packing stress
        packingData = calculate(packingStress[0], frictionCoefficient, packingCompression[0]);
        updateWebPage(packingData, "high");
        packingData = calculate(packingStress[1], frictionCoefficient, packingCompression[1]);
        updateWebPage(packingData, "medium");
        packingData = calculate(packingStress[2], frictionCoefficient, packingCompression[2]);
        updateWebPage(packingData, "low");
        //DOM Manipulation
        GeneralCard.classList.remove("hidden")
        MinimumCard.classList.remove("hidden")
        LECard.classList.remove("hidden");
    } else {
        console.log("Unexpected packingStress.length")
    }
    checkBoltYield();

    //Scroll to the newly created card. Note that this only applies if calculation concludes.
    //Only applies to mobile/small screens
    if (screen.width < 1280){
        $('html, body').animate({ scrollTop: $("#results").offset().top}, 1000);
    }
}

function queryBoltData(boltGrade, boltDiameter){
    //Cross looks bolt yield stress and bolt root area from a table
    var boltYieldStress; //ksi
    var boltRootArea; //in2
    boltObject = BOLT_GRADE_GROUP.find( record => record.text == boltGrade);
    for (let i = 0; i < boltObject.yieldStressRangeIN.length; i++) {
        if (!boltYieldStress && eval(boltDiameter + boltObject.yieldStressRangeIN[i])){
            boltYieldStress = boltObject.yieldStressValueKSI[i];
        }
    }
    for (let i = 0; i < BOLT_ROOT_GROUP.rootAreaRangeIN.length; i++) {
        if(!boltRootArea && eval(boltDiameter + BOLT_ROOT_GROUP.rootAreaRangeIN[i])){
            boltRootArea = BOLT_ROOT_GROUP.rootAreaValueINSQ[i];
        }
    }
    if (!boltYieldStress || !boltRootArea){alert("No data for this bolt");}
    return [boltYieldStress, boltRootArea];
}

function updateWebPage(packingData, typeResult="medium", reset=false){
    if (reset){
        var cardFields = [hiBoltTorque, hiBoltYield, hiPackingStress, hiPackingFriction, medBoltTorque, medBoltYield, medPackingStress, medPackingFriction, lowBoltTorque, lowBoltYield, lowPackingStress, lowPackingFriction];
        for (let i = 0; i < cardFields.length; i++) {
            cardFields[i].innerText="-";   
            GeneralCard.classList.remove("hidden")
            MinimumCard.classList.add("hidden")
            LECard.classList.add("hidden");
        }
    }

    if (userTorqueUnits == "N-m") {
        packingData.boltTorque = convert(packingData.boltTorque, "lb-ft", "N-m");
        hiBoltTorqueUnits.innerText = "N-m";
        medBoltTorqueUnits.innerText = "N-m";
        lowBoltTorqueUnits.innerText = "N-m";
    } else {
        hiBoltTorqueUnits.innerText = "lb-ft";
        medBoltTorqueUnits.innerText = "lb-ft";
        lowBoltTorqueUnits.innerText = "lb-ft";
    }

    switch(typeResult){
    case "high":
        hiBoltTorque.innerText = Math.round(packingData.boltTorque);
        jQuery('#hiBoltTorque').tipso('destroy');
        jQuery('#hiBoltTorque').tipso({
            useTitle: false,
            background: "#212121",
            content: Math.round(packingData.boltTorque*100)/100 + " " + hiBoltTorqueUnits.innerText,
            size: 'normal',
            position: "bottom-right",
            width: 100
          });
        hiBoltYield.innerText = Math.round(100*packingData.boltYieldPercent);
        hiPackingStress.innerText = packingData.packingStress;
        hiPackingFriction.innerText = Math.round(packingData.packingFrictionLow) + "-" + Math.round(packingData.packingFrictionHigh);
        break;
    case "medium":
        medBoltTorque.innerText = Math.round(packingData.boltTorque);
        jQuery('#medBoltTorque').tipso('destroy');
        jQuery('#medBoltTorque').tipso({
            useTitle: false,
            background: "#212121",
            content: Math.round(packingData.boltTorque*100)/100 + " " + medBoltTorqueUnits.innerText,
            size: 'normal',
            position: "bottom-right",
            width: 100
          });
        medBoltYield.innerText = Math.round(100*packingData.boltYieldPercent);
        medPackingStress.innerText = packingData.packingStress;
        medPackingFriction.innerText = Math.round(packingData.packingFrictionLow) + "-" + Math.round(packingData.packingFrictionHigh);
        break;
    case "low":
        lowBoltTorque.innerText = Math.round(packingData.boltTorque);
        jQuery('#lowBoltTorque').tipso('destroy');
        jQuery('#lowBoltTorque').tipso({
            useTitle: false,
            background: "#212121",
            content: Math.round(packingData.boltTorque*100)/100 + " " + lowBoltTorqueUnits.innerText,
            size: 'normal',
            position: "bottom-right",
            width: 100
          });
        lowBoltYield.innerText = Math.round(100*packingData.boltYieldPercent);
        lowPackingStress.innerText = packingData.packingStress;
        lowPackingFriction.innerText = Math.round(packingData.packingFrictionLow) + "-" + Math.round(packingData.packingFrictionHigh);
        break;
    }
}

function convertTorqueResult(){
    if (this.previousElementSibling.innerText == "-") {return;}
    if (userTorqueUnits=="lb-ft"){
        userTorqueUnits="N-m";    
    } else {
        userTorqueUnits="lb-ft";
    }
    checkForm();
}

function checkBoltYield(){
    var boltYieldArray=[hiBoltYield, medBoltYield, lowBoltYield];
    var currCard;
    for (let i = 0; i < boltYieldArray.length; i++) {
        //Loops through the three cards
        if (boltYieldArray[i].innerText > allowableBoltYield*100){
            currCard = document.querySelectorAll(".resultCard")[i];
            errorFlags = currCard.querySelectorAll(".errorBoltYield");
            boltYieldArray[i].classList.add("text-red-700");
            for (let i = 0; i < errorFlags.length; i++) {
                errorFlags[i].classList.remove("hidden");
                errorFlags[i].classList.remove("hidden");
            }
        } else {
            currCard = document.querySelectorAll(".resultCard")[i];
            errorFlags = currCard.querySelectorAll(".errorBoltYield");
            boltYieldArray[i].classList.remove("text-red-700");
            for (let i = 0; i < errorFlags.length; i++) {
                errorFlags[i].classList.add("hidden");
                errorFlags[i].classList.add("hidden");
            }
        }   
    }
}

function calculate(packingStress, frictionCoefficient, packingCompression){    
    //Either converts of evaluates the expression inside.    
    userStemDiameterUnits.value != "mm" ? stemDiameter = convert(eval(userStemDiameter.value),"in","mm") : stemDiameter = eval(userStemDiameter.value); //mm
    userPackingSizeUnits.value != "mm" ? packingSize = convert(eval(userPackingSize.value),"in","mm") : packingSize = eval(userPackingSize.value); //mm
    userMediaPressureUnits.value != "bar" ? mediaPressure = convert(eval(userMediaPressure.value),"psi","bar") : mediaPressure = eval(userMediaPressure.value); //bar
    userBoltDiameterUnits.value != "in" ? boltDiameter = convert(eval(userBoltDiameter.value),"mm","in") : boltDiameter = eval(userBoltDiameter.value) //in
    numberRings=eval(userNumberRings.value) || 0; //adim
    numberBolts=eval(userNumberBolts.value); //adim
    kFactor=eval(userKFactor.value); //adim
    boltGrade = $('#boltGrade').val();

    [boltYield, rootArea] = queryBoltData(boltGrade, boltDiameter);
    
    var correctedPackingSeatingStress = packingStress + mediaPressure/10; //Mpa
    correctedPackingSeatingStress = convert(correctedPackingSeatingStress, "MPa", "psi") //psi
    
    var stressArea = Math.PI/4*((stemDiameter+2*packingSize)**2-(stemDiameter)**2); //mm²
    stressArea = convert(stressArea, "mm2", "in2") //in²

    var FlangeForce = stressArea * correctedPackingSeatingStress; //what is this unit???
      
    
    var boltTorque = FlangeForce/numberBolts*kFactor*boltDiameter/12; //lbf.ft
    var packingFrictionLow = 0.101972*(packingStress + mediaPressure/10)*frictionCoefficient*Math.PI*stemDiameter*packingSize*numberRings*packingCompression*0.9;
    var packingFrictionHigh = 0.101972*(packingStress + mediaPressure/10)*frictionCoefficient*Math.PI*stemDiameter*packingSize*numberRings*packingCompression*1.1;
    var boltYieldPercent = (packingStress+mediaPressure/10)*convert(stressArea,"in2","mm2")/numberBolts*0.224809/(boltYield*rootArea*1000);
    
    var packingData = new Object();
        packingData['boltTorque'] = boltTorque;
        packingData['boltYieldPercent'] = boltYieldPercent;
        packingData['packingStress'] = packingStress;
        packingData['packingFrictionHigh'] = packingFrictionHigh;
        packingData['packingFrictionLow'] = packingFrictionLow;
        return packingData;
}

async function loadForm(){
    
    const { value: savedValve } = await Swal.fire({
        title: 'Select a Valve',
        input: 'select',
        inputOptions: {
          'Standards': {
            API622_64: 'API 622 3rd Ed 6.4mm',
            API622_48: 'API 622 3rd Ed 4.8mm'
          },
          'User Valves': {
            Velan: 'Velan',
            Emerson_VC: 'Emerson V.C.'
          }
        },
        inputPlaceholder: 'Registered Valves',
        showCancelButton: true,
      })
    
    if(typeof savedValve == "undefined"){
        //i.e user exited the form
        return;
    }

    if(savedValve){
    
    //Load valve data into an object
    valveObject = VALVE_GROUP.find( record => record.id == savedValve);

    userStemDiameter.value = valveObject.stemDiameter;
    userPackingSize.value = valveObject.packingSize;
    userNumberRings.value = valveObject.numberRings;
    userNumberBolts.value = valveObject.numberBolts;
    userMediaPressure.value = valveObject.mediaPressure;
    userBoltDiameter.value = valveObject.boltDiameter;
    $('#boltGrade').val(valveObject.boltGrade).trigger("change");
    userKFactor.value=valveObject.KFactor;

    userStemDiameterUnits.value="mm";
    userPackingSizeUnits.value="mm";
    userMediaPressureUnits.value="bar";
    userBoltDiameterUnits.value="in";
    }

    Toast.fire({icon: 'success',title: 'Valve data loaded.'})
    checkForm();
}

function resetForm(){
    //Checks if ALL form fields are filled, and if so, calculates the result
    for (let i = 0; i < formItems.length; i++) {
        formItems[i].value="";
    }
    $('#boltGrade').val('-1').trigger("change"); /*Gets us back to placeholder*/
    resetResults();
    updateWebPage(null,null,true);
    Toast.fire({
        icon: 'success',
        title: 'Data Erased'
        })
    return;
}
function resetResults(){
    //Checks if ALL form fields are filled, and if so, calculates the result
    for (let i = 0; i < formItems.length; i++) {
        formItems[i].value="";
    }
    return;
}

function defineUnits(localization){
    if (localization == "metric"){
        userStemDiameterUnits.value="mm";
        userPackingSizeUnits.value="mm";
        userMediaPressureUnits.value="bar";
        userBoltDiameterUnits.value="in";
    }
    else if (localization == "imperial"){
        userStemDiameterUnits.value="in";
        userPackingSizeUnits.value="in";
        userMediaPressureUnits.value="psi";
        userBoltDiameterUnits.value="in";
    }
}

function convert(value, unitFrom, unitTo){
    if (unitFrom == "mm" && unitTo == "in"){return value/25.4;}
    if (unitFrom == "in" && unitTo == "mm"){return value*25.4;}
    
    if (unitFrom == "MPa" && unitTo == "psi"){return value*145.038;}
    if (unitFrom == "psi" && unitTo == "MPa"){return value/145.038;}

    if (unitFrom == "psi" && unitTo == "bar"){return value/14.5038;}
    if (unitFrom == "bar" && unitTo == "psi"){return value*14.5038;}
    
    if (unitFrom == "mm2" && unitTo == "in2"){return value/645.16;}
    if (unitFrom == "in2" && unitTo == "mm2"){return value*645.16;}

    if (unitFrom == "N-m" && unitTo == "lb-ft"){return value/1.35582;}
    if (unitFrom == "lb-ft" && unitTo == "N-m"){return value*1.35582;}
    
}

var _table_ = document.createElement('table'),
  _tr_ = document.createElement('tr'),
  _th_ = document.createElement('th'),
  _td_ = document.createElement('td');

// Builds the HTML Table out of myList json data from Ivy restful service.
function buildHtmlTable(arr) {
  var table = _table_.cloneNode(false),
    columns = addAllColumnHeaders(arr, table);
  for (var i = 0, maxi = arr.length; i < maxi; ++i) {
    var tr = _tr_.cloneNode(false);
    for (var j = 0, maxj = columns.length; j < maxj; ++j) {
      var td = _td_.cloneNode(false);
      cellValue = arr[i][columns[j]];
      td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
    table.classList.add("pure-table");
    table.classList.add("pure-table-bordered");
    table.firstChild.classList.add("text-white");
    table.firstChild.classList.add("bg-gray-700");
    return table;
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
function addAllColumnHeaders(arr, table) {
  var columnSet = [],
    tr = _tr_.cloneNode(false);
  for (var i = 0, l = arr.length; i < l; i++) {
    for (var key in arr[i]) {
      if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
        columnSet.push(key);
        var th = _th_.cloneNode(false);
        th.appendChild(document.createTextNode(key));
        tr.appendChild(th);
      }
    }
  }
  table.appendChild(tr);
  return columnSet;
}


function ShowDataTable(jsonString){
    Swal.fire({
        title: 'High bolt Yield %',
        imageUrl: '',
        width: "auto",
        html: buildHtmlTable(jsonString),
      })
}

async function userLogin(){    
    
    const { value: password } = await Swal.fire({
        title: 'Enter your password',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
          maxlength: 10,
          autocapitalize: 'off',
          autocorrect: 'off'
        }
      })
      
    if (password=="nimda") {  
        if (document.querySelectorAll(".admin-toggle.hidden").length > 0){
            Toast.fire({icon: 'success', title: 'Logged in as admin.'})
        } else {
            Toast.fire({icon: 'success', title: 'Logged out.'})
        }
        var adminItems=document.querySelectorAll(".admin-toggle");
        for (let i = 0; i < adminItems.length; i++) {
            adminItems[i].classList.toggle("hidden");
        }
    } else {
        Toast.fire({icon: 'error', title: 'Wrong password.'})
    }
}

//Navbar menu
//Javascript to toggle the menu
document.getElementById('nav-toggle').onclick = function(){
    document.getElementById("nav-content").classList.toggle("hidden");
}

// ===== Scroll to Top ==== 
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
