import { useEffect, useState } from "react";
import React from "react";

const Home = () => {
	const url = "https://playground.4geeks.com/todo";
	const [userName, setUserName] = useState('Orangel')

	const [userData, setUserData] = useState({ todos: [] });
	const [tarea, setTarea] = useState("");

	const crearUsuario = async () => {
		try {
			const resp = await fetch(`${url}/users/${userName}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!resp.ok) throw new Error("Algo salió mal al crear el usuario!");
			const data = await resp.json();
			console.log("Usuario creado:", data);
		} catch (error) {
			console.error(error.message);
		}
	};


	const deleteTodo = async (id) => {
		try {
		  const response = await fetch(`${url}/todos/${id}`, {
			method: 'DELETE',
		  });
	  
		  if (!response.ok) {
			throw new Error('Error al eliminar la tarea');
		  }
	  
		  setUserData((data) => ({
			...data,
			todos: data.todos.filter((todo) => todo.id !== id),
		  }));
		} catch (error) {
		  console.error(error);
		}
	  };
	
	const obtenerDatosUsuario = async () => {
		try {
			const resp = await fetch(`${url}/users/${userName}`);
			if (!resp.ok) throw new Error("Algo salió mal al obtener datos del usuario!");
			const data = await resp.json();
			setUserData(data);
		} catch (error) {
			console.error(error);
		}
	};

	
	const crearTarea = async () => {
		const payload = {
			label: tarea,
			is_done: false,
		};

		try {
			const resp = await fetch(`${url}/todos/${userName}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (!resp.ok) throw new Error("Algo salió mal al crear la tarea!");
			await resp.json();
			setTarea("");
			obtenerDatosUsuario();
		} catch (error) {
			console.error(error);
		}
	};

	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (tarea.trim() !== "") {
			crearTarea();
		}
	};


	useEffect(() => {
		const inicializar = async () => {
			await crearUsuario();
			await obtenerDatosUsuario();
		};
		inicializar();
	}, []);

	return (
		<div className="text-center container" style={{ padding: "20px" }}>
			<h1>Lista de Tareas</h1>

			<form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
				<input
				className="inputTarea"
					type="text"
					placeholder="Agregar Tarea"
					value={tarea}
					onChange={(e) => setTarea(e.target.value)}
					required
					style={{ padding: "8px", marginRight: "10px" }}
				/>
				<button className="botonAgregar" type="submit" style={{ padding: "8px" }}>
					Agregar
				</button>
			</form>

			<ul style={{ listStyle: "none", padding: 0 }}>
				{userData.todos && userData.todos.length > 0 ? (
					userData.todos.map((el, index) => (
						<li className="border border-Secondary text-secondary" key={el.id || index} style={{ marginBottom: "10px" }}>
							{el.label}{" "}
							<button
								onClick={() => deleteTodo(el.id)}
							>
							X
							</button>
						</li>
					))
				) : (
					<p>No hay tareas disponibles.</p>
				)}
			</ul>
			<div className="numeroLength border" >
            <p className="text-secondary">Tareas Pendientes {userData.todos.length}</p>
			</div>
		</div>
	);
};

export default Home;