  function parseRanges(rangeStrArray){
    var objectRegexDets = {
      re: /(x|y\d?)range \[([\d.]+)\:([\d.]+)\]/,
      groupObjMapping: ['', 'name', 'from', 'to']
    };

    return genericMatcher(rangeStrArray, objectRegexDets);
  }

  function parseAxisLabels(labelStrArray){
    var objectRegexDets = {
      re: /(x|y\d+)label "(.*)"/,
      groupObjMapping: ['', 'axis', 'label']
    };

    return genericMatcher(labelStrArray, objectRegexDets);
  }

  function parseLabels(labelStrArray){
    var objectRegexDets = {
      re: /set label "([^"]*)" at ([\d.]+),([\d.]+) (textcolor rgb "([\w|#]+)")?/,
      groupObjMapping: ['', 'label', 'from', 'to', '', 'hexColor']
    };

    return genericMatcher(labelStrArray, objectRegexDets);
  }

  function parseDunno(dunnoStrArray){
    var objectRegexDets = {
      re: /([\d.]+) ([\d.]+)/,
      groupObjMapping: ['', 'a', 'b']
    };

    return genericMatcher(dunnoStrArray, objectRegexDets);
  }

  function genericMatcher(input, outputDets){
     return input.map(function(bla){
        var match = bla.match(outputDets.re);
        var output = {};

        for (var i = 0; i < outputDets.groupObjMapping.length; i++) {
           var name = outputDets.groupObjMapping[i];
           if (typeof name == 'undefined' || name.length < 1) {
              continue;
           }
           output[name] = match[i];
        }

        return output;
     });
  }

  function parseObjects(objectStrArray){
    var objectRegexDets = {
      re: /(\d+) rect from ([\d.]+), ([\d.]+) to ([\d.]+), ([\d.]+) fc rgb "(#[\w]+)"/,
      groupObjMapping: ['', 'id', 'fromX', 'fromY', 'toX', 'toY', 'color']
    };

    return genericMatcher(objectStrArray, objectRegexDets);
  }


  function parseTics(ticStrArray){
     return ticStrArray.map(function(bla){
          // also should prolly share the regex with the partitioner thingy
          // may want to filter out the empty ones earlier?
          // ERGH refactor
          var axis, 
              tics,
              foo = bla.match(/set (x|y)tics out nomirror( \((.+)\))?/);

          axis = foo[1];

          if (!foo || !foo[2] || !foo[3]){
            return {
               axis: axis,
               tics: []
            };
          }

          tics = foo[3].split(',')
                      .map(function(i){
                        var match = i.match(/"(.+)" ([\d.]+)/);
                        return {
                          title: match[1], 
                          position: match[2]
                        };
                      });

         return {
           axis: axis,
           tics: tics
         };
      }); 
  }

   // sweet jesus, rename when more awake
  function findPartsOfOutput(output){
      var lines = output.split('\n');

       // tmp global ofr messing about purposes
      miao = _.chain(lines)
                 .reject(function(line) {
                   return line.match(/^((unset key)|(plot)|(set style)|(e)|$)/);
                  })
                 .groupBy(function(line) {
                  // OK the if statement is a little ropey but its still nicer than before.. 
                  if (line.match(/^set object/)) {
                    return 'objects';
                  } else if (line.match(/^set label/)) {
                    return 'labels';
                  } else if (line.match(/^set (x|y)\d?tics/)) {
                    return 'tics';
                  } else if (line.match(/^set (x|y)\d?range/)) {
                    return 'ranges';
                  } else if (line.match(/^set (x|y)\d?label/)) {
                    return 'axisLabels';
                  } else {
                    return 'dunno';
                  }
                })

        out =  miao.value();

        // moar tmp globally goodness
        out.ranges = parseRanges(out.ranges);
        out.axisLabels = parseAxisLabels(out.axisLabels);
        out.labels = parseLabels(out.labels);
        out.dunno = parseDunno(out.dunno);
        out.tics = parseTics(out.tics);
        out.objects = parseObjects(out.objects);
  }

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process text files. - could warn instead and try to parse anyway?
      if (!f.type.match('text.*')) {
      	console.log('dude thats not a text file its a ' + f.type + ' file');
        continue;
      }

      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
        	var contents = e.target.result;
        	//console.log(contents);
            findPartsOfOutput(contents);

            var data = [24, 57, 98, 12];
            var chart = setupChart(out.objects);
            drawObjects(chart, out.objects);
            drawTicks(chart, out.tics[1].tics);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);