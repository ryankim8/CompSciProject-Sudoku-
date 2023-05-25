
const setWriteable = (val) => {
  const grid = document.querySelectorAll("td");
  grid.forEach((cell) => {
    Object.defineProperty(cell, "contentEditable", {
      value: "true",
      writable: val, // prevent the attribute from being modified
    });
  });
}

function handleInput(event) {
  const cell = event.target;
  const value = cell.textContent.trim();
  if (value.length === 1 && /^[1-9]$/.test(value)) {
    // Valid input, update the cell value
    cell.classList.remove('error');
    // You can store the value in a 2D array for later use
  } else if (value.length > 1 || !/^[1-9]$/.test(value)) {
    // Invalid input, clear the cell value and show an error
    cell.classList.add('error');
    cell.textContent = '';
  }
}

setWriteable(false);

function calculateDifficulty(arr) {
  score = 0

  //Checks total number of cells filled in
  countAll = 0
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      if (arr[i][j] != 0) {
        countAll += 1
      }
    }
  }
  if (countAll > 45) {
    score += 1
  }
  else if (countAll > 32) {
    score += 2
  }
  else if (countAll > 26) {
    score +=3
  }
  else if (countAll > 20) {
    score += 4
  }
  else if (countAll > 14) {
    score += 5
  }
  else if (countAll > 8) {
    score += 6
  }
  else {
    score += 7
  }



  //Checks each grid to see how many numbers are filled in

  //THIS CODE IS NOT WORKING SO FIX IT___________________________________________
  gridCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  rowMult = -1
  for (i = 0; i < 9; i++) {
    if (i%3 == 0) {
      rowMult += 1
    }
    for (j = 0; j < 9; j++) {
      // console.log((parseInt(i/3) + parseInt(j/3)) + 2 * rowMult)
      if (arr[i][j] != 0) {
        console.log("s")
        gridCounts[(parseInt(i/3) + parseInt(j/3)) + 2 * rowMult] = gridCounts[(parseInt(i/3) + parseInt(j/3)) + 2 * rowMult] + 1
      }
    }
  }




  console.log(gridCounts)

  //THIS CODE IS NOT WORKING SO FIX IT___________________________________________
  //Calculates the total using a ranking system i made
  gridTotal = 0
  console.log("gridTotal", gridTotal)
  for (i = 0; i < 9; i++) {
    switch (gridCounts[i]) {
      case 3:
        gridTotal += 1
        break
      case 2:
        gridTotal += 2
        break
      case 1:
        gridTotal += 3
        break
      case 0: 
        gridTotal += 4
        break

    }
  }
  if (gridTotal > 17) {
    score += 7
  }
  else if (gridTotal> 11) {
    score += 6
  }
  else if (gridTotal > 8) {
    score += 5
  }
  else if (gridTotal > 5) {
    score += 4
  }
  else if (gridTotal > 2) {
    score += 3
  }
  else if (gridTotal > 0) {
    score += 2
  }
  else {
    score += 1
  }

  //Total calculation of the ranking
  rank = ""
  console.log(parseInt((score/2)))
  switch (parseInt((score/2))) {
    case 1:
      rank = "Super Easy"
      break;
    case 2:
      rank = "Easy"
      break
    case 3:
      rank = "Intermediate"
      break
    case 4:
      rank = "Challenging"
      break
    case 5: 
      rank = "Hard"
      break
    case 6:
      rank = "Way Too Hard"
      break
    case 7:
      rank = "Impossible"
      break
  }
  document.getElementById("ranking").innerHTML = rank
  console.log(rank)
}

function reset() {
  const grid = document.querySelectorAll("td");
  grid.forEach((cell) => {
    cell.innerText = ""
    cell.contentEditable = true
    cell.oninput = handleInput;
    cell.style.lineHeight = "1.93em"
    cell.className = "noNum"
  });
  setWriteable(true);
  document.getElementById("boardTitle").innerHTML = "The Board"
  document.getElementById("ranking").innerHTML = ""

}

//END OF RANKING CODE_________________________

function solveSudokuAndUpdateGrid() {

  const grid = document.querySelectorAll("td");
  const gridValues = [];

  // Loop through each cell in the grid and store its value in the gridValues array
  grid.forEach((cell) => {
    let value = "0";
    if (cell.textContent.trim() != "") {
      value = cell.textContent.trim();
      cell.className = "hasNum";
    } else {
      cell.className = "notNum";
    }
    gridValues.push(value);
  });

  // Convert the 1D gridValues array to a 2D array
  const gridSize = Math.sqrt(gridValues.length);
  const gridArray = [];
  for (let i = 0; i < gridSize; i++) {
    gridArray.push(gridValues.slice(i * gridSize, (i + 1) * gridSize));
  }


  //Start of checking for repetition___________________________________________

  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      if (gridArray[i].slice(j+1, 9).indexOf(gridArray[i][j]) != -1 && gridArray[i][j] != 0) {
        document.getElementById("boardTitle").innerHTML = "THERE IS AN ERROR WITH THE INPUT!"
        console.log("tests")
        return
      }
    }
  }

  document.getElementById("boardTitle").innerHTML = "The Board"

  //End of check for repetition________________________________________________

    //CALCULATE THE DIFFICULTY______________________

  calculateDifficulty(gridArray)



  // Solve the Sudoku
  let solvedGrid = parseInput(gridArray);

  solveSudoku(solvedGrid);

  // Update the grid with the solved values
  let count = 0;
  grid.forEach((cell) => {
    cell.textContent = solvedGrid[parseInt(count / 9)][count % 9];
    cell.style.fontSize = "25px";
    count += 1;
  });
}

function parseInput(input) {
  // Create a new 2D array for the output
  const output = [];

  // Loop through each row in the input array
  for (let i = 0; i < input.length; i++) {
    // Create a new row in the output array
    output[i] = [];

    // Loop through each column in the row and parse the string value to an integer
    for (let j = 0; j < input[i].length; j++) {
      output[i][j] = parseInt(input[i][j], 10);
    }
  }

  return output;
}

tempCount = 0

function solveSudoku(grid) {
  // Find the next empty cell
  let row = -1;
  let col = -1;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        break;
      }
    }
    if (row !== -1) {
      break;
    }
  }

  // If there are no more empty cells, the Sudoku is solved
  if (row === -1) {
    return true;
  }

  // Try all possible numbers in the empty cell
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      grid[row][col] = num;

      // Recursively solve the remaining cells
      if (solveSudoku(grid)) {
        return true;
      }

      // If the recursive call did not solve the Sudoku, backtrack
      grid[row][col] = 0;
    }
  }

  // If no number worked, the Sudoku is unsolvable
  return false;
}

function isValidMove(grid, row, col, num) {
  // Check the row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) {
      return false;
    }
  }

  // Check the column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) {
      return false;
    }
  }

  // Check the 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num) {
        return false;
      }
    }
  }

  // If the move is valid, return true
  return true;
}

function changetoHow() {
  document.getElementById("stats").className = "hidden"
  document.getElementById("code").className = ""
}

function changetoStats() {
  document.getElementById("code").className = "hidden"
  document.getElementById("stats").className = ""
}