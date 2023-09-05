document.addEventListener("DOMContentLoaded", function () {
    const teamColorSelect1 = document.getElementById("team-color-1");
    const playerNameInput1 = document.getElementById("player-name-1");
    const teamColorSelect2 = document.getElementById("team-color-2");
    const playerNameInput2 = document.getElementById("player-name-2");
    const selectButton = document.getElementById("select-button");
    const selectedTeamsDisplay = document.getElementById("selected-teams");
    const title =document.getElementById('exampleModalLabel');
    const message =document.getElementById('messageContent');

    document.getElementById("test").onclick=function () {
        const teamColor1 = teamColorSelect1.value;
        const playerName1 = playerNameInput1.value;
        const teamColor2 = teamColorSelect2.value;
        const playerName2 = playerNameInput2.value;
        const button = document.getElementById("start-button");

        localStorage.setItem("player-name-1",playerName1);
        localStorage.setItem("player-name-2",playerName2);
        localStorage.setItem("team-color-1",teamColor1);
        localStorage.setItem("team-color-2",teamColor2);
        if (playerName1.trim() === "" || playerName2.trim() === "") {
            message.textContent ='Please enter names for both players.';
            title.innerText="ERROR";
            button.style.display="none";
            button.disable();

        }
        else
            if(teamColor1===teamColor2)
        {

            message.textContent ='choose different teams';
            title.innerText="ERROR";
            button.style.display="none";




        }

        else {
                title.innerText="The teams are";

            message.textContent = `
            Player 1: ${playerName1} (Team ${teamColor1}) 
            vs. 
            Player 2: ${playerName2} (Team ${teamColor2})
            
            
        `;
            button.style.display="block";

        }


    }

});
