import { useEffect, useState } from "react";
import axios from "axios";
import scss from "../todos/TodoList.module.scss";
const url =
	"https://elchocrud.pro/api/v1/bff09c51fd75018cb7fd9e0b0ae7ec69/todo";

const TodoList = () => {
	const [todo, setTodo] = useState([]);
	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");
	const [description, setDescription] = useState("");
	const [isEdit, setIsEdit] = useState(false);
	const [editID, setEditID] = useState("");
	const [editValues, setEditValues] = useState({
		title: "",
		image: "",
		description: "",
	});
	//  !------------------------------------------------

	const handleAdd = async () => {
		const newData = {
			title: title,
			image: image,
			description: description,
		};
		const response = await axios.post(url, newData);
		console.log(response.data);
		setTodo(response.data);
	};

	//!------------------------------------------------------------

	const getTodos = async () => {
		const response = await axios.get(url);
		setTodo(response.data);
	};

	const deleteTodo = async (id) => {
		const response = await axios.delete(`${url}/${id}`);
		setTodo(response.data);
	};
	// !-----------------------------------------------------------------
	const deleteAllTodo = () => {
		setTodo([]);
	};
	//! ----------------------------------------------------------------
	const updateTodo = async (id) => {
		const updatedData = {
			title: editValues.title,
			image: editValues.image,
			description: editValues.description,
		};

		try {
			const response = await axios.put(`${url}/${id}`, updatedData);

			setTodo(response.data);

			setEditID("");
			setIsEdit(false);

			setEditValues({
				title: "",
				image: "",
				description: "",
			});
		} catch (error) {
			console.error("Error updating todo:", error);
		}
	};

	// !-----------------------------------------------------

	const patchTodo = async (id, updatedData) => {
		try {
			const response = await axios.patch(`${url}/${id}`, updatedData);

			setTodo(response.data);

			setEditID("");
			setIsEdit(false);

			setEditValues({
				title: "",
				image: "",
				description: "",
			});
		} catch (error) {
			console.error("Ошибка при обновлении задачи:", error);
		}
	};

	// !---------------------------------------------

	useEffect(() => {
		getTodos();
	}, []);

	//!  -----------------------------------

	return (
		<div className={scss.container}>
			<div className={scss.form}>
				<h1>TodoList: </h1>

				<input
					type="text"
					placeholder="title"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<input
					type="text"
					placeholder="image"
					value={image}
					onChange={(e) => {
						setImage(e.target.value);
					}}
				/>
				<input
					type="text"
					placeholder="description"
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
					}}
				/>

				<button onClick={handleAdd}>Add</button>
				<button onClick={deleteAllTodo}>Delete All</button>
			</div>

			<div className={scss.todoList}>
				{todo.map((item) => (
					<div key={item._id} className={scss.todoItem}>
						{isEdit && editID === item._id ? (
							<>
								<input
									type="text"
									placeholder="title"
									value={editValues.title}
									onChange={(e) => {
										setEditValues({ ...editValues, title: e.target.value });
									}}
								/>
								<input
									type="text"
									placeholder="image"
									value={editValues.image}
									onChange={(e) => {
										setEditValues({ ...editValues, image: e.target.value });
									}}
								/>
								<input
									type="text"
									placeholder="description"
									value={editValues.description}
									onChange={(e) => {
										setEditValues({
											...editValues,
											description: e.target.value,
										});
									}}
								/>

								<button
									onClick={() => {
										updateTodo(item._id);
										patchTodo(item._id, {
											title: editValues.title,
											image: editValues.image,
											description: editValues.description,
										});
									}}>
									Save
								</button>
							</>
						) : (
							<>
								<img src={item.image} alt={item.title} />

								<div className={scss.textBox}>
									<h3>Name: {item.title}</h3>
									<p>Description: {item.description}</p>
								</div>
							</>
						)}
						<div className={scss.buttons}>
							<button
								onClick={() => {
									deleteTodo(item._id);
								}}>
								Delete~
							</button>

							<button
								onClick={() => {
									setIsEdit(true);
									setEditID(item._id);
									setEditValues({
										title: item.title,
										image: item.image,
										description: item.description,
									});
								}}>
								Edit
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TodoList;
