var movies = [];
var users = {}; // username: user object
const titles = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
users["admin"] = new User("admin", "admin");
var currUser = users["admin"];

function User(username, password)
{
    this.username = username;
    this.password = password;
    this.favorites = new Array(26);
    initializeFavoriteList(this.favorites);
}

function Movie(id, title, poster_path, release_date, original_language, overview)
{
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.release_date = release_date;
    this.original_language = original_language;
    this.overview = overview;
}

// signIn/signUp
function signIn()
{
    document.getElementById('usernameSignIn').value = "";
    document.getElementById('passwordSignIn').value = "";

    document.querySelector('.signUpModal').style.display = 'none';
    document.querySelector('.signInModal').style.display = 'flex';
}

function signUp()
{
    document.getElementById('usernameSignUp').value = "";
    document.getElementById('passwordSignUp').value = "";
    document.getElementById('rpasswordSignUp').value = "";

    document.querySelector('.signInModal').style.display = 'none';
    document.querySelector('.signUpModal').style.display = 'flex';
}

function closeSignInSignUpForm()
{
    document.querySelector('.signInModal').style.display = 'none';
    document.querySelector('.signUpModal').style.display = 'none';
}

//------------ movie search --------------
function cleanGrid()
{
    movies = [];
    var container = document.getElementById("container");
    while (container.hasChildNodes()) 
    {
        container.removeChild(container.lastChild);
    }
}

function searchMovie()
{
    event.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cleanGrid();
            var data = JSON.parse(this.responseText).results;
            for (var i = 0; i < data.length; i++) 
            {
                movies.push(new Movie(data[i].id, data[i].title, data[i].poster_path, data[i].release_date, data[i].original_language, data[i].overview));
            }
            var container = document.getElementById("container");
            for (var i = 0; i < movies.length; i++) 
            {
                var outsideBox = document.createElement("div");
                outsideBox.className = "outsideBox";
                var left = document.createElement("div");
                left.className = "leftDiv";
                var image = document.createElement("img");
                if(data[i].poster_path != null)
                {
                    image.src = "https://image.tmdb.org/t/p/w185" + data[i].poster_path;
                }
                else
                {
                    image.src = "noMovieImage.png";
                }
                image.id = i;
                image.className = "movieImg";
                left.appendChild(image);
                var right = document.createElement("div");
                right.className="rightDiv";
                var title = document.createElement("h3");
                title.innerHTML = data[i].title;
                var language = document.createElement("p");
                language.innerHTML = "Language: " + data[i].original_language;
                var date = document.createElement("p");
                date.innerHTML = "Released Date: " + data[i].release_date;
                var button = document.createElement("button");
                button.type = "submit";
                button.className = "btn";
                button.id = i;
                button.innerHTML = "Add Favorite";
                button.addEventListener("click", addFavoriteMovie, false);

                right.appendChild(title);
                right.appendChild(language);
                right.appendChild(date);
                right.appendChild(button);
                outsideBox.appendChild(left);
                outsideBox.appendChild(right);
                container.appendChild(outsideBox);
            }
        }
    };
    xhttp.open("GET", "https://api.themoviedb.org/3/search/movie?api_key=79a5fb3ed7b3d28cd38f01ead98e98c3&query="+event.target.value, true);
    xhttp.send();
}

// ------------ favorite list -----------------
function initializeFavoriteList(favorites)
{
    for(var i = 0; i < titles.length; i++)
    {
        favorites[i] = [];
        favorites[i].push(titles[i]);
    }
}

function clearFavoriteList()
{
    var ul = document.getElementById("favoriteList");
    while (ul.hasChildNodes()) 
    {
        ul.removeChild(ul.lastChild);
    }
}

function addFavoriteMovie()
{
    const movieName = movies[event.target.id].title;
    const loc = movieName.toLowerCase().charCodeAt(0) - 97; 
    currUser.favorites[loc].push(movieName);
    clearFavoriteList();
    loadFavoriteList();
}

function deleteFavoriteMovie()
{
    const movieName = event.target.id;
    const loc = movieName.toLowerCase().charCodeAt(0) - 97;
    const i = currUser.favorites[loc].indexOf(movieName);
    
    if(i != -1)
    {
        currUser.favorites[loc].splice(i, 1);
    }
    clearFavoriteList();
    loadFavoriteList();
}

function loadFavoriteList()
{
    const currList = currUser.favorites;
    var htmlList = document.getElementById("favoriteList");
    for(var i = 0; i < currList.length; i++)
    {
        for(var j = 0; j < currList[i].length; j++)
        {
            var curr = document.createElement("li");
            curr.id = currList[i][j];
            curr.innerHTML = currList[i][j];
            if(j == 0)
            {
                curr.className = "list-group-item list-group-item-info d-flex justify-content-between align-items-center";
            }
            else
            {
                curr.className = "list-group-item d-flex justify-content-between align-items-center";
                var delButton = document.createElement("button");
                delButton.className = "badge badge-primary badge-pill";
                delButton.innerHTML = "Delete";
                delButton.id = currList[i][j];
                delButton.addEventListener("click", deleteFavoriteMovie);
                curr.appendChild(delButton);
            }
            htmlList.appendChild(curr);
        }
    }
}

function sendMessage()
{
    alert("Message Sent!");
}
