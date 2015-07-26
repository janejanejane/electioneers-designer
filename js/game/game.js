'use strict';

angular.module('paDesignerApp')
  .controller('GameCtrl', function(DistrictsModel, KapitansModel, GameService, LoaderService, PopulationGenerator, $scope){
    $scope.selected = {};

    $scope.generator = {
      currentGeneration: 0,
      state: 'default',
      population: [],
      selected: null
    };

    $scope.$watch('game', function(){
      if($scope.game){
        var gameData = GameService.GetGameData($scope.game.name);
        gameData.districts = _.map(gameData.districts, function(d){
          if(!d.neighbors){
            d.neighbors = [];
          }

          d = new DistrictsModel.District(d);
          d.setKap(gameData.kapitans);

          return new DistrictsModel.District(d);
        });

        $scope.gameData = gameData;
      }
    });

    $scope.onSelectDistrict = function(district){
      console.log('Hey clicked me :' + district.name);
      angular.forEach($scope.gameData.districts, function(d){
        console.log(d.id + ' vs ' + district.id);
        if(district.id === d.id){
          d.selected = !d.selected;
          if(d.selected){
            $scope.selected.district = d;
          }else{
            $scope.selected.district = null;
          }
        }else{
          d.selected = false;
        }
      });
    };

    $scope.onNewDistrict = function(){
      var d = DistrictsModel.CreateDistrict($scope.gameData.kapitans);
      $scope.gameData.districts.push(d);
    };

    $scope.onNewKapitan = function(){
      var k = KapitansModel.CreateKapitan();
      $scope.gameData.kapitans.push(k);
    };

    $scope.onDeleteDistrict = function(district){
      $scope.gameData.districts = _.reject($scope.gameData.districts, function(d){
        return d.id === district.id;
      });
      //delete from neighbor hoods
      _.forEach($scope.gameData.districts, function(d){
        d.neighbors = _.reject(d.neighbors, function(n){
          return n.id === district.id;
        });
      });
    };

    $scope.onDeleteKapitan = function(kapitan){
      $scope.gameData.kapitans = _.reject($scope.gameData.kapitans, function(k){
        return k.id === kapitan.id;
      });

      //delete from districts kapitans
      _.forEach($scope.gameData.districts, function(d){
        if(d.kapitanId === kapitan.id){
          d.kapitanId = null;
          d.kap = null;
        }
      });
    };

    $scope.onKapitanSelected = function(kapitan){
      _.forEach($scope.gameData.kapitans, function(k){
        if(kapitan.id === k.id){
          k.selected = !k.selected;
          if(k.selected){
            $scope.selected.kapitan = k;
          }else{
            $scope.selected.kapitan = null;
          }
        }else{
          k.selected = false;
        }
      });
    };

    $scope.onSave = function(){
      //save game data to the file in this folder
      GameService.SaveGameData($scope.game.name, $scope.gameData);
    };

    $scope.onPlay = function(){
      $scope.onGoToProper($scope.gameData);
      //TODO: Use game data name for generating population
      LoaderService.HasPopulation('db2').then(function(val){
        if(val){
          console.log('No need to generate population');
        }else{
          console.log('Generate Population');
        }

        LoaderService.GeneratePopulation(function(){

        });
      });
    };

    $scope.onGenerate = function(){
      if($scope.generator.state === 'generating'){
        return;
      }
      $scope.generator.state = 'generating';
      var generations = 50;
      function generate(){
        $scope.generator.currentGeneration++;
        if($scope.generator.currentGeneration >= generations){
          $scope.generator.currentGeneration = generations;
          clearInterval(intervalId);
        }
        PopulationGenerator.updatePopulation($scope.generator.population);
        //calculate total voter population
        $scope.generator.totalPopulation = _.reduce($scope.generator.population, function(total, family){
          return total + family.voters + family.kids;
        }, 0)
        $scope.generator.voterPopulation = _.reduce($scope.generator.population, function(total, family){
          return total + family.voters;
        }, 0);
        $scope.$apply();
      }

      generate();
      var intervalId = setInterval(generate, 2);
    }

    //loads children of a family (like lazyloading)
    var loadChildren = function(family, exception){
      //load children
      if(family.children.males.length){
        family.sons = [];
        _.forEach(family.children.males, function(_id){
          if(exception && _id === exception._id){
            return;
          }
          var child = _.find($scope.generator.population, function(f){
            return f._id === _id;
          });
          family.sons.push(child);
        });
      }

      if(family.children.females.length){
        family.daughters = [];
        _.forEach(family.children.females, function(_id){
          if(exception && _id === exception._id){
            return;
          }
          var child = _.find($scope.generator.population, function(f){
            return f._id === _id;
          });
          family.daughters.push(child);
        });
      }
    }

    var loadParents = function(family){
      //populate mother
      family.mother = _.find($scope.generator.population, function(f){
        return f._id === family.parent.mother;
      });

      family.father = _.find($scope.generator.population, function(f){
        return f._id === family.parent.father;
      });
    }

    var loadCousins = function(family){
      var cousins = [];
      //TODO: how to access cousins
    }


    $scope.$watch('generator.selected', function(){
      var family = $scope.generator.selected;

      if(!family){
        return;
      }
      
      loadParents(family);
      loadChildren(family);

      //load siblings
      if(family.father){
        loadChildren(family.father, family);
      }

      if(family.mother){
        loadChildren(family.mother, family);
      }
    });

    $scope.goBack = function(){
      $scope.nav.page = 'Start';
    };
  });
