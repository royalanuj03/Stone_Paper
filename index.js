// Current line
var CurrentId = undefined;
var timer = null;
var winTime = null;
var startTime = null;
var isDraw = false; // Flag to indicate if it's a draw

var gameImages = [
  `
    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)
`,
  `
    _______
---'   ____)____
          ______)
          _______)
         _______)
---.__________)
`,
  `
    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)
`
];

// Click Play
$(document).ready(function () {
  $("#run-button").click(function () {
    $("#Content").empty();
    startTime = new Date().getTime();
    startTimer();
    NewLine("What do you choose? Type 0 for Rock, 1 for Paper, or 2 for Scissors.", true);
  });
});

// Enter button
$(document).on("keydown", function (e) {
  var x = event.which || event.keyCode;
  if (x === 13 || x == 13) {
    var consoleLine = $("#" + CurrentId + " input").val();
    if (isNaN(consoleLine) || consoleLine < 0 || consoleLine > 2) {
      NewLine("You typed an invalid number, you lose!", false);
      stopGame();
    } else {
      NewLine("You chose:", false);
      NewLine('<div class="game-image-container">' + gameImages[consoleLine] + '</div>', false);
      var computerChoice = Math.floor(Math.random() * 3);
      NewLine("Computer chose:", false);
      NewLine('<div class="game-image-container">' + gameImages[computerChoice] + '</div>', false);
      showResult(parseInt(consoleLine), computerChoice);
    }
    $(".console-carrot").remove();
  }
});

// New line
function NewLine(text, isPrompt) {
  if (CurrentId !== undefined) {
    $("#" + CurrentId + " input").prop("disabled", true);
  }
  CurrentId = "consoleInput-" + GenerateId();

  if (isPrompt) {
    $("#Content").append(
      // One Line
      '<div id="' +
      CurrentId +
      '">' +
      text +
      '<input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" class="terminal-input" /><div class="console-carrot"></div></div>'
    );
    $("#" + CurrentId + " input").focus();
    $("#" + CurrentId + " input").attr("size", "1");
  } else {
    $("#Content").append('<div id="' + CurrentId + '">' + text + "</div>");
  }
}

function GenerateId() {
  return Math.random().toString(16).slice(2);
}

function startTimer() {
  timer = setInterval(function () {
    var currentTime = new Date().getTime();
    var elapsedTime = Math.floor((currentTime - startTime) / 1000);
    var timeLeft = 120 - elapsedTime; // Initial time is 2 minutes (120 seconds)
    if (timeLeft <= 0) {
      NewLine("Time's up, you lose!", false);
      stopGame();
    }
    $("#timer").text(timeLeft);
  }, 1000); // Update every second
}

function stopTimer() {
  clearInterval(timer);
}

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function showResult(userChoice, computerChoice) {
  var resultText = "";
  var elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000); // Calculate elapsed time
  if (userChoice == computerChoice) {
    resultText = "It's a draw!";
    isDraw = true;
  } else if (
    (userChoice == 0 && computerChoice == 2) ||
    (userChoice == 1 && computerChoice == 0) ||
    (userChoice == 2 && computerChoice == 1)
  ) {
    resultText = "You win!";
    winTime = elapsedTime; // Record win time
  } else {
    resultText = "You lose!";
  }

  $("#Content").append("<div class='result'>" + resultText + "</div>");
  stopGame();
}

function stopGame() {
  stopTimer();
  if (winTime !== null) {
    NewLine("You won! Your time: " + winTime + " seconds", false);
  } else if (!isDraw) { // If it's not a draw, disable input and stop the timer
    $("#" + CurrentId + " input").prop("disabled", true);
  }
}
