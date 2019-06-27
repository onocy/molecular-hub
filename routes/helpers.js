module.exports =  function filewalker(dir, done) {
    let results = [];    
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file){
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat){
                if (stat && stat.isDirectory()) {
                    // results.push(file);
                    filewalker(file, function(err, res){
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};