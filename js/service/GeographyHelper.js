'use strict';

angular.module('paDesignerApp')
  .service('GeographyHelper', function(){

    this.showFamilyName = function(element){
      if(!element.select('.familyLabel')[0][0]){
        element.append('text')
          .attr('class', 'familyLabel')
          .style('fill', 'red')
          .attr('x', 30)
          .text(function(d){
            return d.fatherName + ' ' + d.familyName;
          });
      }
    };

    this.hideFamilyName = function(element){
      element.select('.familyLabel').remove();
    };

    this.showConnection = function(shouldShow, fromData, toData){
      if(!shouldShow){
        d3.select('.familyConnection').remove();
        return;
      }

      var frmDistrict = d3.select('#district'+fromData.district.id).datum();
      var toDistrict = d3.select('#district'+toData.district.id).datum();
      var frm = d3.select('#family'+fromData._id).datum();
      var to = d3.select('#family'+toData._id).datum();

      var elm = d3.select('.mainGroup');

      elm.append('line')
        .attr('class', 'familyConnection')
        .attr('stroke', 'solid')
        .attr('x1', function(){
          return frmDistrict.x + frm.x;
        })
        .attr('y1', function(){
          return frmDistrict.y + frm.y;
        })
        .attr('x2', function(){
          return toDistrict.x + to.x;
        })
        .attr('y2', function(){
          return toDistrict.y + to.y;
        });
    };

    this.hideConnection = function(){
      console.log('Hiding family connection...');
      d3.select('.familyConnection').remove();
    };

    this.updateDistrictConnection = function(){
      var lines = d3.selectAll('.link');
          lines.attr('x1', function(d) {return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
    }
  });