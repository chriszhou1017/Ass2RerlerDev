    	function getDateTimeStr(){
    			var yearToday="";
    			var today = new Date();
   				yearToday += today.getFullYear() ;
    			return yearToday;
				}
		//verify
		function valid(reference){
			if(reference.title == ''){
				alert('Reference title can not be empty!');
				return false;
			}
			if(reference.year != ''){
				if(numReg.test(reference.year)){
					var temp = parseInt(reference.year,10);
					if(temp<0 || temp >yearToday){
						alert('Year is wrong!');
						return false;
						}
					}
				}
			if(reference.journal == ''){
				alert('Reference journal can not be empty!');
				return false;
				}
			if(reference.page != ''){
				if(numReg.test(reference.page)){
					var temp = parseInt(reference.page);
					if(temp <0 ){
						alert("Page number is wrong!");
						return false;
						}
					}
				else{
					alert('Page number can not be empty!');
					return false;
					}
			}
			return true;
		}