// dom element selector
const myform = document.getElementById("myfrom");
const playersContainer = document.querySelector(".players-container")
const modal = document.getElementById("exampleModal")
const addToCartButton = document.querySelectorAll('.addToCartButton')
const totalPlayer = document.querySelector(".total-player")
const menCount = document.querySelector(".men")
const womenCount = document.querySelector(".women")
const listGroup = document.querySelector(".list-group")

// submit form
myform.addEventListener("submit", function (e) {
  e.preventDefault()

  const playerName = document.getElementById("player_name")

  if (playerName.value === "") {
    alert("Please enter a player name")
    return
  }

  getSearchPlayer(playerName.value)
  playerName.value = ""
})



// fetch the player
const getSearchPlayer = async (name) => {
  const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`)
  const players = await response.json()

  resetContent()
  displayPlayers(players.player)
}

//reset the content
function resetContent() {
  playersContainer.innerHTML = ""
  listGroup.innerHTML = ""
  totalPlayer.innerHTML = 0
  menCount.innerHTML = 0
  womenCount.innerHTML = 0
}

// displaye all players
const displayPlayers = (players) => {

  console.log(players)
  if (players === null) {
    const div = document.createElement("div")
    div.innerHTML = `
    <h1 class="text-center">Players not found </h1>
    `
    playersContainer.appendChild(div)
    return
  }

  players.forEach((player) => {
    if (player.strThumb !== null && player.strDescriptionEN !== null) {

      // create dom element
      const div = document.createElement("div")
      div.classList.add("card")
      div.style.width = "18rem"

      div.innerHTML = `
        <img src="${player.strThumb}" class="card-img-top" alt="${player.strPlayer}">
        <div class="card-body">
         <h5 class="card-title">
            <a href="${player.strFacebook}" target="_blank" class="card-link"><i class="fa-brands fa-facebook"></i></a>
            <a href="${player.strInstagram}" target="_blank" class="card-link"> <i class="fa-brands fa-instagram"></i></a>
            <a href="${player.strTwitter}" target="_blank" class="card-link"> <i class="fa-brands fa-twitter"></i></a>
         </h5>
         <hr />
          <h5 class="card-title">${player.strPlayer}</h5>
          <p class="card-text">${player.strDescriptionEN.split(" ").slice(0, 10).join(" ")}</p>
          
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Team: ${player.strTeam}</li>
          <li class="list-group-item">Country: ${player.strNationality}</li>
          <li class="list-group-item">Position: ${player.strPosition}</li>
          <li class="list-group-item">Gender: ${player.strGender}</li>
       </ul>
        <div class="card-body">
          <button type="button" onclick="handleAddToCart(this,'${player.strPlayer}','${player.strGender}','${player.strThumb}')" class="btn btn-primary addToCartButton">Add to group</button>
          <button type="button" onClick="handelPlayerDetails('${player.idPlayer}')" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#exampleModal">
            Details
          </button>
        </div>
    `
      playersContainer.appendChild(div)
    }
  })
}



const handelPlayerDetails = async (id) => {
  const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
  const player = await response.json()
  playersDetails(player.players[0])
}


const playersDetails = (player) => {

  const div = document.createElement("div")
  div.classList.add("modal-content")

  div.innerHTML = `
      <div class="modal-header">
        <h5 class="card-title" id="exampleModalLabel">${player.strPlayer}</h5>
        <button onClick="handleClose()" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
          <p class="card-text">${player.strDescriptionEN}</p>
          <p class="card-text">Team: ${player.strTeam}</p>
          <p class="card-text">Country: ${player.strNationality}</p>
          <p class="card-text">Position: ${player.strPosition}</p>
          <p class="card-text">Gender: ${player.strGender}</p>
          <p class="card-text"> Birth Location: ${player.strBirthLocation}</p>
          <p class="card-text">Sport: ${player.strSport}</p>
          <p class="card-text">Status: ${player.strStatus}</p>
          <p class="card-text">Height: ${player.strHeight}</p>
          <p class="card-text">Signing: ${player.strSigning}</p>
          <p class="card-text">Signing: ${player.strEthnicity}</p>
      </div>
    `
  modal.appendChild(div)
}

const handleClose = () => {
  modal.innerHTML = ""
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.innerHTML = ""
  }
}

//  cart
const handleAddToCart = (button, strPlayer, strGender, strThumb) => {
  const player = {
    strPlayer,
    strGender,
    strThumb
  }

  addToCart(player, button)

}

const addToCart = (player, button) => {
  if (Number(totalPlayer.innerHTML) > 10) {
    alert("maximum 11 players  select")
    console.log("maximum  11 players  add ")
    return
  }

  const li = document.createElement("li")
  li.classList.add("list-group-item")
  li.classList.add("cart-list-items")
  li.classList.add("rounded")
  li.innerHTML = `
    <div class="d-flex  align-items-center gap-2">
    <img src="${player.strThumb}" class=" rounded-circle" alt="${player.strPlayer}">
    <h5 >${player.strPlayer}</h5></div>
    `
  listGroup.appendChild(li)

  button.innerHTML = "Already added"
  button.classList.remove('btn-primary');
  button.classList.add('btn-danger');
  button.disabled = true

  counter(player)

}


const counter = (player) => {
  totalPlayer.innerHTML = Number(totalPlayer.innerHTML) + 1

  if (player.strGender === 'Male') {
    menCount.innerHTML = Number(menCount.innerHTML) + 1
  }

  if (player.strGender === 'Female') {
    womenCount.innerHTML = Number(womenCount.innerHTML) + 1
  }
}

getSearchPlayer("me")
