var msControllers = angular.module('msControllers',[]);


msControllers.controller('MinesweeperCtrl', ['$scope', '$window',
	function($scope, $window) {

        $scope.cheat = false;

        $scope.rows = 8,
        $scope.cols = 8,
        $scope.bombs = 10;

        /* init board */
        function initBoard() {
            $scope.curRows = $scope.rows,
            $scope.curCols = $scope.cols,
            $scope.curBombs = $scope.bombs;

            $scope.board = [];
            $scope.gameOver = false;
            $scope.buttonText = "Validate";

            for(var r=0; r<$scope.rows; r++) {
                $scope.board.push([]);
                for(var c=0; c<$scope.cols; c++) {
                    $scope.board[r].push({
                        value: null,
                        bomb: false,
                        clicked: false
                    });
                }
            }

            for(var i=0; i<$scope.bombs; i++) {
                var x, y;
                do {
                    x = getRandomInt(0,$scope.cols);
                    y = getRandomInt(0,$scope.rows);
                } while($scope.board[x][y].bomb);

                $scope.board[x][y].bomb = true;

                mapAdjacents(x,y, function(xadj, yadj) {
                    if(!$scope.board[xadj][yadj].bomb) {
                        $scope.board[xadj][yadj].value = ($scope.board[xadj][yadj].value || 0) + 1;
                    }
                });
            }
        }

        initBoard();

        $scope.clickSquare = function(x, y) {
            $scope.board[x][y].clicked = true;

            if($scope.board[x][y].bomb) {
                $scope.gameOver = true;
                $scope.buttonText = "New Game";
                $window.alert("You lose.");
            } else {
                if($scope.board[x][y].value === null) {
                    mapAdjacents(x, y, function(xadj, yadj) {
                        if(!$scope.board[xadj][yadj].clicked && !$scope.board[xadj][yadj].bomb) {
                            $scope.clickSquare(xadj, yadj);
                        }
                    });
                }
            }
        };

        $scope.buttonCommand = function() {
            validate();
        }

        function validate() {
            if($scope.gameOver) {
                $scope.gameOver = false;
                initBoard();
            } else {
                for(var r=0; r<($scope.board.length || 0); r++) {
                    for(var c=0; c<($scope.board[0].length || 0); c++) {
                        if(!$scope.board[r][c].bomb && !$scope.board[r][c].clicked) {
                            $window.alert("You lose.");
                            $scope.gameOver = true;
                            $scope.buttonText = "New Game";
                            return false;
                        }
                    }
                }
                $window.alert("You win.");
                $scope.gameOver = true;
                $scope.buttonText = "New Game";
                return false;
            }
        };

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }

        function mapAdjacents(x,y, callback) {
            var xa, yb;
            for(var a=-1; a<=1; a++) {
                for(var b=-1; b<=1; b++) {
                    xa = x + a, yb = y + b;
                    if(xa >= 0 && xa < $scope.board.length && yb >= 0 && yb < $scope.board[0].length) {
                        callback(xa, yb);
                    }
                }
            }
        }
    }
]);
