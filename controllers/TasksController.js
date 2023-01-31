const TodoTask = require("../models/TodoTask.js");

const requestValidation = (allowedParams, req) => {
    const request = Object.keys(req.body);
    const isValid = request.filter(item => allowedParams.includes(item));
    return isValid;
}

exports.getAll = async (req, res) => {
    TodoTask.find({ deleted_at: null }).then((tasks) => { 
        if(!tasks){
            res.status(404).send({ message: "Data not found"});
        }
        const activeTasks = tasks.filter(task => task.status !== true);
        res.send({ todoTasks: tasks, count: activeTasks.length}); 
    })
    .catch(err => {
        res.status(500).send ({ message: "Something went wrong...", error: err });
    });
}

exports.getById = async (req, res) => {
    const { id } = req.params;
    try{
        TodoTask.findById({ _id: id }).then((task) => {
            if(!task){
                res.status(404).send({ message: "Data not found"});
            }
            res.status(200).send({ message: "OK", task });
        });
    }catch(err){
        res.status(500).send ({ message: "Something went wrong...", error: err });
    }
};

exports.deleteById = async (req, res) => { 
    const { id } = req.params; 
	const deleteDate = Date.now();
    TodoTask.findByIdAndUpdate({ _id: id }, { 
        isDeleted: true, 
        deleted_at: deleteDate 
    }, { new: true })
    .then((task) => {
        res.status(200).send({ message: "Task successfully deleted.", id: task.id });
    })
    .catch(err => {
        res.status(500).send ({ message: "Something went wrong...", error: err });
    });
};

exports.addTask = async (req, res) => {
    const { content } = req.body;
    const allowedParams = ["content"];
    if(requestValidation(allowedParams, req)){ 
        try {
            const newTask = new TodoTask({ content });
            newTask.save();
            res.status(200).send({ message: "Task successfully added.", task: newTask});
        } catch(err) {
            res.status(500).send({ message: "Something went wrong...", error: err });
        }
    }else{
        res.status(400).send({ message: "Invalid Request!" });
    }
};

exports.statusUpdate = async (req, res) => { 
    const { id } = req.params;
    const { status } = req.body;
	const updateDate = Date.now();
    const allowedParams = ["status"];
    if(requestValidation(allowedParams, req)){
        TodoTask.findByIdAndUpdate({ _id: id }, { 
            status: status, 
            updated_at: updateDate, 
            filter: status ? "completed":"active" 
        }, { new: true })
        .then((task) => {
            res.status(200).send({ message: "Task successfully updated.", task });
        })
        .catch(err => {
            res.status(500).send ({ message: "Something went wrong...", error: err });
        });
    }else{
        res.status(400).send({ message: "Invalid Request!" });
    }
}

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
	if (!content) {
		return res.status(404).send({ message: "Task not found. Please fill the given field" });
	};
    const updateDate = Date.now();
    const allowedParams = ["content"];
    if(requestValidation(allowedParams, req)){
        TodoTask.findOneAndUpdate({ _id: id }, {
            $set: {
                content: content,
                updated_at: updateDate
            }
        },{ new: true }).then(task => {
            res.status(200).send({ message: "Task content successfully updated.", task});
        }).catch(err => {
            res.status(500).send ({ message: "Something went wrong...", error: err });
        });
    }else{
        res.status(400).send({ message: "Invalid Request!" });
    }
}

exports.markAll = async (req, res) => { 
    const { status } = req.body;
	const updateDate = Date.now();
    const allowedParams = ["status"];
    if(requestValidation(allowedParams, req)){
        TodoTask.updateMany({ deleted_at: null }, { 
            $set: { 
                status: status,  
                updated_at: updateDate, 
                filter: status? "completed":"active" 
            }
        }, { new: true })
        .then((tasks) => {
            res.status(200).send({ message: "OK", tasks });
        })
        .catch(err => {
            res.status(500).send ({ message: "Something went wrong...", error: err });
        });
    }else{
        res.status(400).send({ message: "Invalid Request!" });
    }
}

exports.clearCompleted = async (req, res) => {
	const deleteDate = Date.now();
    TodoTask.updateMany({ deleted_at: null, status: true }, { 
        $set: {
            isDeleted: true, 
            deleted_at: deleteDate 
        }
    }, { new: true})
    .then((tasks) => {
        res.status(200).send({ message: "Tasks successfully cleared.", ...tasks}); 
    })
    .catch(err => {
        res.status(500).send ({ message: "Something went wrong...", error: err });
    });
}

exports.filter = async (req, res) => {
    const { filter } = req.params;
    const tasks = TodoTask.find({ deleted_at: null });
    try{
        switch(filter){
            case "all":
                tasks.then(tasks => { res.send(tasks); });
            break;
            case "active":
                tasks.find({ filter: "active" }).then(tasks => res.send(tasks));
            break;
            case "completed":
                tasks.find({ filter: "completed" }).then(tasks => res.send(tasks));
            break;
            default:
                res.status(404).send({ message: "Data not found" }); 
            break;
        }
    }catch(err){
        res.status(500).send({ message: "An Error occured", error: err });
    }
}