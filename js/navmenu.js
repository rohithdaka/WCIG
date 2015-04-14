d3.json("js/contents.json",function(error,data){
    if (error) return console.log(error);
    console.log(data);
    
    var ToC = d3.selectAll("#codingChapters")
            .data(data);
    
    



});