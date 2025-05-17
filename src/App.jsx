import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from "@emailjs/browser";

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

    // Agregar la fecha actual
    const fecha = new Date().toLocaleString();

    try {
      // 1. Enviar los datos al backend
      const response = await fetch("https://menu-landing-backend.onrender.com/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fecha }),
      });

      if (response.ok) {
        // 2. Enviar el email con EmailJS
        await emailjs.send(
          "service_lqlw5wk",          // Service ID
          "template_0sb5w7j",         // Template ID
          {
            nombre: form.nombre,
            email: form.email,
            telefono: form.telefono,
            fecha: fecha,
          },
          "xdqQBMmoWcDcb4tYf"         // Public Key
        );

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
          sitekey="TU_CLAVE_DEL_CLIENTE_RECAPTCHA"
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
