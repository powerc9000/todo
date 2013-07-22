(function(){
	var tasks = document.querySelectorAll(".tasks")[0];
	var textBox = document.getElementById("newTaskText");
	var button = document.getElementById("newTask");
	var taskJson = [];
	var editing = false;
	var editedElement;
	button.addEventListener("click", userNewTask);
	function create(element){
		var holder = document.createElement("div"),
			frag = document.createDocumentFragment();
		holder.innerHTML = element;
		while(holder.firstChild){
			frag.appendChild(holder.firstChild);
		}
		return frag.firstChild;
	}
	function newTask(text, id, init, complete){
		var id = id || uniqueId();
		var task = create("<li class='task' data-id='"+id+"'><p>"+text+"</p></li>");
		var checkbox = create("<input type='checkbox'>");
		var edit = create("<a href='#'>(edit)</a>")
		task = tasks.appendChild(task);
		checkbox = task.appendChild(checkbox);
		edit = task.appendChild(edit);
		edit.addEventListener("click", editTask);
		checkbox.addEventListener("click", toggleComplete);
		if(!init){
			taskJson.push({text:text, complete:false, id:id});
			localStorage["tasks"] = JSON.stringify(taskJson);
		}
		else{
			if(complete){
				task.classList.add("complete");
				checkbox.checked = true;
			}
		}
		
	}

	function editTask(e){
		editing = true;
		console.log(this.parentNode);
		textBox.value = this.parentNode.firstChild.textContent;
		editedElement = this.parentNode;
		button.innerHTML = "Edit";
		e.preventDefault();
	}

	function toggleComplete(){
		if(this.checked){
			this.parentNode.classList.add("complete");
		}
		else{
			this.parentNode.classList.remove("complete");
		}
		editJson(this.parentNode.getAttribute("data-id"), "", this.checked);
	}

	function userNewTask(){
		var text = textBox.value;
		if(!editing){
			newTask(text);
		}
		else{
			editedElement.firstChild.textContent = text;
			editJson(editedElement.getAttribute("data-id"), text, -1);
			editing = false;
			button.innerHTML = "Add New Task";
		}
		textBox.value = "";
	}
	function init(){
		var tasks = localStorage["tasks"] && JSON.parse(localStorage["tasks"]);
		console.log(typeof tasks);
		if(tasks){
			tasks.forEach(function(t){
				newTask(t.text, t.id, true, t.complete);
			});
			taskJson = tasks;
		}
		
	}

	function editJson(id, text, complete){
		taskJson.forEach(function(t){
			console.log(t.id, id)
			if(t.id === id){
				if(text){
					t.text = text;
				}
				if(complete !== -1){
					t.complete = complete;
				}
			}
		});
		console.log(taskJson);
		localStorage["tasks"] = JSON.stringify(taskJson);
	}

	function uniqueId(){
	    // always start with a letter (for DOM friendlyness)
	    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
	    do {                
	        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
	        var ascicode=Math.floor((Math.random()*42)+48);
	        if (ascicode<58 || ascicode>64){
	            // exclude all chars between : (58) and @ (64)
	            idstr+=String.fromCharCode(ascicode);    
	        }                
	    } while (idstr.length<32);

	    return (idstr);
	}
	init();
}());