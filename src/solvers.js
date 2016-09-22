/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

// write a tree class helper function 
var Tree = function(value) {
  this.value = value;
  this.children = [];
};

var generateRookTree = function(n) {

  // write recursive function that takes in tree and remaining children as arguments
  var _root = new Tree();
  var treeRecurse = function(currTree, remainingChildren) {
    for (var i = 0; i < remainingChildren.length; i++) {
      // Creates a new tree node and adds it to the tree structure
      var childTree = new Tree(remainingChildren[i]);
      currTree.children.push(childTree);

      // Makes a copy of the remainingChildren and removes value at i
      var restOfChildren = Array.prototype.slice.call(remainingChildren);
      restOfChildren.splice(i, 1);
      
      // recursively adds the remaining children to the tree
      treeRecurse(childTree, restOfChildren);
    }
  };
  treeRecurse(_root, _.range(n));
  return _root;
};

var checkCollisions = function(currRow, currCol, previousPath) {
  // for each index, value pair in previousPath
  var hasCollision = function(x1, y1, x2, y2) {
    var resultMath = (x2 - x1) / (y2 - y1);
    return resultMath === 1 || resultMath === -1;
  };
  
  for (var i = 0; i < previousPath.length; i++) {
    if (hasCollision(currRow, currCol, i, previousPath[i])) {
      return true;
    }
  }
  return false;
};

var generateQueenTree = function(n) {

  // write recursive function that takes in tree and remaining children as arguments
  var _root = new Tree();

  // write a version of treeRecurse that takes level, currTree, remainingChildren, previousPath, callback as arguments
  var treeRecurse = function(level, currTree, remainingChildren, previousPath, callback) {
    // if level we are at equals to n, then we know that we have found an arrangement for queens
    if (level === n) {
      // callback on path, stop the function
      // callback is supposed to take path as an argument and add it to the results
      callback(previousPath);
      return;
    }
    // iterate through remaining children
    for (var i = 0; i < remainingChildren; i++) {
      // for each child, check if there are diagonal collisions upwards the previousPath
      if (!checkCollisions(level, remainingChildren[i], previousPath)) {
      // if no collisions, 
        
        // make new tree
        var newTree = new Tree(remainingChildren[i]);
        // copy array
        var restOfChildren = Array.prototype.slice.call(remainingChildren);
        restOfChildren.splice(i, 1);
        // splice array by index of the remainingChildren
        // create copy of previous path

        var newPreviousPath = Array.prototype.slice.call(previousPath);
        // add remainingChildren[i] to previous path
        newPreviousPath.push(remainingChildren[i]);

        // recursively call treeRecurse on new node
        treeRecurse(level + 1, newTree, restOfChildren, newPreviousPath, callback);
    }
  };
  treeRecurse(0, _root, _.range(n), [], function(path) { 
    console.log(path);
  });
  return _root;
};

window.findNRooksSolution = function(n) {
  var solution = undefined; //fixme

  // generate rooktree
  var rookTree = generateRookTree(n);

  // find first solution
  var solutionArray = [];
  var currChild = rookTree.children[0];
  do {
    solutionArray.push(currChild.value);
    currChild = currChild.children[0];
  } while (currChild !== undefined);
  
  // use first solution to generate solution board
  var board = new Board({n: n});
  for (var i = 0; i < solutionArray.length; i++) {
    board.togglePiece(i, solutionArray[i]);
  }
  
  // output solution
  solution = board.rows();

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0; //fixme

  // generate tree that returns tree
  var rookTree = generateRookTree(n);

  // write depthFirstLog that takes a callback function
  var depthFirstLog = function(tree, callback) {
    callback(tree);
    tree.children.forEach(function(child) {
      depthFirstLog(child, callback);
    });
  };

  // call depthFirstLog to run through tree and count all leaves
  depthFirstLog(rookTree, function(child) {
    if (child.children.length === 0) {
      solutionCount++;
    }
  });

  // output count
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  var queenTree = generateQueenTree(n);
  console.log(queenTree);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
