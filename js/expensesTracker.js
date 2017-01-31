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
        scp = $scope;
        scp.editing = false;
        scp.formData = {};
        
        //Filter by amount; ascending/descending
        scp.reOrderByAmount = function(){
            var selected_option = scp.amount_select;
            if (selected_option !== ''){
                var order_field = (selected_option=== 'low_to_high') ? 'amount' : '-amount';
                scp.expenses = $filter('orderBy')(scp.expenses, order_field);
            }
        };
        
        scp.editExpense = function(expense){
            scp.editing = !scp.editing;
            scp.formData = angular.copy(expense);
        };
        
        //get all expenses by default
        $http.get(api_path)
            .success(function(data){
                scp.expenses = data;
                //console.log(data);
            })
            .error(function(err){
                //console.log('Error: '+err);
                alert(err);
            });
            
        //add an expense
        scp.addExpense = function(isValid){
            
            //console.log('isValid: '+isValid);
            if (isValid){//check if form is valid
                $http.post(api_path, scp.formData)
                    .success(function(data){
                        scp.formData = {}; //clear form for new input
                        scp.expenses = data;
                    })
                    .error(function(err){
                        //console.log('Error: '+err);
                        alert(err);
                    });
            }
            
        };
        
        //delete an expense
        scp.deleteExpense = function(expense_id){
            if ($window.confirm('Are you sure you want to delete this record?')){
                $http.delete(api_path + '/' + expense_id)
                    .success(function(data){
                        scp.expenses = data;
                        //console.log(data);
                    })
                    .error(function(err){
                        //console.log('Error: '+err);
                        alert(err);
                    });
            }
            
        };
        
        //update an expense
        scp.updateExpense = function(expense_id){
            //console.log('expense_id: '+expense_id);
            $http.put(api_path + '/' + expense_id, scp.formData)
                .success(function(data){
                   scp.formData = {}; //reset form
                   scp.expenses = data;
                   
                   scp.editing = !scp.editing; //toggle editing
                });
        };
    });
    
})();