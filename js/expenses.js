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
    
    expensesTracker.controller('mainController', function($scope, $http, $window, $filter){
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
            .success(function(data){
                $scope.expenses = data;
                //console.log(data);
            })
            .error(function(err){
                //console.log('Error: '+err);
                alert(err);
            });
            
        //add an expense
        $scope.addExpense = function(isValid){
            
            //console.log('isValid: '+isValid);
            if (isValid){//check if form is valid
                $http.post(api_path, $scope.formData)
                    .success(function(data){
                        $scope.formData = {}; //clear form for new input
                        $scope.expenses = data;
                    })
                    .error(function(err){
                        //console.log('Error: '+err);
                        alert(err);
                    });
            }
            
        };
        
        //delete an expense
        $scope.deleteExpense = function(expense_id){
            if ($window.confirm('Are you sure you want to delete this record?')){
                $http.delete(api_path + '/' + expense_id)
                    .success(function(data){
                        $scope.expenses = data;
                        //console.log(data);
                    })
                    .error(function(err){
                        //console.log('Error: '+err);
                        alert(err);
                    });
            }
            
        };
        
        //update an expense
        $scope.updateExpense = function(expense_id){
            //console.log('expense_id: '+expense_id);
            $http.put(api_path + '/' + expense_id, $scope.formData)
                .success(function(data){
                   $scope.formData = {}; //reset form
                   $scope.expenses = data;
                   
                   $scope.editing = !$scope.editing; //toggle editing
                });
        };
    });
    
})();