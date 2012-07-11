//Returns an array with only unique elements
var unique = function(arr) {
  var a = [];
  var l = arr.length;
  for (var i = 0; i < l; i++) {
    for(var j=i+1; j<l; j++) {
      // if this[i] is found later in the array
      if (arr[i] === arr[j]) 
        j = ++i;
      }
      a.push(arr[i]);
  }
  return a;
};
//test 'val' in array 'arr'
function findInArray(arr, val) {
  for (var i = 0; i<arr.length; i++) if(arr[i]==val) return true;
  return false; 
}

exports.unique = unique;
exports.findInArray = findInArray;