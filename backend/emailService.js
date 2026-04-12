const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarCorreo = async ({ destinatario, asunto, mensaje }) => {
  try {
    await transporter.sendMail({
      from: `"Repositorio de Tareas" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      html: mensaje
    });
    console.log(`Correo enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error enviando correo:', error.message);
    // No lanzamos el error para que no interrumpa la respuesta principal
  }
};

module.exports = { enviarCorreo };