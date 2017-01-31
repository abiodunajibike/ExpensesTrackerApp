//expensesTracker.js

(function(){
    'use strict';    

    var expensesTracker = angular.module('expensesTracker', []);
    
    //date formatter directive
    angular.module('expensesTracker').directive('formatDate', function(){
        return {
            require: 'ngModel', link: function(scope, elem, attr, modelCtrl){
                modelCtrl.$formatters.push(function(modelValue){
                    return new Date(modelValue);
                });
            }
        };
    });
    
    var api_path = '/api/expenses';
    
    expensesTracker.controller('mainController', mainController);
    
    function mainController ($scope, $http, $window, $filter){
        $scope.message = 'test dummy';
        
        $scope.editing = false;
        $scope.formData = {};
        
        //Filter by amount; ascending/descending
        $scope.reOrderByAmount = function(){
            var selected_option = $scope.amount_select;
            if (selected_option !== ''){
                var order_field = (selected_option=== 'low_to_high') ? 'amount' : '-amount';
                $scope.expenses = $filter('orderBy')($scope.expenses, order_field);
            }
        };
        
        $scope.editExpense = function(expense){
            $scope.editing = !$scope.editing;
            $scope.formData = angular.copy(expense);
        };
        
        //get all expenses by default
         $http.get(api_path)
            .then(function(response){
                $scope.expenses = response.data;
                $scope.status   = response.status;
                console.log(response.data);
            }).catch(function(response){
                //console.log('Error: '+err);
                $scope.status = response.status;
                //alert(response.data);
            });
        //$http.get(api_path)
        //    .success(function(data, status){
        //        $scope.expenses = data;
        //        $scope.valid = true;
        //        //console.log(data);
        //    })
        //    .error(function(data, status){
        //        //console.log('Error: '+err);
        //        scope.valid = false;
        //        //alert(err);
        //    });
            
        //add an expense
        $scope.addExpense = function(){
            
            //console.log('isValid: '+isValid);
            //if (isValid){//check if form is valid
            $http.post(api_path, $scope.formData)
                .then(function(response){
                    $scope.formData = {}; //clear form for new input
                    $scope.expenses = response.data;
                    $scope.status   = response.status;
                }).catch(function(response){
                    //console.log('Error: '+err);
                    $scope.status   = response.status;
                    alert(response);
                });
            //}
            
        };
        
        //delete an expense
        $scope.deleteExpense = function(expense_id){
            if ($window.confirm('Are you sure you want to delete this record?')){
                $http.delete(api_path + '/' + expense_id)
                    .then(function(response){
                        $scope.expenses = response.data;
                        $scope.status   = response.status;
                        //console.log(data);
                    }).catch(function(response){
                        $scope.status   = response.status;
                        //console.log('Error: '+err);
                        alert(response);
                    });
            }
            
        };
        
        //update an expense
        $scope.updateExpense = function(expense_id){
            //console.log('expense_id: '+expense_id);
            $http.put(api_path + '/' + expense_id, $scope.formData)
                .then(function(response){
                   $scope.formData = {}; //reset form
                   $scope.expenses = response.data;
                    $scope.status   = response.status;
                   
                   $scope.editing = !$scope.editing; //toggle editing
                });
        };
    }
    
})();