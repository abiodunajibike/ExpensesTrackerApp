
describe('expensesTracker', function(){
    var $httpBackend, $rootScope;
    
    beforeEach(module('expensesTracker'));
    
    beforeEach(inject (function($injector){
        $httpBackend = $injector.get('$httpBackend');
        
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $scope      = $rootScope.$new();

    }));
    
    beforeEach(inject(function($controller){
        mainController = $controller('mainController', {'$scope': $scope});
    }));
    
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    
    it('should exist', function(){
        expect(mainController).toBeDefined();
    });
    
    it('should send an HTTP POST request', function(){
        expect($scope.message).toBe('test dummy');
    });
    
    it('GET request for all expenses returns (200 status)', function(){
        $httpBackend.expectGET('/api/expenses').respond(200);
        $httpBackend.flush();
    });
    
    it('POST request for an expense returns (200 status)', function(){
        $httpBackend.expectPOST('/api/expenses', {'description': 'Test', 'amount': 100, 'when': '02/04/2007'}).respond(200);
        $httpBackend.flush();
    });

    
});