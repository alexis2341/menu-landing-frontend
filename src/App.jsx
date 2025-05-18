import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

function App() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  const [estado, setEstado] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado("Enviando...");

    const fecha = new Date().toLocaleString();

    try {
      const response = await fetch("https://menu-landing-backend.onrender.com/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fecha }),
      });

      if (response.ok) {
        setEstado("¡Registro exitoso!");
        setForm({ nombre: "", email: "", telefono: "" });
      } else {
        setEstado("Error al enviar al servidor.");
      }
    } catch (err) {
      console.error(err);
      setEstado("Error de conexión.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Registrate para obtener acceso gratuito</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="email"
          placeholder="Correo electrónico"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
        />
        <br />
        <ReCAPTCHA
          sitekey="6LeMYj4rAAAAAOhRkyrRKSVxLlV0ffjAQEMx2sjZ"
          onChange={handleCaptcha}
        />
        <br />
        <button type="submit" disabled={!captchaValue}>
          Enviar
        </button>
      </form>
      <p>{estado}</p>
    </div>
  );
}

export default App;
