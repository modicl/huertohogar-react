import React from 'react';
import './AdminDashboard.css';

export function EnConstruccion() {
  return (
    <div className="dashboard-wrapper">
      
      {/* Encabezado */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Sección en Construcción</h1>
        <p className="dashboard-subtitle">Esta funcionalidad estará disponible en la Entrega N°3</p>
      </div>

      {/* Tarjeta Principal */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '500px'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          padding: '60px 40px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center'
        }}>
          
          {/* Icono de Construcción */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 30px',
            background: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(255, 167, 38, 0.3)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <i className="material-icons" style={{
              fontSize: '64px',
              color: '#fff'
            }}>
              construction
            </i>
          </div>

          {/* Título */}
          <h2 style={{
            fontSize: '2em',
            color: '#2c3e50',
            marginBottom: '16px',
            fontWeight: '700'
          }}>
            🚧 Página en Construcción
          </h2>

          {/* Descripción */}
          <p style={{
            fontSize: '1.1em',
            color: '#7f8c8d',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            Esta funcionalidad está siendo desarrollada y estará disponible en la
            <strong style={{ color: '#2c3e50' }}> Entrega N°3</strong>.
          </p>

          {/* Lista de características planeadas */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#2c3e50',
              marginBottom: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="material-icons" style={{ fontSize: '20px', color: '#3498db' }}>
                schedule
              </i>
              Próximamente disponible:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                'Gestión completa de la funcionalidad',
                'Interfaz intuitiva y fácil de usar',
                'Reportes y estadísticas en tiempo real',
                'Integración con el sistema existente'
              ].map((item, index) => (
                <li key={index} style={{
                  padding: '10px 0',
                  color: '#555',
                  fontSize: '0.95em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="material-icons" style={{ 
                    fontSize: '18px', 
                    color: '#27ae60' 
                  }}>
                    check_circle
                  </i>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Información adicional */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <i className="material-icons" style={{ color: '#856404', fontSize: '24px' }}>
              info
            </i>
            <p style={{
              margin: 0,
              color: '#856404',
              fontSize: '0.9em',
              fontWeight: '500'
            }}>
              Estamos trabajando para mejorar tu experiencia
            </p>
          </div>

          {/* Progreso visual */}
          <div style={{ marginTop: '30px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '0.85em',
              color: '#7f8c8d'
            }}>
              <span>Progreso de desarrollo</span>
              <span style={{ fontWeight: '600', color: '#3498db' }}>En proceso...</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e0e0e0',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '45%',
                height: '100%',
                background: 'linear-gradient(90deg, #3498db 0%, #2980b9 100%)',
                borderRadius: '10px',
                animation: 'loading 2s ease-in-out infinite'
              }} />
            </div>
          </div>

        </div>
      </div>

      {/* Estilos de animación inline */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 20px rgba(255, 167, 38, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 12px 28px rgba(255, 167, 38, 0.4);
          }
        }

        @keyframes loading {
          0% {
            width: 45%;
          }
          50% {
            width: 65%;
          }
          100% {
            width: 45%;
          }
        }
      `}</style>

    </div>
  );
}
