class GameLogic{

    userOption = 2;
    machineOption = 2;
    responseDict = {
        1: "Piedra",
        2: "Papel",
        3: "Tijera"
    };

    constructor(){

    }

    setUserResponse(selectedResponse){
        var selectedEyesExpression = "neutral";
        var selectedLowerFaceExpression = "neutral";
        
        selectedResponse.map( response =>{
            if(response.fac && response.fac.length > 0){
                if(response.fac[0] == "blink"){
                    selectedEyesExpression = "blink";
                }
    
                if(response.fac[3] == "smile"){
                    selectedLowerFaceExpression = "smile";
                }
            }
        });

        if(selectedEyesExpression == 'blink' && selectedLowerFaceExpression == 'neutral'){
            this.userOption = 1;
        } else if(selectedEyesExpression == 'neutral' && selectedLowerFaceExpression == 'smile'){
            this.userOption = 3;
        }

        var userOptionText = this.responseDict[this.userOption];
        console.log('Tu has seleccionado: '+ userOptionText);
        console.log("");
        console.log("");
    }

    calculateMachineOption(){
        this.machineOption = Math.floor(Math.random() * 3) + 1;
        var machineOptionText = this.responseDict[this.machineOption];
        console.log('La máquina ha seleccionado: '+ machineOptionText);
        console.log("");
        console.log("");
    }

    getResult(){
        var resultText = 'HAS GANADO. ¡ENHORABUENA!';
        if(this.machineOption == this.userOption){
            resultText = 'TABLAS, HABÉIS EMPATADO';
        } else if(this.machineOption == 1 && this.userOption == 3
                  || this.machineOption == 2 && this.userOption == 1
                  || this.machineOption == 3 && this.userOption == 2){
            resultText = 'LA MÁQUINA GANA, LO SENTIMOS';

        }
        console.log(resultText); 
        console.log('Aprieta cualquier tecla para volver a jugar o Ctrl + A para salir');
    }
    
}

module.exports = GameLogic;