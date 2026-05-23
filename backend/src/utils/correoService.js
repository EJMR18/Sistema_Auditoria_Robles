import nodemailer from 'nodemailer';

// Comentado temporalmente para desarrollo local sin credenciales de correo
// if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//     throw new Error(
//         'EMAIL_USER o EMAIL_PASS no configurados'
//     );
// }

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Blindaje al arrancar la app
transporter.verify((error) => {
    if (error) {
        console.error('Error configurando correo:', error);
    } else {
        console.log('Servicio de correo listo');
    }
});

export const enviarReporteCorreo = async (correoDestino, detalle) => {
    const colorResultado =
        detalle.resultado === 'APROBADA'
            ? 'green'
            : detalle.resultado === 'REPROBADA'
                ? 'red'
                : 'gray';

    const htmlPlantilla = `
        <div style="font-family: Arial, sans-serif; padding:20px; color:#333;">
            <h2 style="color:#0a1f33;">Reporte de Auditoría - Robles S.A.</h2>
            <p>Hola <strong>${detalle.auditado}</strong>,</p>
            <p>Se han generado los resultados de tu evaluación (<strong>${detalle.codigo_auditoria}</strong>).</p>

            <div style="background:#f4f7f6; padding:15px; border-radius:8px; margin:20px 0; border-left:5px solid #b89241;">
                <p><strong>Plantilla:</strong> ${detalle.nombre_plantilla}</p>
                <p><strong>Auditor:</strong> ${detalle.auditor}</p>
                <p><strong>Calificación:</strong> ${detalle.nota !== null ? detalle.nota + '%' : 'N/A'}</p>
                <p>
                    <strong>Resultado final:</strong>
                    <span style="color:${colorResultado}; font-weight:bold;">
                        ${detalle.resultado}
                    </span>
                </p>
            </div>

            <p>Por favor comuníquese con su supervisor para revisar el desglose completo.</p>
            <br/>
            <p>Atentamente,<br><strong>Equipo de Auditoría Robles S.A.</strong></p>
        </div>
    `;

    return transporter.sendMail({
        from: `"Sistema Robles S.A." <${process.env.EMAIL_USER}>`,
        to: correoDestino,
        subject: `Resultados Auditoría ${detalle.codigo_auditoria}`,
        html: htmlPlantilla
    });
};