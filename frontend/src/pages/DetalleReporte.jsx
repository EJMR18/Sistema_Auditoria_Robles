import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import api from "../api/axios"; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DetalleReporte = () => { 
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarInputCorreo, setMostrarInputCorreo] = useState(false);
  const [correoDestino, setCorreoDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        setCargando(true);
        const res = await api.get(`/reporte/${id}`);
        
        if (res.data && res.data.estado === 'exito') {
            setDetalle(res.data.datos);
        }
        setError(null);
      } catch (err) {
        console.error("Error al obtener detalle del reporte:", err);
        setError("Hubo un problema al cargar los detalles del reporte.");
      } finally {
        setCargando(false);
      }
    };

    obtenerDetalle();
  }, [id]);

  // ==========================================
  // MÉTODO PARA GENERAR EL PDF Y DESCARGARLO
  // ==========================================
  const generarPDF = () => {
    if (!detalle) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const fechaFormateada = new Intl.DateTimeFormat('es-SV', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(detalle.fecha_fin));

    // Cabecera
    doc.setFontSize(18);
    doc.setTextColor(10, 31, 51); 
    doc.text('Reporte de Auditoría - Robles S.A.', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Código: ${detalle.codigo_auditoria}`, 14, 30);
    doc.text(`Plantilla: ${detalle.nombre_plantilla}`, 14, 36);
    doc.text(`Auditor: ${detalle.auditor}`, 14, 42);
    doc.text(`Auditado: ${detalle.auditado}`, 14, 48);

    doc.text(`Fecha: ${fechaFormateada}`, 120, 30);
    doc.text(`Planta: ${detalle.nombre_planta || 'N/A'}`, 120, 36);
    doc.text(`Área: ${detalle.nombre_area || 'N/A'}`, 120, 42);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Calificación: ${detalle.nota !== null ? detalle.nota + '%' : 'N/A'}`, 120, 48);
    
    if (detalle.resultado === 'APROBADA') {
        doc.setTextColor(0, 120, 0); 
    } else if (detalle.resultado === 'REPROBADA') {
        doc.setTextColor(180, 0, 0); 
    } else {
        doc.setTextColor(120, 120, 120); 
    }
    doc.text(`Resultado: ${detalle.resultado}`, 120, 54);
    
    doc.setTextColor(50, 50, 50);

    // Preparar filas con blindaje por si no hay respuestas
    const filas = detalle.respuestas?.map(r => [
      r.num_pregunta, 
      r.texto_pregunta,
      r.valor_respuesta,
      r.observacion || '-',
      r.criticidad || '-'
    ]) || [];

   // Solo dibujar tabla si existen respuestas
    if (filas.length > 0) {
        const columnas = ["#", "Pregunta", "Resp.", "Observación", "Criticidad"];
        // CORRECCIÓN PARA VITE: Se pasa 'doc' como primer parámetro
        autoTable(doc, {
          startY: 62, 
          head: [columnas],
          body: filas,
          theme: 'grid',
          headStyles: { fillColor: [10, 31, 51], textColor: 255 }, 
          styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' }, 
            1: { cellWidth: 70 }, 
            2: { cellWidth: 15, halign: 'center' }, 
            3: { cellWidth: 'auto' }, 
            4: { cellWidth: 20, halign: 'center' } 
          },
          didDrawPage: function(data) {
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150); 
            doc.text(
              `Página ${data.pageNumber}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 10
            );
            doc.setTextColor(0, 0, 0);
          }
        });
    } else {
        doc.setFont("helvetica", "italic");
        doc.text("No se registraron respuestas para esta auditoría.", 14, 65);
    }

    doc.save(`Reporte_${detalle.codigo_auditoria}.pdf`);
  };

  const enviarCorreo = async () => {
    const correoLimpio = correoDestino?.trim();

    if (!correoLimpio) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    try {
        setEnviandoCorreo(true);

        const res = await api.post(
            `/reporte/${id}/enviar`,
            { correoDestino: correoLimpio }
        );

        if (res.data?.estado === 'exito') {
            alert("¡Correo enviado exitosamente!");

            setMostrarInputCorreo(false);
            setCorreoDestino("");
        }

    } catch (err) {
        console.error(
            "Error al enviar correo:",
            err.response?.data || err
        );

        alert(
            err.response?.data?.mensaje ||
            "Hubo un error al enviar el correo."
        );
      } finally {
        setEnviandoCorreo(false);
    }
  };

  if (cargando) return <div style={styles.container}><p>Cargando información del reporte...</p></div>;
  if (error) return <div style={styles.container}><p style={{color: 'red'}}>{error}</p></div>;
  if (!detalle) return <div style={styles.container}><p>No se encontró el reporte.</p></div>;

  return (
    <div style={styles.container}>
      {/* 1. ENCABEZADO Y BOTONES DE ACCIÓN */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Reporte de Auditoría</h1>
          <p style={styles.subtitulo}>{detalle.codigo_auditoria}</p>
        </div>

       <div style={styles.botonesWrapper}>
            <button style={styles.btnVolver} onClick={() => navigate(-1)}>
                ← Volver
            </button>
            
            <button style={styles.btnPDF} onClick={generarPDF}>
                📄 Descargar PDF
            </button>

            {/* INTERFAZ DINÁMICA DEL CORREO */}
              {mostrarInputCorreo ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    value={correoDestino}
                    onChange={(e) => setCorreoDestino(e.target.value)}
                    disabled={enviandoCorreo} // Bloquea escribir más
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #ccc', 
                        outline: 'none',
                        fontFamily: 'inherit',
                        opacity: enviandoCorreo ? 0.6 : 1 // Efecto visual de apagado
                   }}
                      />
        
                      <button 
                      style={{
                      ...styles.btnCorreo, 
                      opacity: enviandoCorreo ? 0.6 : 1, 
                      cursor: enviandoCorreo ? 'wait' : 'pointer'
                      }} 
                      onClick={enviarCorreo}
                      disabled={enviandoCorreo} // Bloquea el doble clic
                  >
                      {enviandoCorreo ? "Enviando..." : "Confirmar Envío"}
                  </button>

                  <button 
                      style={{...styles.btnVolver, opacity: enviandoCorreo ? 0.6 : 1}} 
                      onClick={() => setMostrarInputCorreo(false)}
                      disabled={enviandoCorreo} // Que no pueda cancelar a medio envío
                  >
                      Cancelar
                  </button>
                </div>
                ) : (
                <button style={styles.btnCorreo} onClick={() => setMostrarInputCorreo(true)}>
                    ✉️ Enviar por Correo
                </button>
            )}
         </div>
      </header>

      {/* 2. TARJETAS DE INFORMACIÓN GENERAL */}
      <div style={styles.gridInfo}>
          <div style={styles.cardInfo}>
              <h4 style={styles.cardTitulo}>Datos de la Evaluación</h4>
              <p><strong>Plantilla:</strong> {detalle.nombre_plantilla}</p>
              <p><strong>Auditor:</strong> {detalle.auditor}</p>
              <p><strong>Auditado:</strong> {detalle.auditado}</p>
              <p><strong>Fecha Fin:</strong> {new Date(detalle.fecha_fin).toLocaleString()}</p>
          </div>
          <div style={styles.cardInfo}>
              <h4 style={styles.cardTitulo}>Ubicación</h4>
              <p><strong>Planta:</strong> {detalle.nombre_planta || 'N/A'}</p>
              <p><strong>Área:</strong> {detalle.nombre_area || 'N/A'}</p>
          </div>
          <div style={styles.cardInfo}>
              <h4 style={styles.cardTitulo}>Resultados</h4>
              <p><strong>Estado:</strong> {detalle.estado}</p>
              <p><strong>Calificación:</strong> {detalle.nota !== null ? `${detalle.nota}%` : 'N/A'}</p>
              <p><strong>Resolución:</strong> 
                  <span style={{
                      ...styles.tagBase,
                      ...(detalle.resultado === 'APROBADA' ? styles.tagAprobada : 
                          detalle.resultado === 'REPROBADA' ? styles.tagReprobada : styles.tagNeutro)
                  }}>
                      {detalle.resultado}
                  </span>
              </p>
          </div>
      </div>

      {/* 3. TABLA DE RESPUESTAS Y HALLAZGOS */}
      <div style={styles.tablaWrapper}>
        <h3 style={{color: '#0a1f33', marginBottom: '15px'}}>Desglose de Hallazgos</h3>
        <div style={{ overflowX: 'auto' }}>
            <table style={styles.tabla}>
                <thead>
                    <tr style={styles.filaHeader}>
                        <th style={{width: '5%'}}>#</th>
                        <th style={{width: '45%'}}>Pregunta</th>
                        <th style={{width: '10%', textAlign: 'center'}}>Respuesta</th>
                        <th style={{width: '30%'}}>Observación</th>
                        <th style={{width: '10%', textAlign: 'center'}}>Criticidad</th>
                    </tr>
                </thead>
                <tbody>
                    {/* BLINDADO CON ? PARA EVITAR PANTALLA BLANCA */}
                    {detalle.respuestas?.map((r) => (
                        <tr key={r.id_respuesta} style={styles.filaBody}>
                            <td style={styles.celda}>{r.num_pregunta}</td>
                            <td style={styles.celda}>{r.texto_pregunta}</td>
                            <td style={{...styles.celda, textAlign: 'center'}}>
                                <strong>{r.valor_respuesta}</strong>
                            </td>
                            <td style={styles.celda}>{r.observacion || '-'}</td>
                            <td style={{...styles.celda, textAlign: 'center'}}>
                                {r.criticidad ? (
                                    <span style={{
                                        ...styles.tagBase,
                                        ...(r.criticidad === 'ALTA' || r.criticidad === 'CRITICA' ? styles.tagAlta :
                                            r.criticidad === 'MEDIA' ? styles.tagMedia : styles.tagBaja)
                                    }}>
                                        {r.criticidad}
                                    </span>
                                ) : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// --- ESTILOS ADAPTADOS ---
const styles = {
  container:{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  titulo: { margin: 0, color: '#0a1f33', fontSize: '1.8rem' },
  subtitulo: { margin: 0, color: '#7f8c8d', fontSize: '1rem', fontWeight: 'bold' },
  
  botonesWrapper: { display: 'flex', gap: '10px' },
  btnVolver: { backgroundColor: 'white', color: '#0a1f33', border: '1px solid #0a1f33', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnPDF: { backgroundColor: '#b89241', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnCorreo: { backgroundColor: '#0a1f33', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },

  gridInfo: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' },
  cardInfo: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', lineHeight: '1.6', fontSize: '0.9rem' },
  cardTitulo: { margin: '0 0 10px 0', color: '#0a1f33', borderBottom: '1px solid #eee', paddingBottom: '5px' },

  tablaWrapper: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  tabla: { width: '100%', borderCollapse: 'collapse' },
  filaHeader: { borderBottom: '2px solid #f1f1f1', textAlign: 'left', color: '#7f8c8d', fontSize: '0.85rem' },
  filaBody: { borderBottom: '1px solid #f1f1f1' },
  celda: { padding: '12px 10px', fontSize: '0.9rem' },
  
  tagBase: { padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block', marginLeft: '5px' },
  tagAprobada: { backgroundColor: '#d4edda', color: '#155724' },
  tagReprobada: { backgroundColor: '#f8d7da', color: '#721c24' },
  tagNeutro: { backgroundColor: '#e2e3e5', color: '#383d41' },
  
  tagBaja: { backgroundColor: '#d1ecf1', color: '#0c5460' },
  tagMedia: { backgroundColor: '#fff3cd', color: '#856404' },
  tagAlta: { backgroundColor: '#f8d7da', color: '#721c24' }
};

export default DetalleReporte;