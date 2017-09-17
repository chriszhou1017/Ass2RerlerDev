var formatHandler={};

formatHandler.convertApa=function(apaString){
	let barrier = 0;
	let _author=''; 
	let _year = '';
	let _title='';
	let _journal='';

	let length = apaString.length;

	for(let i = barrier ,max = length;i<max;i++ ) {
			var c = apaString.charAt(i);
			if(c == '('){
				
				_author = apaString.substring(barrier,i).trim();
				barrier=i;
				break;
			}
	}

	for(let i = barrier ,max = length;i<max;i++ ) {
			var c = apaString.charAt(i);
			if(c == ')'){
				
				_year = apaString.substring(barrier+1,i).trim();
				barrier=i;
				break;
			}
	}
	let title_time =0;
	for(let i = barrier ,max = length;i<max;i++ ) {
			var c = apaString.charAt(i);
			if(c == '.'){
				if(title_time==0){
					title_time+=1;
					barrier=i;
					continue;
				}

				_title = apaString.substring(barrier+1,i).trim();
				barrier=i;
				break;
			}
	}

	for(let i = barrier ,max = length;i<max;i++ ) {
			var c = apaString.charAt(i);
			if(c == ','){				
				_journal = apaString.substring(barrier+1,i).trim();
				barrier=i;
				break;
			}
	}
		
		return {
			author:_author,
			year:_year,
			title:_title,
			journal:_journal

		}
};




module.exports = formatHandler;